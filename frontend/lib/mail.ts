import { Resend } from "resend";
import { siteUrl } from "@/lib/site";

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${siteUrl}/auth/new-password?token=${token}`;
  const apiKey = process.env.RESEND_API_KEY;

  // Fallback for development if no API key is provided
  if (!apiKey) {
    console.log("--- DEV MODE: Password reset link ---");
    console.log(resetLink);
    console.log("-------------------------------------");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: email,
      subject: "Reset your password | Advik Furniture",
      html: `
        <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #1c1917; text-align: center; font-size: 24px; margin-bottom: 24px;">Advik Furniture & Interior</h2>
          <p style="color: #44403c; font-size: 16px; line-height: 1.6; text-align: center;">
            You requested a password reset for your account. Click the button below to set a new password.
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetLink}" style="background-color: #1c1917; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #78716c; font-size: 14px; text-align: center; margin-top: 24px;">
            This link will expire in <strong>1 hour</strong>.
          </p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #a8a29e; font-size: 12px;">
              If you didn't request this, you can safely ignore this email.
            </p>
            <p style="color: #a8a29e; font-size: 12px; margin-top: 8px;">
              © 2026 Advik Furniture & Interior. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Resend error:", error);
  }
};
