import nodemailer from "nodemailer";
import logger from "@/config/logger";

const FRONTEND_URL =
  process.env.NODE_ENV === "dev"
    ? process.env.FRONTEND_URL_DEV
    : process.env.FRONTEND_URL_PROD;
const smtpConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

logger.info("Email service SMTP configuration:", {
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.secure,
  hasUser: !!smtpConfig.auth.user,
  hasPass: !!smtpConfig.auth.pass,
  frontendUrl:FRONTEND_URL,
});

const transporter = nodemailer.createTransport(smtpConfig);

interface ReviewNotificationData {
  studentEmail: string;
  studentName: string;
  reviewerName: string;
  reviewerRole: "Mentor" | "Advisor";
  approved: boolean;
  rejectionReason?: string;
  comments?: string[];
}

export const sendReviewNotificationEmail = async (
  data: ReviewNotificationData
): Promise<void> => {
  try {
    const {
      studentEmail,
      studentName,
      reviewerName,
      reviewerRole,
      approved,
      rejectionReason,
      comments,
    } = data;

    const subject = approved
      ? `Your Degree Plan has been approved by your ${reviewerRole}`
      : `Your Degree Plan has been rejected by your ${reviewerRole}`;

    let htmlContent = `
        <div style="font-family: 'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="margin-bottom: 32px;">
            <h1 style="color: #333333; font-size: 32px; font-weight: 400; margin: 0 0 24px 0; letter-spacing: -0.5px;">
              Degree Plan ${approved ? "Approved" : "Rejected"}
            </h1>
          </div>

          <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 8px 0;">
            Hi ${studentName},
          </p>

          <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
            Your ${reviewerRole}, <strong>${reviewerName}</strong>, has
            ${
              approved ? "approved" : "rejected"
            } your degree plan review request.
          </p>
      `;

    if (!approved && rejectionReason) {
      htmlContent += `
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <h3 style="margin: 0 0 12px 0; color: #991b1b; font-size: 16px; font-weight: 600;">Reason for Rejection:</h3>
            <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.6;">${rejectionReason}</p>
          </div>
        `;
    }

    if (comments && comments.length > 0) {
      htmlContent += `
          <div style="margin: 24px 0;">
            <h3 style="color: #333333; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">Comments:</h3>
            <ul style="padding-left: 20px; margin: 0; color: #333333; font-size: 14px; line-height: 1.8;">
              ${comments
                .map(
                  (comment) => `<li style="margin-bottom: 8px;">${comment}</li>`
                )
                .join("")}
            </ul>
          </div>
        `;
    }

    if (approved && reviewerRole === "Mentor") {
      htmlContent += `
          <div style="background-color: #f0fdf4; border-left: 4px solid #2E7D60; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="margin: 0; color: #166534; font-size: 14px; line-height: 1.6;">
              Your degree plan has been forwarded to your academic advisor for final review.
            </p>
          </div>
        `;
    } else if (approved && reviewerRole === "Advisor") {
      htmlContent += `
          <div style="background-color: #f0fdf4; border-left: 4px solid #2E7D60; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="margin: 0; color: #166534; font-size: 14px; line-height: 1.6; font-weight: 600;">
              Your degree plan has been fully approved! You can now proceed with your academic planning.
            </p>
          </div>
        `;
    }

    htmlContent += `
          <p style="color: #333333; font-size: 14px; line-height: 1.6; margin: 32px 0;">
            Please log in to your student portal to view the details and take any necessary action.
          </p>

          <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
            <p style="color: #333333; font-size: 14px; margin: 0;">
              The Degree Planner Team.
            </p>
          </div>
        </div>
      `;

    logger.info(
      `Attempting to send review notification email to: ${studentEmail}`
    );

    await transporter.sendMail({
      from:
        process.env.SMTP_FROM || '"Degree Planner" <noreply@degreeplanner.com>',
      to: studentEmail,
      subject,
      html: htmlContent,
      bcc: process.env.GMAIL_USER,
    });

    logger.info(
      `Review notification email sent successfully to ${studentEmail} for ${
        approved ? "approval" : "rejection"
      } by ${reviewerRole}`
    );
  } catch (error) {
    logger.error("Error sending review notification email:", error);
    throw error;
  }
};

interface StudentReportData {
  studentName: string;
  studentEmail: string;
  mentorName: string;
  mentorEmail: string;
  reason: string;
}

