import { firebaseConfig, ADMIN_EMAIL } from './firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getFirestore(app); const provider = new GoogleAuthProvider();
const loginBtn=document.getElementById('login'), logoutBtn=document.getElementById('logout'), who=document.getElementById('who');
loginBtn.addEventListener('click',()=>signInWithPopup(auth,provider)); logoutBtn.addEventListener('click',()=>signOut(auth));
onAuthStateChanged(auth, async user=>{ if(user && user.email===ADMIN_EMAIL){ who.textContent='Connecté : '+user.email;
 document.getElementById('crud').style.display='block'; document.getElementById('hours').style.display='block'; document.getElementById('stats').style.display='block';
 loginBtn.style.display='none'; logoutBtn.style.display='inline-block'; await loadDishes(); await loadHours(); await loadStats();
 } else { who.textContent=user?('Accès refusé : '+user.email):''; document.getElementById('crud').style.display='none';
 document.getElementById('hours').style.display='none'; document.getElementById('stats').style.display='none'; loginBtn.style.display='inline-block'; logoutBtn.style.display='none'; }});
async function loadDishes(){ const list=document.getElementById('dishes-list'); list.innerHTML=''; const qy=query(collection(db,'menu'),orderBy('category'),orderBy('name'));
 const snap=await getDocs(qy); snap.forEach(docu=>{ const d=docu.data(); const row=document.createElement('div'); row.innerHTML=`<strong>${d.name}</strong> — ${d.price? Number(d.price).toFixed(2)+'€':''} <em>(${d.category}${d.subcategory? ' / '+d.subcategory:''})</em>`; list.appendChild(row); }); }
document.getElementById('add-dish-form').addEventListener('submit', async e=>{ e.preventDefault(); const name=document.getElementById('dish-name').value;
 const price=parseFloat(document.getElementById('dish-price').value||'0'); const category=document.getElementById('dish-category').value;
 const subcategory=document.getElementById('dish-subcategory').value; const desc=document.getElementById('dish-desc').value;
 await addDoc(collection(db,'menu'),{name,price,category,subcategory,desc,views:0,updatedAt:new Date()}); e.target.reset(); loadDishes(); });
async function loadHours(){ const ref=doc(db,'config','hours'); const snap=await getDoc(ref); const textarea=document.getElementById('hours-json');
 textarea.value=JSON.stringify(snap.exists()? (snap.data().lines||[]) : [{label:'Lun–Ven',value:'11:00–22:00'},{label:'Sam',value:'Fermé'},{label:'Dim',value:'16:00–22:00'}], null, 2); }
document.getElementById('save-hours').addEventListener('click', async ()=>{ try{ const lines=JSON.parse(document.getElementById('hours-json').value);
 await setDoc(doc(db,'config','hours'),{lines,updatedAt:new Date()}); alert('Horaires enregistrés'); }catch(e){ alert('JSON invalide'); }});
async function loadStats(){ const ref=doc(db,'stats','global'); const snap=await getDoc(ref); document.getElementById('visits').textContent=snap.exists()? (snap.data().visits||0):0;
 const topQ=query(collection(db,'menu'),orderBy('views','desc'),limit(5)); const snapTop=await getDocs(topQ); document.getElementById('top-dishes').innerHTML=Array.from(snapTop.docs).map(d=>{ const v=d.data(); return `<div>${v.name} — ${v.views||0} vues</div>`; }).join('') || '—'; }