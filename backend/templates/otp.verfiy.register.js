export const otpTemplate = (otp) => {
  return `
    <div style="font-family:sans-serif">
      <h2>Email Verification</h2>
      <p>Your OTP code is:</p>

      <h1 style="color:blue">${otp}</h1>

      <p>This OTP expires in 5 minutes.</p>
    </div>
  `;
};