import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API;

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
      from: "noreply@degreeplanner.app",
      to,
      subject,
      html,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
