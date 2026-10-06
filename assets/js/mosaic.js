/* ==========================================================
   Go-Profil — effet mosaïque et interactions
   - Titres [data-mosaic] : chaque lettre est découpée en éclats
     qui tombent et s'assemblent.
   - Images .mosaic-img : la photo est découpée en tesselles qui
     tombent une à une, puis la vraie image prend le relais.
   Aucune configuration nécessaire : tout est automatique.
   ========================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canAnimate = !reduceMotion && typeof Element.prototype.animate === 'function';

  function rand(min, max) { return min + Math.random() * (max - min); }

  /* Déclenche fn(el) la première fois que el devient visible. */
  var whenVisible = (function () {
    if (!('IntersectionObserver' in window)) {
      return function (el, fn) { fn(el); };
    }
    var callbacks = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var fn = callbacks.get(entry.target);
        callbacks.delete(entry.target);
        if (fn) fn(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    return function (el, fn) { callbacks.set(el, fn); io.observe(el); };
  })();

  /* ---------------- Titres ---------------- */

  /* Grille de points légèrement décalés : chaque lettre est découpée en
     polygones irréguliers qui s'emboîtent parfaitement. */
  function shardPolygons(cols, rows) {
    var pts = [];
    for (var y = 0; y <= rows; y++) {
      pts[y] = [];
      for (var x = 0; x <= cols; x++) {
        var px = (x / cols) * 100;
        var py = (y / rows) * 100;
        if (x > 0 && x < cols) px += rand(-0.3, 0.3) * (100 / cols);
        if (y > 0 && y < rows) py += rand(-0.3, 0.3) * (100 / rows);
        pts[y][x] = px.toFixed(1) + '% ' + py.toFixed(1) + '%';
      }
    }
    var polys = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var a = pts[r][c], b = pts[r][c + 1], d = pts[r + 1][c + 1], e = pts[r + 1][c];
        if (Math.random() < 0.45) {
          // Coupe la case en deux triangles
          if (Math.random() < 0.5) { polys.push([a, b, d]); polys.push([a, d, e]); }
          else { polys.push([a, b, e]); polys.push([b, d, e]); }
        } else {
          polys.push([a, b, d, e]);
        }
      }
    }
    return polys;
  }

  function splitTitle(el) {
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    var letters = [];

    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 1) { walk(child); return; }
        if (child.nodeType !== 3) return;
        var frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var word = document.createElement('span');
          word.className = 'm-word';
          Array.from(part).forEach(function (ch) {
            var letter = document.createElement('span');
            letter.className = 'm-letter';
            var base = document.createElement('span');
            base.className = 'm-base';
            base.textContent = ch;
            letter.appendChild(base);
            letters.push(letter);
            word.appendChild(letter);
          });
          frag.appendChild(word);
        });
        child.parentNode.replaceChild(frag, child);
      });
    }

    walk(el);
    // Les lecteurs d'écran lisent le titre normalement.
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 1) n.setAttribute('aria-hidden', 'true');
    });
    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = label;
    el.insertBefore(sr, el.firstChild);
    return letters;
  }

  function animateTitle(el, letters) {
    var size = parseFloat(getComputedStyle(el).fontSize) || 40;
    var animations = [];
    el.classList.remove('m-attente');

    letters.forEach(function (letter, i) {
      var ch = letter.firstChild.textContent;
      shardPolygons(2, 3).forEach(function (poly) {
        var f = document.createElement('span');
        f.className = 'm-frag';
        f.setAttribute('aria-hidden', 'true');
        f.textContent = ch;
        f.style.clipPath = 'polygon(' + poly.join(',') + ')';
        f.style.webkitClipPath = f.style.clipPath;
        letter.appendChild(f);
        var fall = -(size * rand(2.5, 6));
        animations.push(f.animate([
          { transform: 'translate(' + rand(-0.6, 0.6) * size + 'px,' + fall + 'px) rotate(' + rand(-70, 70) + 'deg)', opacity: 0 },
          { opacity: 1, offset: 0.25 },
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 }
        ], {
          duration: rand(650, 1000),
          delay: i * 45 + rand(0, 350),
          easing: 'cubic-bezier(.25, 1.25, .45, 1)',
          fill: 'backwards'
        }));
      });
    });

    // Une fois tout posé : on remet le texte normal (plus net).
    Promise.all(animations.map(function (a) { return a.finished; })).then(function () {
      letters.forEach(function (letter) {
        letter.classList.add('est-pose');
        Array.prototype.slice.call(letter.querySelectorAll('.m-frag')).forEach(function (f) { f.remove(); });
      });
    }).catch(function () {});
  }

  function initTitle(el) {
    el.classList.add('m-pret');
    if (!canAnimate) return;
    var letters = splitTitle(el);
    el.classList.add('m-attente');
    whenVisible(el, function () { animateTitle(el, letters); });
  }

  /* ---------------- Images ---------------- */

  function imageReady(img, fn) {
    if (img.complete && img.naturalWidth) { fn(); return; }
    img.addEventListener('load', fn, { once: true });
    img.addEventListener('error', fn, { once: true });
  }

  function animateImage(wrap) {
    var img = wrap.querySelector('img');
    if (!img) return;
    wrap.classList.remove('est-pose');
    var old = wrap.querySelector('.m-tesselles');
    if (old) old.remove();

    imageReady(img, function () {
      var W = img.clientWidth, H = img.clientHeight;
      var nw = img.naturalWidth, nh = img.naturalHeight;
      if (!canAnimate || !W || !H || !nw) { wrap.classList.add('est-pose'); return; }

      // Reproduit le cadrage « object-fit: cover » de l'image.
      var scale = Math.max(W / nw, H / nh);
      var dw = nw * scale, dh = nh * scale;
      var ox = (W - dw) / 2, oy = (H - dh) / 2;

      var cols = Math.max(5, Math.min(16, Math.round(W / 70)));
      var tile = W / cols;
      var rows = Math.max(3, Math.round(H / tile));
      var th = H / rows;

      var layer = document.createElement('div');
      layer.className = 'm-tesselles';
      layer.style.left = img.offsetLeft + 'px';
      layer.style.top = img.offsetTop + 'px';
      layer.style.width = W + 'px';
      layer.style.height = H + 'px';
      layer.style.right = 'auto';
      layer.style.bottom = 'auto';
      var src = 'url("' + (img.currentSrc || img.src).replace(/"/g, '\\"') + '")';
      var animations = [];

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var x = c * tile, y = r * th;
          var t = document.createElement('div');
          t.className = 'm-tesselle';
          t.style.left = x + 'px';
          t.style.top = y + 'px';
          t.style.width = (tile + 0.6) + 'px';
          t.style.height = (th + 0.6) + 'px';
          t.style.backgroundImage = src;
          t.style.backgroundSize = dw + 'px ' + dh + 'px';
          t.style.backgroundPosition = (ox - x) + 'px ' + (oy - y) + 'px';
          layer.appendChild(t);
          // Les rangées du bas se posent en premier, comme un mur qu'on monte.
          var delay = (rows - 1 - r) * 70 + rand(0, 420);
          animations.push(t.animate([
            { transform: 'translate(' + rand(-30, 30) + 'px,' + -(y + th + rand(60, 260)) + 'px) rotate(' + rand(-35, 35) + 'deg) scale(.85)', opacity: 0 },
            { opacity: 1, offset: 0.2 },
            { transform: 'none', opacity: 1 }
          ], {
            duration: rand(600, 900),
            delay: delay,
            easing: 'cubic-bezier(.3, 1.3, .5, 1)',
            fill: 'backwards'
          }));
        }
      }
      wrap.appendChild(layer);

      Promise.all(animations.map(function (a) { return a.finished; })).then(function () {
        wrap.classList.add('est-pose');
        setTimeout(function () { layer.remove(); }, 260);
      }).catch(function () { wrap.classList.add('est-pose'); layer.remove(); });
    });
  }

  function initImage(wrap) {
    if (wrap.hasAttribute('data-mosaic-manuel')) return;
    whenVisible(wrap, animateImage);
  }

  /* Images Markdown classiques dans les articles : on les entoure aussi. */
  function wrapProseImages() {
    Array.prototype.slice.call(document.querySelectorAll('.prose img')).forEach(function (img) {
      if (img.closest('.mosaic-img')) return;
      var wrap = document.createElement('span');
      wrap.className = 'mosaic-img';
      wrap.style.display = 'block';
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
    });
  }

  /* ---------------- Interactions ---------------- */

  function initSteps() {
    Array.prototype.slice.call(document.querySelectorAll('[data-etapes]')).forEach(function (root) {
      var buttons = root.querySelectorAll('[data-etape]');
      var visuals = root.querySelectorAll('[data-visuel]');
      Array.prototype.forEach.call(buttons, function (btn) {
        btn.addEventListener('click', function () {
          var i = btn.getAttribute('data-etape');
          if (btn.classList.contains('est-active')) return;
          Array.prototype.forEach.call(buttons, function (b) {
            var on = b === btn;
            b.classList.toggle('est-active', on);
            b.setAttribute('aria-expanded', on ? 'true' : 'false');
          });
          Array.prototype.forEach.call(visuals, function (v) {
            var on = v.getAttribute('data-visuel') === i;
            v.classList.toggle('est-active', on);
            if (on) animateImage(v);
          });
        });
      });
    });
  }

  function initFilters() {
    Array.prototype.slice.call(document.querySelectorAll('[data-filtres]')).forEach(function (root) {
      var buttons = root.querySelectorAll('[data-filtre]');
      var items = root.querySelectorAll('[data-categorie]');
      Array.prototype.forEach.call(buttons, function (btn) {
        btn.addEventListener('click', function () {
          var f = btn.getAttribute('data-filtre');
          Array.prototype.forEach.call(buttons, function (b) {
            b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
          });
          Array.prototype.forEach.call(items, function (item) {
            var show = f === '*' || item.getAttribute('data-categorie') === f;
            var wasHidden = item.classList.contains('est-cachee');
            item.classList.toggle('est-cachee', !show);
            if (show && wasHidden) {
              var w = item.querySelector('.mosaic-img');
              if (w) animateImage(w);
            }
          });
        });
      });
    });
  }

  function initReveal() {
    Array.prototype.slice.call(document.querySelectorAll('.reveal')).forEach(function (el) {
      whenVisible(el, function () { el.classList.add('est-visible'); });
    });
  }

  function initHeader() {
    var onScroll = function () {
      document.documentElement.classList.toggle('est-defile', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function init() {
    wrapProseImages();
    initHeader();
    initReveal();
    initSteps();
    initFilters();
    var start = function () {
      Array.prototype.slice.call(document.querySelectorAll('[data-mosaic]')).forEach(initTitle);
      Array.prototype.slice.call(document.querySelectorAll('.mosaic-img')).forEach(initImage);
    };
    // On attend les polices pour que les lettres soient découpées à la bonne taille.
    if (document.fonts && document.fonts.ready && canAnimate) {
      var done = false;
      var go = function () { if (!done) { done = true; start(); } };
      document.fonts.ready.then(go);
      setTimeout(go, 1500);
    } else {
      start();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
