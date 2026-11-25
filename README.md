# Drift RCK

[Jouer au dernier déploiement GitHub Pages](https://louloubreizh.github.io/drift-rck-webgl/) · [Historique des déploiements](https://github.com/louloubreizh/drift-rck-webgl/actions/workflows/pages.yml)

Jeu de drift Unity WebGL avec une page d’accueil React. L’engrenage ouvre le garage 3D, la configuration des commandes et le classement local des huit meilleurs dérapages. Les résultats et les préférences sont enregistrés dans le navigateur.

## Lancer le site

Installer les dépendances avec `npm ci`, puis lancer `npm run dev`. Le lecteur attend le build Unity WebGL dans `public/unity` avec son `index.html`, son répertoire `Build` et son répertoire `TemplateData`.

## Mettre le build à jour

Exporter la scène Unity `Jeu` en WebGL sans compression Unity et remplacer les fichiers dans `public/unity`. React intègre le lecteur HTML généré par Unity. `npm run build` produit le site dans `dist` et donne au lecteur un chemin fondé sur l’empreinte du build pour garder le HTML et les fichiers Unity de la même version. Le workflow publie ce dossier sur GitHub Pages après chaque mise à jour de `main`.
