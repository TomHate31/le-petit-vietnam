import { firebaseConfig, ADMIN_EMAIL } from './firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

document.getElementById('login').addEventListener('click', () => {
  signInWithPopup(auth, provider);
});

onAuthStateChanged(auth, user => {
  if (user && user.email === ADMIN_EMAIL) {
    document.getElementById('admin-panel').style.display = 'block';
    loadDishes();
  }
});

async function loadDishes() {
  const snapshot = await getDocs(collection(db, 'menu'));
  const list = document.getElementById('dishes-list');
  list.innerHTML = '';
  snapshot.forEach(doc => {
    const dish = doc.data();
    list.innerHTML += `<div>${dish.name} - ${dish.price}€</div>`;
  });
}

document.getElementById('add-dish-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('dish-name').value;
  const price = document.getElementById('dish-price').value;
  await addDoc(collection(db, 'menu'), { name, price });
  loadDishes();
});
