## 📌 Trunk-Based Development (TBD) - Workflow Git pour Pokexchange

### **1️⃣ Structure des branches Git**

📌 **Branches principales :**  
✅ `main` → **Branche stable**, toujours prête à être déployée en production.  
✅ `staging` → **Branche de préproduction**, utilisée pour tester avant de fusionner dans `main`.

📌 **Branches temporaires (créées puis supprimées après fusion) :**  
🔹 `feature/authentication` → Développement de l’auth Firebase  
🔹 `feature/trades-system` → Développement du système d’échange  
🔹 `bugfix/trade-api` → Correction d’un bug dans les échanges

🔹 **Les branches durent quelques heures à 1-2 jours maximum avant d’être fusionnées dans `staging`.**

---

### **2️⃣ Workflow Git (Étapes pour travailler proprement)**

💡 **Comment travailler efficacement avec Trunk-Based Development ?**

🔹 **1. Se positionner sur `staging` avant de commencer une nouvelle tâche**

```bash
git checkout staging
git pull origin staging  # S’assurer d’avoir le dernier code
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

🔹 **5. Faire une revue rapide et fusionner dans `staging`**

```bash
git checkout staging
git merge feature/authentication
git push origin staging
```

🔥 **Tester l’application sur `staging` avant de merger dans `main`**

🔹 **6. Une fois validé sur `staging`, fusionner dans `main`**

```bash
git checkout main
git merge staging
git push origin main
```

🔥 **Optionnel : Supprimer la branche après fusion**

```bash
git branch -d feature/authentication
```

---

### **3️⃣ Bonnes pratiques pour éviter le chaos 🚀**

✅ **Toujours travailler sur des branches courtes (max 1-2 jours)**  
✅ **Toujours tester sur `staging` avant de merger dans `main`**  
✅ **CI/CD sur `staging`** pour exécuter les tests automatiquement  
✅ **Faire une revue rapide du code par un coéquipier avant merge**  
✅ **Éviter les conflits en faisant `git pull origin staging` avant de commencer une tâche**  
✅ **Pas de branches longues comme en GitFlow → Tout doit être fusionné rapidement**

---

### **📌 Récapitulatif**

🎯 **On travaille directement sur `staging` avec des branches courtes (`feature/*`, `bugfix/*`).**  
🎯 **Tout est testé sur `staging`, puis fusionné dans `main` seulement après validation.**  
🎯 **CI/CD activé sur `staging` pour éviter de casser la production.**

📌 **Tout est prêt pour bosser proprement avec un environnement de test sécurisé ! 🚀**
