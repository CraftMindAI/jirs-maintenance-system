import { NextResponse } from "next/server";
import path from "node:path";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { transporter } from "@/lib/mailer";
import { encryptResetToken } from "@/utils/crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    let uid: string;
    try {
      uid = (await adminAuth.getUserByEmail(cleanEmail)).uid;
    } catch {
      return NextResponse.json({ error: "No account found with this email." }, { status: 404 });
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";

    const token = encryptResetToken(cleanEmail);
    const resetLink = `${protocol}://${host}/password/reset/${encodeURIComponent(token)}`;

    // Only the most recently issued token is honored, and it's cleared once used —
    // this makes reset links single-use and invalidates older links when a new one is requested.
    await adminDb.collection("users").doc(uid).update({
      resetToken: token,
      resetTokenExpiresAt: Date.now() + 60 * 60 * 1000,
    });

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
          <p style="color: #0f172a; font-size: 14px; margin: 0 0 8px;">Hello,</p>
          <p style="color: #334155; font-size: 13px; line-height: 1.6; margin: 0 0 20px;">
            We received a request to reset the password for your JMMS account
            (${cleanEmail}). Click the button below to choose a new password.
            If you didn&rsquo;t request this, you can safely ignore this email.
          </p>

          <div style="text-align: center; margin-bottom: 20px;">
            <a href="${resetLink}" style="display: inline-block; background-color: #0f4c81; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
              RESET PASSWORD
            </a>
          </div>

          <div style="text-align: center; margin-bottom: 8px;">
            <img src="cid:schoollogo" alt="JIRS Logo" width="180" height="46" style="display: inline-block;" />
          </div>

          <p style="color: #334155; font-size: 13px; line-height: 1.6; margin: 0; text-align: center;">
            This link will expire soon for your security.<br />By JAIN Team
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
      subject: "Reset Your JMMS Password",
      html,
      attachments: [
        {
          filename: "Logo.png",
          path: path.join(process.cwd(), "public", "Logo.png"),
          cid: "schoollogo",
        },
      ],
    });

    return NextResponse.json({ success: true, message: "Password reset email sent." });
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to send password reset email." },
      { status: 500 }
    );
  }
}
