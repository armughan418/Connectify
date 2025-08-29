const nodeMailer = require("nodemailer");

const sendMail = async (otp, mail) => {
  try {
    const transport = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email,
        pass: process.env.App_Pass,
      },
    });

    const mailOptions = {
      from: process.env.Email,
      to: mail,
      subject: "Reset Password OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 1 minutes.`,
    };

    const info = await transport.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = sendMail;
