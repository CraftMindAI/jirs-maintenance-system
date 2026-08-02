import { NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
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

    // Query user document in Firestore by email
    const usersQuery = query(collection(db, "users"), where("email", "==", cleanEmail));
    const snapshot = await getDocs(usersQuery);

    if (snapshot.empty) {
      return NextResponse.json({
        exists: false,
        error: `No user account found matching email (${cleanEmail}).`,
      }, { status: 404 });
    }

    const userDoc = snapshot.docs[0].data();

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
