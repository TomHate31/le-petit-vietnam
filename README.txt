# Le Petit Vietnam – GitHub Pages + Firebase
- Config Firebase intégrée (`js/firebase-config.js`)
- Admin email : thomas.cabrit31@gmail.com

## Firebase
Authentication → Google (activer)  
Authentication → Settings → Authorized domains → ajouter `tomhate31.github.io`  
Firestore → Rules :
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /menu/{docId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "thomas.cabrit31@gmail.com";
    }
    match /config/{docId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "thomas.cabrit31@gmail.com";
    }
    match /stats/{docId} {
      allow read, write: if request.auth != null && request.auth.token.email == "thomas.cabrit31@gmail.com";
    }
  }
}
```
