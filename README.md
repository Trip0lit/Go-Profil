# Go-Profil

Un site personnel pour me présenter et cataloguer mes activités, avec un blog.
Les titres et les images se construisent avec des pièces de mosaïque qui tombent.

Le site est fait avec **Jekyll** et hébergé gratuitement par **GitHub Pages**.
**Pour ajouter du contenu, aucun code n'est nécessaire** : tout se fait depuis le site de GitHub, avec votre navigateur.

---

## Sommaire

1. [Mettre le site en ligne (une seule fois)](#1-mettre-le-site-en-ligne-une-seule-fois)
2. [Ajouter des photos](#2-ajouter-des-photos)
3. [Écrire un nouvel article](#3-écrire-un-nouvel-article)
4. [Insérer des photos dans un article](#4-insérer-des-photos-dans-un-article)
5. [Modifier ou supprimer un article](#5-modifier-ou-supprimer-un-article)
6. [Modifier sa présentation et ses activités](#6-modifier-sa-présentation-et-ses-activités)
7. [En cas de problème](#7-en-cas-de-problème)

---

## 1. Mettre le site en ligne (une seule fois)

1. Sur la page du dépôt GitHub, cliquez sur **Settings** (l'engrenage, en haut).
2. Dans le menu de gauche, cliquez sur **Pages**.
3. Dans **Build and deployment** → **Source**, choisissez **Deploy from a branch**.
4. Dans **Branch**, choisissez `main` et le dossier `/ (root)`, puis **Save**.
5. Patientez 1 à 2 minutes : l'adresse de votre site s'affiche en haut de cette page,
   par exemple `https://votre-pseudo.github.io/Go-Profil/`.

> **Le nom du dépôt compte.** Le fichier `_config.yml` contient la ligne
> `baseurl: "/Go-Profil"`. Si vous renommez le dépôt, remplacez `Go-Profil` par le nouveau nom.
> Si le dépôt s'appelle `votre-pseudo.github.io`, mettez `baseurl: ""`.

Ensuite, **chaque modification enregistrée met le site à jour tout seul** en 1 à 2 minutes.

---

## 2. Ajouter des photos

Toutes les images sont rangées dans le dossier **`assets/images`**.

1. Sur la page du dépôt, cliquez sur le dossier `assets`, puis sur `images`.
2. Cliquez sur le bouton **Add file** (en haut à droite) → **Upload files**.
3. Glissez-déposez vos photos dans la zone (ou cliquez sur **choose your files**).
4. En bas de la page, cliquez sur le bouton vert **Commit changes**.

C'est tout ! Retenez simplement le **nom exact** de chaque fichier (par exemple `vacances-2026.jpg`) :
c'est lui que vous écrirez dans vos articles.

**Conseils pour les noms de fichiers :**

- pas d'espaces ni d'accents : `coucher-de-soleil.jpg` plutôt que `Coucher de soleil é.JPG` ;
- attention aux majuscules : `Photo.JPG` et `photo.jpg` sont deux noms différents ;
- évitez les photos trop lourdes (idéalement moins de 1 Mo, environ 2000 pixels de large).

---

## 3. Écrire un nouvel article

Chaque article est un fichier texte dans le dossier **`_posts`**.

### Le plus simple : copier l'article d'exemple

1. Ouvrez le dossier `_posts`, puis le fichier `2026-10-01-article-exemple.md`.
2. Cliquez sur l'icône **Copy raw file** (deux petits carrés, en haut à droite du fichier)
   pour copier tout son contenu.
3. Revenez dans le dossier `_posts` et cliquez sur **Add file** → **Create new file**.
4. Donnez un nom au fichier, **en respectant ce format** :

   ```
   AAAA-MM-JJ-titre-court.md
   ```

   Par exemple : `2026-11-20-mon-voyage-en-islande.md`
   (la date, puis quelques mots séparés par des tirets, et `.md` à la fin).
5. Collez le contenu copié, puis modifiez-le (voir ci-dessous).
6. Cliquez sur **Commit changes…** puis à nouveau sur **Commit changes**.

Votre article apparaît sur la page **Blog** au bout de 1 à 2 minutes,
classé automatiquement du plus récent au plus ancien.

### L'en-tête de l'article

Tout en haut du fichier, entre deux lignes de trois tirets `---`, se trouvent les informations de l'article :

```yaml
---
title: "Mon voyage en Islande"
date: 2026-11-20
image: islande-couverture.jpg
resume: "Dix jours entre glaciers, geysers et aurores boréales."
tags: [Voyage, Photo]
---
```

| Ligne    | À quoi ça sert                                                                    |
|----------|-----------------------------------------------------------------------------------|
| `title`  | Le titre de l'article (gardez les guillemets).                                    |
| `date`   | La date de publication, au format `AAAA-MM-JJ`.                                   |
| `image`  | L'image de couverture : le nom d'une photo du dossier `assets/images`.            |
| `resume` | Un court résumé, affiché dans la liste des articles (gardez les guillemets).      |
| `tags`   | *Facultatif.* Des mots-clés entre crochets, séparés par des virgules.             |

> ⚠️ Gardez bien les deux lignes `---` et les espaces après les deux-points.
> Si votre titre ou votre résumé contient des guillemets `"`, utilisez plutôt les guillemets français « ».

### Le texte de l'article

Sous l'en-tête, écrivez votre texte normalement. Quelques astuces de mise en forme (format « Markdown ») :

| Vous écrivez                        | Vous obtenez                     |
|-------------------------------------|----------------------------------|
| Une ligne vide entre deux textes    | Un nouveau paragraphe            |
| `**mots importants**`               | **mots importants**              |
| `*en italique*`                     | *en italique*                    |
| `## Mon intertitre`                 | Un intertitre                    |
| `### Petit titre`                   | Un titre plus petit              |
| `- un élément` (une ligne chacun)   | Une liste à puces                |
| `1. première étape`                 | Une liste numérotée              |
| `> une citation`                    | Une citation mise en valeur      |
| `[texte du lien](https://…)`        | Un lien cliquable                |

Astuce : l'onglet **Preview** de l'éditeur GitHub donne un premier aperçu du texte
(les photos, elles, ne s'affichent que sur le vrai site).

---

## 4. Insérer des photos dans un article

D'abord, envoyez la photo dans `assets/images` (voir [étape 2](#2-ajouter-des-photos)).
Puis, dans le texte de l'article, **sur une ligne seule, avec une ligne vide avant et après**, écrivez :

### Une photo

```liquid
{% include photo.html src="ma-photo.jpg" %}
```

Avec une légende sous la photo :

```liquid
{% include photo.html src="ma-photo.jpg" legende="Le lac au petit matin" %}
```

Changer la taille (facultatif) :

```liquid
{% include photo.html src="ma-photo.jpg" taille="large" %}
{% include photo.html src="ma-photo.jpg" taille="petite" %}
```

- `taille="large"` : la photo prend toute la largeur de l'écran ;
- `taille="petite"` : une photo plus petite, centrée ;
- sans `taille` : largeur du texte.

### Plusieurs photos côte à côte

Mettez les noms des fichiers **séparés par des virgules** :

```liquid
{% include galerie.html images="photo1.jpg, photo2.jpg, photo3.jpg" legende="Mes trois photos préférées" %}
```

Elles se rangent automatiquement en grille (et l'une sous l'autre sur téléphone).

> Chaque photo se construit en mosaïque lorsqu'elle apparaît à l'écran : il n'y a rien à faire de plus.

L'article d'exemple [`_posts/2026-10-01-article-exemple.md`](_posts/2026-10-01-article-exemple.md)
montre toutes ces possibilités : ouvrez-le pour voir comment il est écrit.

---

## 5. Modifier ou supprimer un article

- **Modifier** : ouvrez le fichier dans `_posts`, cliquez sur le crayon ✏️ (**Edit this file**),
  faites vos changements puis **Commit changes**.
- **Supprimer** : ouvrez le fichier, cliquez sur les trois points **…** en haut à droite →
  **Delete file**, puis **Commit changes**.
- **Masquer un article sans le supprimer** : ajoutez la ligne `published: false` dans son en-tête.

L'article d'exemple et le carnet de voyage peuvent être supprimés quand vous n'en avez plus besoin.

---

## 6. Modifier sa présentation et ses activités

Ces textes sont dans le dossier **`_data`**, avec des explications directement dans les fichiers.

- **`_data/profil.yml`** : votre nom, la phrase d'accroche, l'image de l'accueil,
  le texte « Qui suis-je ? », les chiffres et les liens de contact (e-mail, réseaux…).
- **`_data/activites.yml`** : le catalogue de vos activités. Pour en ajouter une,
  copiez un bloc complet (de `- titre:` jusqu'à la ligne avant le `- titre:` suivant),
  collez-le à la fin et modifiez-le. Les 4 premières activités sont mises en avant sur la page d'accueil.
  Les boutons de filtre de la page **Activités** sont créés automatiquement à partir des catégories.

Exemple d'activité :

```yaml
- titre: Cours de céramique
  categorie: Création
  periode: "Depuis 2025"
  image: ceramique.jpg
  description: "Tour de potier, émaux et beaucoup de patience."
  lien: https://exemple.com
```

> ⚠️ Dans ces fichiers, **les espaces en début de ligne comptent** : alignez bien chaque ligne
> sur celles du bloc copié. Mettez les textes entre guillemets `"…"`, surtout s'ils contiennent
> le signe deux-points `:`.

Le titre de l'onglet du navigateur et la description pour les moteurs de recherche se règlent
dans **`_config.yml`** (lignes `title` et `description`).

---

## 7. En cas de problème

**Le site ne se met pas à jour ?**
Allez dans l'onglet **Actions** du dépôt. Une coche verte ✅ signifie que tout va bien
(attendez encore une minute et rechargez la page, éventuellement avec Ctrl + F5).
Une croix rouge ❌ signifie qu'il y a une erreur : cliquez dessus pour lire le message,
qui indique souvent le fichier et la ligne en cause.

**Les erreurs les plus fréquentes :**

- un `---` manquant au début ou à la fin de l'en-tête d'un article ;
- un nom de fichier d'article qui ne commence pas par une date `AAAA-MM-JJ-` ;
- une date dans le futur : l'article n'apparaîtra qu'à cette date ;
- un nom de photo mal orthographié (attention aux majuscules et à l'extension `.jpg` / `.jpeg` / `.png`) ;
- dans `_data/*.yml` : un décalage d'espaces, ou un `:` dans un texte sans guillemets.

Pas de panique : l'onglet **History** de chaque fichier permet de retrouver une version précédente.

---

## Pour les curieux : organisation des fichiers

```
_config.yml          Réglages du site (titre, adresse…)
_data/               Vos textes : profil et catalogue d'activités
_posts/              Les articles du blog (un fichier .md par article)
assets/images/       Toutes les photos
assets/css/site.css  Le design (couleurs, polices…)
assets/js/mosaic.js  L'effet mosaïque et les animations
_layouts/            Modèles des pages (accueil, article…)
_includes/           Morceaux réutilisables (photo, galerie, en-tête…)
blog/, activites/    Les pages Blog et Activités
```

Pour tester le site sur votre ordinateur (facultatif, nécessite Ruby) :

```bash
bundle install
bundle exec jekyll serve
```

puis ouvrez <http://localhost:4000/Go-Profil/>.
