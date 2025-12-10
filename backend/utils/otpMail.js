const sendEmail = require("./sendMail");

const sendOtpEmail = async (otp, userEmail) => {
  const subject = "Password Reset OTP";
  const html = `
    <div style="font-family: Arial, sans-serif; text-align:center; padding: 20px;">
      <h2>Password Reset Request</h2>
      <p>Hello! Use the OTP below to reset your password:</p>
      <div style="font-size: 24px; font-weight:bold; background: #1D4ED8; color: white; padding: 10px 20px; display:inline-block; border-radius:8px;">
        ${otp}
      </div>
      <p>This OTP is valid for 1 minute. Ignore if you didn't request.</p>
    </div>
  `;
  return await sendEmail(userEmail, subject, html);
};

module.exports = sendOtpEmail;
