---
# ─── En-tête de l'article (entre les deux lignes de tirets) ───
title: "Article d'exemple : tout ce que l'on peut faire"
date: 2026-10-01
image: montagne.jpg            # image de couverture (dans assets/images)
resume: "Un article modèle qui montre le titre, le texte, l'image de couverture et les photos dans le texte. Copiez-le pour écrire les vôtres !"
tags: [Exemple, Montagne]       # facultatif
---

Ceci est le **premier paragraphe** de l'article. Écrivez simplement votre texte :
laissez une ligne vide pour commencer un nouveau paragraphe.

Vous pouvez mettre des mots en **gras**, en *italique*, ou ajouter
[un lien vers un autre site](https://pages.github.com/).

## Un intertitre

Les lignes qui commencent par `##` deviennent des intertitres.
Avec `###`, on obtient un titre plus petit.

### Une liste

- Premier élément
- Deuxième élément
- Troisième élément

1. Étape numérotée
2. Une autre étape

> Une citation : commencez la ligne par le signe « > ».

## Une photo dans le texte

Pour insérer une photo, placez-la dans le dossier `assets/images`
puis écrivez cette ligne (seul le nom du fichier change) :

{% include photo.html src="foret.jpg" legende="Une légende, facultative, s'affiche sous la photo." %}

La même photo, en **pleine largeur** grâce à `taille="large"` :

{% include photo.html src="ocean.jpg" taille="large" legende="Coucher de soleil sur l'océan." %}

Et une photo plus **petite**, avec `taille="petite"` :

{% include photo.html src="atelier.jpg" taille="petite" %}

## Plusieurs photos côte à côte

Séparez simplement les noms des fichiers par des virgules :

{% include galerie.html images="foret.jpg, desert.jpg" legende="Deux photos côte à côte." %}

{% include galerie.html images="montagne.jpg, ocean.jpg, atelier.jpg" legende="Trois photos : elles se placent automatiquement." %}

## La méthode Markdown classique

Cela fonctionne aussi, avec la syntaxe Markdown habituelle :

![Un désert au coucher du soleil]({{ '/assets/images/desert.jpg' | relative_url }})

Et voilà ! Chaque photo se construit en mosaïque lorsqu'elle apparaît à l'écran.
