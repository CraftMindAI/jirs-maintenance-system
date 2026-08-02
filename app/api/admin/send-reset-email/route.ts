import { NextResponse } from "next/server";
import path from "node:path";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { transporter } from "@/lib/mailer";
import { generateFormattedPassword } from "@/utils/password";

export async function POST(req: Request) {
  try {
    const { email, name, phone } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const newPassword = generateFormattedPassword(name || "", phone || "");

    const snapshot = await adminDb.collection("users").where("email", "==", cleanEmail).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "User account not found in system." }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];

    // The Firestore user doc ID is the same as the Firebase Auth UID (set at signup).
    // Update both: the real Auth password (what login actually checks) and the Firestore
    // field (kept for record-keeping / display, matching the rest of this admin flow).
    await adminAuth.updateUser(userDoc.id, { password: newPassword });
    await userDoc.ref.update({
      password: newPassword,
      updatedAt: new Date().toISOString(),
    });

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const loginUrl = `${protocol}://${host}/login`;

    const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f3f4f6; padding: 32px 0;">
      <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08);">

        <div style="background-color: #0f172a; padding: 20px 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 14px; letter-spacing: 0.5px; margin: 0;">
            JAIN INTERNATIONAL RESIDENTIAL SCHOOL
          </h1>
          <p style="color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 4px 0 0;">
            Maintenance Management System
          </p>
        </div>

        <div style="padding: 24px;">
          <p style="color: #0f172a; font-size: 14px; margin: 0 0 8px;">Dear ${name || "User"},</p>
          <p style="color: #334155; font-size: 13px; line-height: 1.6; margin: 0 0 20px;">
            An administrator has reset your password for your JMMS account. Your updated login
            credentials are below.
          </p>

          <table style="width: 100%; max-width: 320px; margin: 0 auto 20px; border-collapse: collapse; border: 1px solid #e2e8f0;">
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Login Email</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a; font-size: 13px; font-weight: 600;">${cleanEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">New Password</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f4c81; font-size: 14px; font-weight: 700;">${newPassword}</td>
            </tr>
          </table>

          <div style="text-align: center; margin-bottom: 20px;">
            <a href="${loginUrl}" style="display: inline-block; background-color: #0f4c81; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
              LOG IN TO JMMS
            </a>
          </div>

          <div style="text-align: center; margin-bottom: 8px;">
            <img src="cid:schoollogo" alt="JIRS Logo" width="180" height="46" style="display: inline-block;" />
          </div>

          <p style="color: #334155; font-size: 13px; line-height: 1.6; margin: 0; text-align: center;">
            Please change your password after logging in for safety.<br />By JAIN Team
          </p>
        </div>

        <div style="background-color: #f8fafc; padding: 14px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 10px; margin: 0;">
            This is an automated notification from the JIRS Maintenance Management System. Please do not reply directly to this email.
          </p>
        </div>
      </div>
    </div>
    `;

    await transporter.sendMail({
      from: `"JIRS Maintenance Management System" <${process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject: "Your JMMS Password Has Been Reset",
      html,
      attachments: [
        {
          filename: "Logo.png",
          path: path.join(process.cwd(), "public", "Logo.png"),
          cid: "schoollogo",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Password reset and credential email sent successfully.",
      newPassword,
    });
  } catch (error: any) {
    console.error("Error resetting password & sending email:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process password reset" },
      { status: 500 }
    );
  }
}
