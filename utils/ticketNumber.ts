import { doc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}${day}`;
}

/**
 * Atomically assigns the next sequential ticket number for the current day
 * (e.g. 2026-0821-001, 2026-0821-002, ...) from a per-day counter doc, so
 * every complaint gets a stable, human-readable ID regardless of who raises
 * it (admin, student, or staff). The counter resets each calendar day.
 */
export async function getNextTicketNumber(): Promise<string> {
  const dateKey = getDateKey(new Date());
  const counterRef = doc(db, "counters", `complaints_${dateKey}`);

  const next = await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(counterRef);
    const value = (snapshot.data()?.value || 0) + 1;
    transaction.set(counterRef, { value }, { merge: true });
    return value;
  });

  return `${dateKey}-${String(next).padStart(3, "0")}`;
}
