import { Resend } from "resend";

const resendApiKey = "re_dxV8KppK_P1kbQVLTYBMkLZmQYJZrbL57";

if (!resendApiKey) {
  throw new Error("RESEND_API key is missing in environment variables");
}

const resend = new Resend(resendApiKey);

export async function sendResendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
      // bcc: process.env.ADMIN_EMAIL,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
