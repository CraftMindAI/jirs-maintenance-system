import { addDoc, collection, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type NewFeedback = {
  userId: string;
  name: string;
  role: string;
  message: string;
};

/** New feedback starts unverified — only an admin can mark it verified. */
export async function submitFeedback({ userId, name, role, message }: NewFeedback) {
  await addDoc(collection(db, "feedback"), {
    userId,
    name,
    role,
    message,
    verified: false,
    createdAt: serverTimestamp(),
  });
}

/** Admin function to approve/verify a user feedback. */
export async function verifyFeedback(id: string) {
  await updateDoc(doc(db, "feedback", id), { verified: true });
}

/** Admin function to delete a feedback log. */
export async function deleteFeedback(id: string) {
  await deleteDoc(doc(db, "feedback", id));
}
