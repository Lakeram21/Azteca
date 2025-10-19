import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Sign up a user with Firebase and create Firestore user doc
 */
export async function firebaseSignup(email, password, name, status="active",role = "user", phone = "") {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  if (name) {
    await updateProfile(userCredential.user, { displayName: name });
  }

  // Create user document in Firestore
  const userDocRef = doc(db, "users", userCredential.user.uid);
  await setDoc(userDocRef, {
    name: name || "",
    email,
    phone,
    status,
    role,
    createdAt: new Date().toISOString(),
  });

  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    name: userCredential.user.displayName || name || "",
    status,
    role,
    phone,
  };
}

/**
 * Sign in a user and fetch Firestore user data
 */
export async function firebaseSignin(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  // Fetch Firestore user data
  const userDocRef = doc(db, "users", userCredential.user.uid);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    throw new Error("User not found in Firestore");
  }

  return { uid: userCredential.user.uid, ...docSnap.data() };
}

/**
 * Sign out the current user
 */
export async function firebaseSignout() {
  await signOut(auth);
}
