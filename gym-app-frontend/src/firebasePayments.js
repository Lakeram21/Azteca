import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc} from "firebase/firestore";

/**
 * Add a payment to Firestore
 * @param {object} payment - {clientId, type, amount, date, durationDays, selectedDates, userId}
 */
export async function addPayment(payment) {
  const paymentsCol = collection(db, "payments");
  await addDoc(paymentsCol, {
    ...payment,
    createdAt: new Date().toISOString()
  });
}

/**
 * Get all payments (optionally filter by clientId)
 */
export async function getPayments(clientId = null) {
  let paymentsCol = collection(db, "payments");
  let q = paymentsCol;
  
  if (clientId) {
    q = query(paymentsCol, where("clientId", "==", clientId));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}



/**
 * Get all payments (optionally filtered by userId)
 * and include client info from the users collection
 * @param {string|null} userId - if provided, filters by userId
 */
export async function getAllPayments(userId = null) {
  const paymentsCol = collection(db, "payments");
  let q = paymentsCol;

  if (userId) {
    q = query(paymentsCol, where("clientId", "==", userId));
  }

  const snapshot = await getDocs(q);
  const payments = [];

  for (const pDoc of snapshot.docs) {
    const payment = { id: pDoc.id, ...pDoc.data() };

    // Fetch the related client from "users" collection
    let clientInfo = null;
    if (payment.clientId) {
      try {
        const userRef = doc(db, "users", payment.clientId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          clientInfo = { id: userSnap.id, ...userSnap.data() };
        }
      } catch (err) {
        console.warn(`Failed to fetch client ${payment.clientId}`, err);
      }
    }

    payments.push({
      ...payment,
      client: clientInfo || {}, // add client info
    });
  }

  return payments;
}