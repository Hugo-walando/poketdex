# Poketdex

**Poketdex** est une plateforme web dédiée aux échanges de cartes du jeu **Pokémon TCG Pocket**. Elle permet aux joueurs de proposer, recevoir, et suivre des échanges de cartes avec un système de matching automatique et une interface rapide type "QuickTrade".

---

## 🚀 Fonctionnalités principales

### ✅ Espace d'échange

- Interface unique pour suivre tous les échanges (envoyés, reçus, en cours).
- Sidebar listant les utilisateurs avec des points rouges si nouvelle activité.
- Chat prévu pour la v2.

### 🌍 QuickTrade

- Ajout de cartes en double (listedCards) et en wishlist (wishlistCards).
- Système de matching automatique : proposition directe si un match est trouvé.

### ✨ Interface carte intuitive

- Ajout/gestion des cartes par set (filtrable).
- Affichage par rareté, extension, et nom.
- Icônes claires pour marquer une carte comme souhaitée ou à échanger.

### 🚫 Blocage et modération

- Système de signalement.
- Blocage utilisateur.

---

## 🪡 Stack technique

### Frontend

- **Next.js 15** avec App Router
- **Tailwind CSS**
- **Zustand** pour le state management
- **TypeScript**
- **Auth.js** (anciennement NextAuth) avec OAuth Google et Magic Link
- **Socket.IO** pour les MAJ en temps réel

### Backend

- **Node.js** avec **Express**
- **MongoDB Atlas** via **Mongoose**
- **JWT** pour la gestion des sessions sécurisées

### CI/CD & Environnements

- **Dev** : local
- **Staging** : préproduction via Vercel + Railway
- **Prod** : version stable, vérifiée
- Déploiement auto via GitHub Actions (pipeline prévu)

---

## 🏛️ Structure de la BDD (MongoDB)

- **User** : Authentification, infos, blocages
- **Card** : Toutes les cartes du jeu
- **Set** : Extensions
- **TradeRequest** : Demandes d'échange
- **Message** : Système de chat (v2)

---

## 📊 UX/UI & SEO

- **Favicon** complet : `.ico`, `.svg`, `apple-touch-icon`, etc.
- **SEO** optimisé avec `metadata` de Next.js 15
- **Performances** : images optimisées avec `next/image`, lazy loading, transformations limitées
- **Responsive** : Navbar adaptée desktop et mobile

---

## ⚖️ Licence

Projet personnel en développement actif. Licence à définir.

---

## 📚 Auteur

**Hugo Walandowitsch** - Frontend & fullstack developer
