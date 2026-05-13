import { transporter } from "../config/mail.config.js";


export const sendMail = async ({
  to,
  subject,
  html,
}) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};