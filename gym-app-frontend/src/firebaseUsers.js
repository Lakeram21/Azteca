import { db } from "./firebase";
import { collection, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";

/**
 * Fetch all users from Firestore
 * Returns an array of user objects {id, name, email, role, ...}
 */
export async function getAllUsers() {
  const usersCol = collection(db, "users");
  const snapshot = await getDocs(usersCol);
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return users;
}

/**
 * Create a new user document in Firestore
 * @param {string} uid - Firebase Auth UID
 * @param {object} userData - {name, email, role, phone, etc}
 */
export async function createUser(uid, userData) {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { ...userData });
}

/**
 * Get single user by UID
 */
export async function getUser(uid) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDocs(userRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

/**
 * Edit / update an existing user
 * @param {string} uid - Firebase Auth UID
 * @param {object} updates - fields to update, e.g., { name: "New Name", role: "admin" }
 */
export async function editUser(uid, updates) {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, updates, { merge: true }); // merge = only updates specified fields
}
