import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"ShopEase" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email - OTP",
    html: `
      <div style="font-family: Arial, sans-serif">
        <h2>Email Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 4px">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <br/>
        <p>If you didn’t request this, ignore this email.</p>
      </div>
    `,
  });
};
