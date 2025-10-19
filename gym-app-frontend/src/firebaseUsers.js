import { db, auth } from "./firebase"; // make sure auth is imported
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

/**
 * Fetch all users from Firestore
 */
export async function getAllUsers() {
  const usersCol = collection(db, "users");
  const snapshot = await getDocs(usersCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Create a new user document in Firestore
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
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

/**
 * Edit / update an existing user in Firestore (admin can edit anyone)
 */
export async function editUser(uid, updates) {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, updates, { merge: true });
}

/**
 * Update profile for signed-in user
 * - Firestore is updated for all fields
 * - Email & password updated only if current user
 * - Requires current password for sensitive updates
 */
export async function updateUserProfile(uid, updates, currentPassword) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No user is signed in.");
  }

  // Only allow updating email/password if current user
  if (currentUser.uid === uid) {
    if ((updates.email && updates.email !== currentUser.email) || updates.password) {
      if (!currentPassword) {
        throw new Error("Current password is required to update email or password.");
      }

      // Reauthenticate first
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // Update email
      if (updates.email && updates.email !== currentUser.email) {
        await updateEmail(currentUser, updates.email);
      }

      // Update password
      if (updates.password) {
        await updatePassword(currentUser, updates.password);
      }
    }
  }

  // Update Firestore for all fields
  const { password, ...firestoreData } = updates;
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, firestoreData, { merge: true });

  return { success: true };
}
