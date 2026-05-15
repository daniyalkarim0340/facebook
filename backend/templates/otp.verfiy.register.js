export const otpTemplate = (name, email, otp) => {
  return `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 20px;
      border: 1px solid #e5e5e5;
      border-radius: 10px;
      background-color: #f9f9f9;
    ">

      <h2 style="color: #333;">
        Email Verification
      </h2>

      <p style="font-size: 16px; color: #555;">
        Hello <strong>${name}</strong>,
      </p>

      <p style="font-size: 15px; color: #555;">
        Thank you for registering with us.
      </p>

      <p style="font-size: 15px; color: #555;">
        We received a verification request for:
      </p>

      <p style="
        font-size: 16px;
        font-weight: bold;
        color: #222;
      ">
        ${email}
      </p>

      <p style="font-size: 15px; color: #555;">
        Your OTP verification code is:
      </p>

      <div style="
        text-align: center;
        margin: 30px 0;
      ">
        <span style="
          display: inline-block;
          background: #2563eb;
          color: white;
          padding: 15px 30px;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 5px;
          border-radius: 8px;
        ">
          ${otp}
        </span>
      </div>

      <p style="font-size: 14px; color: #777;">
        This OTP will expire in 5 minutes.
      </p>

      <p style="font-size: 14px; color: #777;">
        If you did not request this verification, please ignore this email.
      </p>

      <hr style="margin-top: 30px;" />

      <p style="font-size: 13px; color: #999; text-align: center;">
        Secure Authentication System
      </p>

    </div>
  `;
};