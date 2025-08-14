import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, increment, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const app = initializeApp(firebaseConfig); const db = getFirestore(app);
async function loadMenu(){ const qy=query(collection(db,'menu'),orderBy('category'),orderBy('name')); const snap=await getDocs(qy);
 const el=document.getElementById('menu-items'); el.innerHTML=''; snap.forEach(d=>{ const v=d.data(); const row=document.createElement('div');
 row.innerHTML=`<strong>${v.name||'Plat'}</strong> — ${v.price? Number(v.price).toFixed(2)+'€':''} <span style="color:#888">(${v.category}${v.subcategory? ' / '+v.subcategory:''})</span>`;
 row.addEventListener('click',()=>updateDoc(doc(db,'menu',d.id),{views:increment(1)}).catch(()=>{})); el.appendChild(row); }); }
async function loadHours(){ const ref=doc(db,'config','hours'); const snap=await getDoc(ref); const el=document.getElementById('hours-list');
 const lines=snap.exists()? (snap.data().lines||[]) : [{label:'Lun–Ven',value:'11:00–22:00'},{label:'Sam',value:'Fermé'},{label:'Dim',value:'16:00–22:00'}];
 el.innerHTML=lines.map(l=>`<div>${l.label}: <strong>${l.value}</strong></div>`).join(''); }
async function bump(){ try{ await updateDoc(doc(db,'stats','global'),{visits:increment(1)});}catch(e){} }
loadMenu(); loadHours(); bump();