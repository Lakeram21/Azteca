import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

// ---------- Prices ----------

export async function getPrices() {
  const snapshot = await getDocs(collection(db, "prices"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addPrice(price) {
  const docRef = await addDoc(collection(db, "prices"), { ...price, createdAt: new Date().toISOString() });
  return docRef.id;
}

export async function updatePrice(id, updatedData) {
  const ref = doc(db, "prices", id);
  await updateDoc(ref, { ...updatedData, updatedAt: new Date().toISOString() });
}

export async function deletePrice(id) {
  const ref = doc(db, "prices", id);
  await deleteDoc(ref);
}

// ---------- Routines ----------

export async function getRoutines() {
  const snapshot = await getDocs(collection(db, "routines"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addRoutine(routine) {
  const docRef = await addDoc(collection(db, "routines"), { ...routine, createdAt: new Date().toISOString() });
  return docRef.id;
}

export async function updateRoutine(id, updatedData) {
  const ref = doc(db, "routines", id);
  await updateDoc(ref, { ...updatedData, updatedAt: new Date().toISOString() });
}

export async function deleteRoutine(id) {
  const ref = doc(db, "routines", id);
  await deleteDoc(ref);
}
