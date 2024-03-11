import nodemailer from "nodemailer";
import config from "config";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (emailOptions: EmailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: config.get<string>("email.USER_EMAIL"),
        clientId: config.get<string>("email.CLIENT_ID"),
        clientSecret: config.get<string>("email.CLIENT_SECRET"),
        refreshToken: config.get<string>("email.REFRESH_TOKEN"),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: config.get<string>("email.USER_EMAIL"),
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return true;
  } catch (error) {
    console.error("Error sending email", error);
    return false;
  }
};
