# 🎨 Kolor App (cooloors-app)

![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)
![Vite](https://img.shields.io/badge/Vite-4.x-blueviolet.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-2ea44f.svg)
![Supabase](https://img.shields.io/badge/Supabase-Cloud-green.svg)

> Générateur et gestionnaire de palettes de couleurs moderne, inspiré de Coolors, développé avec Vue 3, Vite et TypeScript. Optimisé mobile, PWA-ready, et connecté à Supabase pour la sauvegarde cloud.

---

## ✨ Aperçu

![Aperçu Kolor App - Desktop](./public/preview-desktop.png)
![Aperçu Kolor App - Mobile](./public/preview-mobile.png)

_(Ajoute tes captures d'écran dans `public/` pour un rendu optimal)_

---

## 🚀 Fonctionnalités

- 🎲 Génération aléatoire de palettes harmonieuses
- 🔒 Verrouillage/déverrouillage de couleurs
- ➕ Ajout/suppression de colonnes (max 6)
- ⏪ Historique palettes (undo/redo)
- ☁️ Sauvegarde/chargement via Supabase
- 📤 Partage, impression, export
- 📱 Interface responsive & mobile first
- 🏠 PWA : installable, offline-ready

---

## 🛠️ Stack technique

- [Vue 3](https://vuejs.org/) + [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) (auth & base de données)
- [chroma-js](https://gka.github.io/chroma.js/) (génération couleurs)
- [color-namer](https://github.com/zeke/color-namer) (noms des couleurs)
- [vue-sonner](https://vue-sonner.dev/) (notifications)
- [Vite PWA](https://vite-pwa-org.netlify.app/) (service worker, manifest)

---

## 🚦 Prérequis

- Node.js >= 18
- Compte [Supabase](https://supabase.com/) (pour la sauvegarde cloud)

---

## 📦 Installation

```sh
npm install
```

---

## 👨‍💻 Développement

```sh
npm run dev
```

---

## 🏗️ Build production

- Build rapide (ignore les erreurs TS non bloquantes) :
  ```sh
  npm run build
  ```
- Build strict (type-check complet) :
  ```sh
  npm run build:strict
  ```

---

## 🧪 Lint & Qualité

```sh
npm run lint
```

---

## 🖼️ Générer les icônes PWA

Place une icône source `public/icon.png` (512x512px), puis :

```sh
npm run generate-pwa-icons
```

---

## 🔒 Variables d'environnement

Crée un fichier `.env` à la racine avec :

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

---

## 📱 PWA & Installation

- L'application est installable sur mobile et desktop (manifest, service worker)
- Fonctionne hors-ligne (offline-ready)
- Ajoute-la à ton écran d'accueil pour une expérience native !

---

## 📝 Personnalisation

- Modifie les couleurs, le branding et les assets dans `public/` et `src/assets/`
- Configuration PWA dans `vite.config.ts`

---

## 💡 Conseils VSCode

- Extension recommandée : [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- Désactive Vetur pour éviter les conflits de typage

---

## 📚 Liens utiles

- [Documentation Vite](https://vite.dev/config/)
- [Documentation Vue 3](https://vuejs.org/guide/introduction.html)
- [Supabase Docs](https://supabase.com/docs)
- [chroma-js](https://gka.github.io/chroma.js/)
- [color-namer](https://github.com/zeke/color-namer)

---

## 🤝 Contribution

Les contributions sont les bienvenues !

- Fork le repo
- Crée une branche (`feature/ma-fonctionnalite`)
- Commit tes changements
- Ouvre une Pull Request

---

Développé avec ❤️ par MakVieSAinte
