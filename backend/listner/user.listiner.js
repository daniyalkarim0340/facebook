// listeners/user.listener.js

import eventBus from "../eventbus/eventBus.js";
import UserEvent from "../eventbus/event.const.js";
import { otpTemplate } from "../templates/otp.verfiy.register.js";
import { sendMail } from "../utils/sendmail.js";

eventBus.on(UserEvent.SEND_OTP, async (data) => {
   try {
      console.log("📩 OTP Event Received");
      console.log("📦 Event Data:", data);

      const { email, otp, name } = data;

      console.log("📧 Preparing email for:", email);

      const html = otpTemplate(name, email, otp);

      console.log("🧾 OTP Template generated successfully");

      const info = await sendMail({
  to: email,
  subject: "Verify Your Account (OTP)",
  html: html
});
      console.log("✅ Email sent successfully!");
      console.log("📨 Message ID:", info.messageId || info.response);

   } catch (error) {
      console.log("❌ Email sending failed!");
      console.log("Error:", error.message);
   }
});