import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, setDoc, query, where } from "firebase/firestore";

const workoutsCol = collection(db, "workouts");
const assignedCol = collection(db, "assignedWorkouts");

/**
 * Create a new workout program
 */
export async function createWorkout(workout) {
  const docRef = await addDoc(workoutsCol, workout);
  return { id: docRef.id, ...workout };
}

/**
 * Get all workouts (optionally filter by userId)
 */
export async function getWorkouts(userId = null) {
  let q = workoutsCol;
  if (userId) q = query(workoutsCol, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Edit an existing workout by id
 */
export async function editWorkout(workoutId, updatedData) {
  const docRef = doc(db, "workouts", workoutId);
  await setDoc(docRef, updatedData, { merge: true });
  return { id: workoutId, ...updatedData };
}

/**
 * Assign workout to a list of clients
 */
export async function assignWorkout(workoutId, clientIds, createdBy) {
  const assignments = [];
  for (let clientId of clientIds) {
    const docRef = await addDoc(assignedCol, {
      workoutId,
      clientId,
      createdBy,
      status: "assigned",
      progress: [],
      assignedAt: new Date().toISOString(),
    });
    assignments.push({ id: docRef.id, workoutId, clientId, createdBy });
  }
  return assignments;
}

/**
 * Get assigned workouts for a client
 */
export async function getAssignedWorkouts(clientId) {
  const q = query(assignedCol, where("clientId", "==", clientId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
