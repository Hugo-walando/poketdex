## 📌 Trunk-Based Development (TBD) - Workflow Git pour Pokexchange

### **1️⃣ Structure des branches Git**

📌 **Branche principale :**  
✅ `main` → **Branche unique**, toujours stable et prête à être déployée.

📌 **Branches temporaires (créées puis supprimées après fusion) :**  
🔹 `feature/authentication` → Développement de l’auth Firebase  
🔹 `feature/trades-system` → Développement du système d’échange  
🔹 `bugfix/trade-api` → Correction d’un bug dans les échanges

🔹 **Les branches durent quelques heures à 1-2 jours maximum avant d’être fusionnées dans `main`.**

---

### **2️⃣ Workflow Git (Étapes pour travailler proprement)**

💡 **Comment travailler efficacement avec Trunk-Based Development ?**

🔹 **1. Se positionner sur `main` avant de commencer une nouvelle tâche**

```bash
git checkout main
git pull origin main  # S’assurer d’avoir le dernier code
```

🔹 **2. Créer une branche temporaire spécifique à la fonctionnalité**

```bash
git checkout -b feature/authentication
```

🔹 **3. Développer et committer régulièrement**

```bash
git add .
git commit -m "feat: Ajout de l'authentification Firebase"
```

🔹 **4. Pousser la branche vers GitHub**

```bash
git push origin feature/authentication
```

🔹 **5. Faire une revue rapide et fusionner immédiatement dans `main`**

```bash
git checkout main
git merge feature/authentication
git push origin main
```

🔥 **Optionnel : Supprimer la branche après fusion**

```bash
git branch -d feature/authentication
```

---

### **3️⃣ Bonnes pratiques pour éviter le chaos 🚀**

✅ **Toujours travailler sur des branches courtes (max 1-2 jours)**  
✅ **Tester son code avant de fusionner sur `main`**  
✅ **Faire une revue rapide du code par un coéquipier avant merge**  
✅ **Éviter les conflits en faisant `git pull origin main` avant de commencer une tâche**  
✅ **Pas de branches longues comme en GitFlow → Tout doit être fusionné rapidement**

---

### **📌 Récapitulatif**

🎯 **On travaille directement sur `main` avec des branches courtes (`feature/*`, `bugfix/*`).**  
🎯 **Fusion rapide → pas de branches longues, pas de `dev`, tout va directement dans `main`.**

📌 **Tout est prêt pour bosser proprement ! 🚀**
