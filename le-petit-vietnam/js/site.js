import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadMenu() {
  const menuRef = collection(db, 'menu');
  const snapshot = await getDocs(menuRef);
  const menuItems = document.getElementById('menu-items');
  menuItems.innerHTML = '';
  snapshot.forEach(doc => {
    const dish = doc.data();
    menuItems.innerHTML += `<div><strong>${dish.name}</strong> - ${dish.price}€</div>`;
  });
}

loadMenu();
