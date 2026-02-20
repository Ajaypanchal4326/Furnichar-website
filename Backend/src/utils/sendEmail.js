import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

export const sendOtpEmail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"ShopEase" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Verify your email - OTP",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" 
          style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;">
                ShopEase
              </h1>
              <p style="color:#cbd5e1;margin-top:8px;font-size:14px;">
                Secure Email Verification
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 30px;text-align:center;">
              <h2 style="margin:0 0 15px 0;color:#111827;font-size:20px;">
                Verify Your Email Address
              </h2>

              <p style="color:#6b7280;font-size:15px;margin-bottom:25px;">
                Use the following One-Time Password (OTP) to complete your verification.
                This code is valid for <strong>10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="
                display:inline-block;
                padding:15px 30px;
                font-size:28px;
                font-weight:bold;
                letter-spacing:6px;
                color:#0f172a;
                background:#f1f5f9;
                border-radius:8px;
                border:2px dashed #cbd5e1;
              ">
                ${otp}
              </div>

              <p style="margin-top:30px;color:#6b7280;font-size:14px;">
                If you didn’t request this email, you can safely ignore it.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top:1px solid #e5e7eb;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 30px;text-align:center;font-size:12px;color:#9ca3af;">
              © ${new Date().getFullYear()} ShopEase. All rights reserved.<br/>
              This is an automated message — please do not reply.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    });

  } catch (error) {
    console.error("Email sending failed");
    throw error;
  }
};