export const sendStudentReportEmail = async (
  data: StudentReportData
): Promise<void> => {
  try {
    const { studentName, studentEmail, mentorName, mentorEmail, reason } = data;

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    logger.info("Report email configuration:", {
      adminEmail,
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      hasSmtpUser: !!process.env.SMTP_USER,
      smtpHost: process.env.SMTP_HOST,
      smtpUser: process.env.SMTP_USER,
    });

    if (!adminEmail) {
      logger.error(
        "Admin email not configured - both ADMIN_EMAIL and SMTP_USER are missing"
      );
      throw new Error("Admin email not configured");
    }

    const subject = `Student Report: ${studentName} reported by ${mentorName}`;

    const htmlContent = `
      <div style="font-family: 'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="margin-bottom: 32px;">
          <h1 style="color: #333333; font-size: 32px; font-weight: 400; margin: 0 0 24px 0; letter-spacing: -0.5px;">
            Student Report
          </h1>
        </div>

        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
          A mentor has reported a student requiring administrative attention.
        </p>

        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 16px 0; color: #333333; font-size: 16px; font-weight: 600;">Student Information:</h3>
          <p style="margin: 8px 0; color: #333333; font-size: 14px;"><strong>Name:</strong> ${studentName}</p>
          <p style="margin: 8px 0; color: #333333; font-size: 14px;"><strong>Email:</strong> ${studentEmail}</p>
        </div>

        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 16px 0; color: #333333; font-size: 16px; font-weight: 600;">Reported By:</h3>
          <p style="margin: 8px 0; color: #333333; font-size: 14px;"><strong>Mentor Name:</strong> ${mentorName}</p>
          <p style="margin: 8px 0; color: #333333; font-size: 14px;"><strong>Mentor Email:</strong> ${mentorEmail}</p>
        </div>

        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 24px 0; border-radius: 4px;">
          <h3 style="margin: 0 0 12px 0; color: #991b1b; font-size: 16px; font-weight: 600;">Reason for Report:</h3>
          <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${reason}</p>
        </div>

        <p style="color: #333333; font-size: 14px; line-height: 1.6; margin: 32px 0;">
          Please review this report and take appropriate action as needed.
        </p>

        <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          <p style="color: #333333; font-size: 14px; margin: 0;">
            The Degree Planner Team.
          </p>
        </div>
      </div>
    `;

    logger.info(
      `Attempting to send student report email to admin: ${adminEmail}`
    );

    await transporter.sendMail({
      from:
        process.env.SMTP_FROM || '"Degree Planner" <noreply@degreeplanner.com>',
      to: adminEmail,
      subject,
      html: htmlContent,
      bcc: process.env.GMAIL_USER,
    });

    logger.info(
      `Student report email sent successfully to admin for student: ${studentName}, reported by: ${mentorName}`
    );
  } catch (error) {
    logger.error("Error sending student report email:", error);
    throw error;
  }
};

interface PasswordResetEmailData {
  email: string;
  name: string;
  resetToken: string;
}

export const sendPasswordResetEmail = async (
  data: PasswordResetEmailData
): Promise<void> => {
  try {
    const { email, name, resetToken } = data;

    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

    const subject = "Password Reset Request - Degree Planner";

    const htmlContent = `
      <div style="font-family: 'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
        <div style="margin-bottom: 32px;">
          <h1 style="color: #333333; font-size: 32px; font-weight: 400; margin: 0 0 24px 0; letter-spacing: -0.5px;">
            Reset Your Password
          </h1>
        </div>

        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 8px 0;">
          Hi ${name},
        </p>

        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
          Tap the button below to reset your account password.<br/>
          If you didn't request a new password, you can safely delete this email.
        </p>

        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetUrl}" style="display: inline-block; background-color: #2E7D60; color: #ffffff; padding: 16px 48px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 16px; letter-spacing: 0.3px;">
            Reset Password
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 32px 0 8px 0;">
          If that doesn't work, copy and paste the following link in your browser:
        </p>
        <p style="word-break: break-all; color: #6366f1; font-size: 14px; margin: 0 0 32px 0;">
          ${resetUrl}
        </p>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 32px 0 0 0;">
          <strong>Note:</strong> This password reset link will expire in 24 hours.
        </p>

        <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          <p style="color: #333333; font-size: 14px; margin: 0;">
            The Degree Planner Team.
          </p>
        </div>
      </div>
    `;

    logger.info(`Attempting to send password reset email to: ${email}`);

    await transporter.sendMail({
      from:
        process.env.SMTP_FROM || '"Degree Planner" <noreply@degreeplanner.com>',
      to: email,
      subject,
      html: htmlContent,
      bcc: process.env.GMAIL_USER,
    });

    logger.info(`Password reset email sent successfully to ${email}`);
  } catch (error) {
    logger.error("Error sending password reset email:", error);
    throw error;
  }
};
