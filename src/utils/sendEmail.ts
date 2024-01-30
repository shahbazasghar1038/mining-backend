import nodemailer from "nodemailer";

interface IMailOptions {
  email: string;
  subject: string;
  message: string;
}

export const SendEmail = async (options: IMailOptions) => {
  const transporter = nodemailer.createTransport({
    host: `${process.env.SMPT_HOST}`,
    port: Number(process.env.SMTP_PORT),
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
