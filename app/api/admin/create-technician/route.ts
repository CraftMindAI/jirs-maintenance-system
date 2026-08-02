import { NextResponse } from "next/server";
import path from "node:path";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { transporter } from "@/lib/mailer";
import { generateFormattedPassword } from "@/utils/password";

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const password = generateFormattedPassword(name, phone);

    const userRecord = await adminAuth.createUser({
      email: cleanEmail,
      password,
      displayName: name,
    });

    await adminDb.collection("users").doc(userRecord.uid).set({
      name,
      email: cleanEmail,
      phone,
      role: "Technician",
      active: true,
      createdAt: new Date().toISOString(),
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
          <p style="color: #0f172a; font-size: 14px; margin: 0 0 8px;">Dear ${name},</p>
          <p style="color: #334155; font-size: 13px; line-height: 1.6; margin: 0 0 20px;">
            An administrator has created a Technician account for you on the JMMS platform.
            Your login credentials are below.
          </p>

          <table style="width: 100%; max-width: 320px; margin: 0 auto 20px; border-collapse: collapse; border: 1px solid #e2e8f0;">
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Login Email</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a; font-size: 13px; font-weight: 600;">${cleanEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Password</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f4c81; font-size: 14px; font-weight: 700;">${password}</td>
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
      subject: "Your JMMS Technician Account Has Been Created",
      html,
      attachments: [
        {
          filename: "Logo.png",
          path: path.join(process.cwd(), "public", "Logo.png"),
          cid: "schoollogo",
        },
      ],
    });

    return NextResponse.json({ success: true, newPassword: password });
  } catch (error: any) {
    console.error("Error creating technician account:", error);
    const message =
      error?.code === "auth/email-already-exists"
        ? "An account with this email already exists."
        : error?.message || "Failed to create technician account.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
