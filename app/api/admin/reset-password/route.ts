import { NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { adminAuth } from "@/lib/firebaseAdmin";
import { decryptResetToken } from "@/utils/crypto";

export async function POST(req: Request) {
  try {
    const { token, email, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    let targetEmail = email;

    if (token) {
      const decrypted = decryptResetToken(token);
      if (!decrypted || !decrypted.email) {
        return NextResponse.json({ error: "Invalid or expired password reset token." }, { status: 400 });
      }
      targetEmail = decrypted.email;
    }

    if (!targetEmail) {
      return NextResponse.json({ error: "Email is missing." }, { status: 400 });
    }

    // Query user document in Firestore by email
    const usersQuery = query(collection(db, "users"), where("email", "==", targetEmail.toLowerCase().trim()));
    const snapshot = await getDocs(usersQuery);

    if (snapshot.empty) {
      return NextResponse.json({ error: "User account not found in system." }, { status: 444 });
    }

    // The Firestore user doc ID is the same as the Firebase Auth UID (set at signup),
    // so update the real Auth password via the Admin SDK — this is what login actually checks.
    const userDoc = snapshot.docs[0];
    await adminAuth.updateUser(userDoc.id, { password: newPassword });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error: any) {
    console.error("Error resetting user password:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to reset password" },
      { status: 500 }
    );
  }
}
