import { NextResponse } from "next/server";
import path from "node:path";
import { transporter } from "@/lib/mailer";

const PRIORITY_COLORS: Record<string, string> = {
  High: "#dc2626",
  Medium: "#d97706",
  Low: "#16a34a",
};

export async function POST(request: Request) {
  try {
    const {
      technicianName,
      technicianEmail,
      technicianPhone,
      ticketId,
      ticketNumber,
      category,
      location,
      priority,
      description,
      adminName,
      adminEmail,
      adminPhone,
    } = await request.json();

    if (!technicianEmail) {
      return NextResponse.json({ error: "Technician email is required." }, { status: 400 });
    }

    const displayTicketId = ticketNumber ?? ticketId;
    const priorityColor = PRIORITY_COLORS[priority] || "#64748b";

    const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f3f4f6; padding: 32px 0;">
      <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08);">

        <div style="background-color: #0f172a; padding: 20px 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 14px; letter-spacing: 0.5px; margin: 0;">
            JAIN INTERNATIONAL RESIDENTIAL SCHOOL
          </h1>
          <p style="color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 4px 0 0;">
            Facilities Management
          </p>
        </div>

        <div style="padding: 24px;">
          <p style="color: #0f172a; font-size: 14px; margin: 0 0 8px;">Dear ${technicianName},</p>
          <p style="color: #334155; font-size: 13px; line-height: 1.6; margin: 0 0 20px;">
            <strong>${adminName}</strong> has given you the ticket. For further details, log in to
            the portal, or contact the person by phone and email below.
          </p>

          <table style="width: 100%; max-width: 320px; margin: 0 auto 20px; border-collapse: collapse; border: 1px solid #e2e8f0;">
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Complaint ID</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a; font-size: 13px; font-weight: 600;">${displayTicketId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Category</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a; font-size: 13px;">${category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Location</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a; font-size: 13px;">${location}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Priority</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">
                <span style="display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; color: #ffffff; background-color: ${priorityColor};">${priority}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: top;">Description</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a; font-size: 13px;">${description}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Contact Email</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a; font-size: 13px;">${adminEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Contact Phone</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a; font-size: 13px;">${adminPhone || "Not provided"}</td>
            </tr>
          </table>

          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:schoollogo" alt="JIRS Logo" width="180" height="46" style="display: inline-block;" />
          </div>

          <p style="color: #334155; font-size: 13px; line-height: 1.6; margin: 0; text-align: center;">
            Thanks for the cooperation,<br />By JAIN Team
          </p>
        </div>

        <div style="background-color: #f8fafc; padding: 14px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 10px; margin: 0;">
            This is an automated notification from the JIRS Facilities Management. Please do not reply directly to this email.
          </p>
        </div>
      </div>
    </div>
    `;

    await transporter.sendMail({
      from: `"JIRS Facilities Management" <${process.env.EMAIL_USER}>`,
      to: technicianEmail,
      subject: `New Maintenance Ticket Assigned — ${displayTicketId}`,
      html,
      attachments: [
        {
          filename: "Logo.png",
          path: path.join(process.cwd(), "public", "Logo.png"),
          cid: "schoollogo",
        },
      ],
    });

    await sendWhatsAppTicketNotification({
      technicianName,
      technicianEmail,
      technicianPhone,
      ticketId: displayTicketId,
      category,
      location,
      priority,
      description,
      adminName,
      adminEmail,
      adminPhone,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending technician assignment email:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}

function formatWhatsAppNumber(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

async function sendWhatsAppTicketNotification(params: {
  technicianName: string;
  technicianEmail: string;
  technicianPhone: string;
  ticketId: string | number;
  category: string;
  location: string;
  priority: string;
  description: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
}) {
  const {
    technicianName,
    technicianEmail,
    technicianPhone,
    ticketId,
    category,
    location,
    priority,
    description,
    adminName,
    adminEmail,
    adminPhone,
  } = params;

  const serviceApi = process.env.WHATS_APP_SERVICE_API;
  const vendorId = process.env.WHATS_APP_VENDOR_ID;
  const accessToken = process.env.WHATS_APP_API_ACCESS_TOKEN;
  const fromPhoneNumberId = process.env.WHATS_APP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATS_APP_TICKET_ISSUE_TEMPLATE;
  const group = process.env.WHATS_APP_GROUP;

  if (!serviceApi || !vendorId || !accessToken || !fromPhoneNumberId || !templateName || !technicianPhone) return;

  const [firstName, ...rest] = technicianName.trim().split(/\s+/);
  const lastName = rest.join(" ");

  try {
    const url = `${serviceApi}${vendorId}/contact/send-template-message?token=${accessToken}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from_phone_number_id: fromPhoneNumberId,
        phone_number: formatWhatsAppNumber(technicianPhone),
        template_name: templateName,
        template_language: "en_US",
        field_1: technicianName,
        field_2: adminName,
        field_3: ticketId,
        field_4: category,
        field_5: location,
        field_6: priority,
        field_7: description,
        field_8: adminEmail,
        field_9: adminPhone,
        contact: {
          first_name: firstName,
          last_name: lastName,
          email: technicianEmail,
          country: "india",
          language_code: "en_US",
          groups: group || "Technician",
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Error sending WhatsApp ticket notification:", errText);
    }
  } catch (error) {
    console.error("Error sending WhatsApp ticket notification:", error);
  }
}
