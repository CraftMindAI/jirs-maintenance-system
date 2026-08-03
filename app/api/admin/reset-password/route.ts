import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
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
    const snapshot = await adminDb
      .collection("users")
      .where("email", "==", targetEmail.toLowerCase().trim())
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "User account not found in system." }, { status: 444 });
    }

    const userDoc = snapshot.docs[0];

    // Self-service links carry a token: it must match the one last issued for this
    // user and still be within its validity window, otherwise the link is either
    // already used (cleared below) or stale.
    if (token) {
      const data = userDoc.data();
      if (data.resetToken !== token || !data.resetTokenExpiresAt || data.resetTokenExpiresAt < Date.now()) {
        return NextResponse.json({ error: "This reset link has already been used or has expired." }, { status: 410 });
      }
    }

    // The Firestore user doc ID is the same as the Firebase Auth UID (set at signup),
    // so update the real Auth password via the Admin SDK — this is what login actually checks.
    await adminAuth.updateUser(userDoc.id, { password: newPassword });

    if (token) {
      await userDoc.ref.update({ resetToken: null, resetTokenExpiresAt: null });
    }

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
