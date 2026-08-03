import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { decryptResetToken } from "@/utils/crypto";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required." }, { status: 400 });
    }

    const decodedToken = decodeURIComponent(token);
    const decrypted = decryptResetToken(decodedToken);

    if (!decrypted || !decrypted.email) {
      return NextResponse.json({ error: "Invalid or corrupted password reset token." }, { status: 400 });
    }

    const cleanEmail = decrypted.email.toLowerCase().trim();

    const snapshot = await adminDb.collection("users").where("email", "==", cleanEmail).get();

    if (snapshot.empty) {
      return NextResponse.json({
        exists: false,
        error: `No user account found matching email (${cleanEmail}).`,
      }, { status: 404 });
    }

    const userDoc = snapshot.docs[0].data();

    if (userDoc.resetToken !== decodedToken || !userDoc.resetTokenExpiresAt || userDoc.resetTokenExpiresAt < Date.now()) {
      return NextResponse.json({
        exists: false,
        error: "This reset link has already been used or has expired.",
      }, { status: 410 });
    }

    return NextResponse.json({
      exists: true,
      email: cleanEmail,
      name: userDoc.name || "User",
    });
  } catch (error: any) {
    console.error("Error verifying reset token:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify reset token." },
      { status: 500 }
    );
  }
}
