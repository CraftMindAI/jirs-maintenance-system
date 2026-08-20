import { doc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Atomically assigns the next sequential ticket number (1, 2, 3, ...) from a
 * shared counter doc, so every complaint gets a stable, human-readable ID
 * regardless of who raises it (admin, student, or staff).
 */
export async function getNextTicketNumber(): Promise<number> {
  const counterRef = doc(db, "counters", "complaints");

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(counterRef);
    const next = (snapshot.data()?.value || 0) + 1;
    transaction.set(counterRef, { value: next }, { merge: true });
    return next;
  });
}
