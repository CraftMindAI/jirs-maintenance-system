import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type NewFeedback = {
  userId: string;
  name: string;
  role: string;
  message: string;
};

/** Submission requires sign-in, so every submission is treated as verified. */
export async function submitFeedback({ userId, name, role, message }: NewFeedback) {
  await addDoc(collection(db, "feedback"), {
    userId,
    name,
    role,
    message,
    verified: true,
    createdAt: serverTimestamp(),
  });
}
