import { transporter } from "../config/mail.config.js";


export const sendMail = async ({ to, subject, html }) => {
  const info=await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    html,
  });
  return info;
};