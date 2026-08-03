import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
