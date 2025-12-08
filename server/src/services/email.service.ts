import nodemailer from "nodemailer";
import logger from "@/config/logger";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${approved ? "#10b981" : "#ef4444"};">
            Degree Plan ${approved ? "Approved" : "Rejected"}
          </h2>
          <p>Hello ${studentName},</p>
          <p>
            Your ${reviewerRole}, <strong>${reviewerName}</strong>, has
            ${
              approved ? "approved" : "rejected"
            } your degree plan review request.
          </p>
      `;

    if (!approved && rejectionReason) {
      htmlContent += `
          <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 12px; margin: 16px 0;">
            <h3 style="margin: 0 0 8px 0; color: #991b1b;">Reason for Rejection:</h3>
            <p style="margin: 0; color: #7f1d1d;">${rejectionReason}</p>
          </div>
        `;
    }

    if (comments && comments.length > 0) {
      htmlContent += `
          <div style="margin: 16px 0;">
            <h3>Comments:</h3>
            <ul style="padding-left: 20px;">
              ${comments.map((comment) => `<li>${comment}</li>`).join("")}
            </ul>
          </div>
        `;
    }

    if (approved && reviewerRole === "Mentor") {
      htmlContent += `
          <p style="color: #2563eb;">
            Your degree plan has been forwarded to your academic advisor for final review.
          </p>
        `;
    } else if (approved && reviewerRole === "Advisor") {
      htmlContent += `
          <p style="color: #10b981; font-weight: bold;">
            Your degree plan has been fully approved! You can now proceed with your academic planning.
          </p>
        `;
    }

    htmlContent += `
          <p>
            Please log in to your student portal to view the details and take any necessary action.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="font-size: 12px; color: #6b7280;">
            This is an automated message. Please do not reply to this email.
          </p>
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Student Report</h2>
        <p>A mentor has reported a student requiring administrative attention.</p>
        
        <div style="background-color: #f3f4f6; padding: 16px; margin: 16px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; color: #374151;">Student Information:</h3>
          <p style="margin: 4px 0;"><strong>Name:</strong> ${studentName}</p>
          <p style="margin: 4px 0;"><strong>Email:</strong> ${studentEmail}</p>
        </div>

        <div style="background-color: #f3f4f6; padding: 16px; margin: 16px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; color: #374151;">Reported By:</h3>
          <p style="margin: 4px 0;"><strong>Mentor Name:</strong> ${mentorName}</p>
          <p style="margin: 4px 0;"><strong>Mentor Email:</strong> ${mentorEmail}</p>
        </div>

        <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 16px; margin: 16px 0;">
          <h3 style="margin: 0 0 12px 0; color: #991b1b;">Reason for Report:</h3>
          <p style="margin: 0; color: #7f1d1d; white-space: pre-wrap;">${reason}</p>
        </div>

        <p style="margin-top: 24px;">
          Please review this report and take appropriate action as needed.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 12px; color: #6b7280;">
          This is an automated message from the Degree Planner system.
        </p>
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
    });

    logger.info(
      `Student report email sent successfully to admin for student: ${studentName}, reported by: ${mentorName}`
    );
  } catch (error) {
    logger.error("Error sending student report email:", error);
    throw error;
  }
};
