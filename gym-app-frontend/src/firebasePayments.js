import { db } from "./firebase";
import { 
  collection, addDoc, getDocs, query, where, doc, getDoc,
  orderBy, limit, startAfter 
} from "firebase/firestore";

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
      client: clientInfo || {},
    });
  }

  return payments;
}

/**
 * Search payments by user (name/email/clientId)
 * @param {string} searchTerm
 */
export async function searchPaymentsByUser(searchTerm) {
  const usersCol = collection(db, "users");
  const paymentsCol = collection(db, "payments");
  let userIds = [];

  const snapshot = await getDocs(usersCol);
  const term = searchTerm.toLowerCase();
  snapshot.forEach(docSnap => {
    const user = docSnap.data();
    if (
      (user.name && user.name.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      docSnap.id === searchTerm
    ) {
      userIds.push(docSnap.id);
    }
  });

  if (userIds.length === 0) return [];

  const payments = [];
  for (const clientId of userIds) {
    const q = query(paymentsCol, where("clientId", "==", clientId));
    const paymentSnap = await getDocs(q);
    for (const pDoc of paymentSnap.docs) {
      const payment = { id: pDoc.id, ...pDoc.data() };
      let clientInfo = null;
      try {
        const userRef = doc(db, "users", payment.clientId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) clientInfo = { id: userSnap.id, ...userSnap.data() };
      } catch (err) {
        console.warn(`Failed to fetch client ${payment.clientId}`, err);
      }
      payments.push({ ...payment, client: clientInfo || {} });
    }
  }

  return payments;
}

/**
 * Paginated payments with optional search by user
 * @param {object} params
 * @param {number} params.limitCount
 * @param {DocumentSnapshot|null} params.lastDoc
 * @param {string} params.searchTerm
 */
export async function getPaginatedPayments({ limitCount = 6, lastDoc = null, searchTerm = "" } = {}) {
  const paymentsCol = collection(db, "payments");
  let q;

  if (searchTerm) {
    // Find users matching the search
    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);
    const term = searchTerm.toLowerCase();
    const userIds = [];
    snapshot.forEach(docSnap => {
      const user = docSnap.data();
      if (
        (user.name && user.name.toLowerCase().includes(term)) ||
        (user.email && user.email.toLowerCase().includes(term)) ||
        docSnap.id === searchTerm
      ) {
        userIds.push(docSnap.id);
      }
    });

    if (userIds.length === 0) return { data: [], lastVisible: null, hasMore: false };

    q = query(
      paymentsCol,
      where("clientId", "in", userIds.slice(0, 10)), // Firestore in operator max 10
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
  } else {
    q = query(paymentsCol, orderBy("createdAt", "desc"), limit(limitCount));
  }

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const payments = [];

  for (const pDoc of snapshot.docs) {
    const payment = { id: pDoc.id, ...pDoc.data() };
    let clientInfo = null;
    try {
      const userRef = doc(db, "users", payment.clientId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) clientInfo = { id: userSnap.id, ...userSnap.data() };
    } catch (err) {
      console.warn(`Failed to fetch client ${payment.clientId}`, err);
    }
    payments.push({ ...payment, client: clientInfo || {} });
  }

  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
  const hasMore = snapshot.docs.length === limitCount;

  return { data: payments, lastVisible, hasMore };
}
