import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../api/user.api";

import Heading from "./heading";
import Paragraph from "./paragraph";
import Input from "./input";
import Button from "./button";
import Popup from "./popupcard";


const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  // 🔥 popup states
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("success");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) navigate("/register");
  }, [email, navigate]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ---------------- VERIFY OTP ----------------
  const handleVerify = async () => {
    setLoading(true);

    const res = await verifyOtp({ email, otp });

    if (res.success) {
      setPopupType("success");
      setMessage("OTP Verified Successfully!");
      setShowPopup(true);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      setPopupType("error");
      setMessage(res.message || "Invalid OTP");
      setShowPopup(true);
    }

    setLoading(false);
  };

  // ---------------- RESEND OTP ----------------
  const handleResend = async () => {
    const res = await resendOtp({ email });

    if (res.success) {
      setPopupType("success");
      setMessage("OTP resent successfully!");
      setTimer(60);
    } else {
      setPopupType("error");
      setMessage(res.message || "Failed to resend OTP");
    }

    setShowPopup(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg text-center">

        {/* HEADING */}
        <Heading>Verify OTP</Heading>

        <Paragraph>We sent a code to</Paragraph>

        <p className="text-blue-600 font-medium mb-6">
          {email}
        </p>

        {/* INPUT */}
        <Input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          maxLength={6}
        />

        {/* VERIFY BUTTON */}
        <div className="mt-4">
          <Button loading={loading} onClick={handleVerify}>
            Verify OTP
          </Button>
        </div>

        {/* RESEND BUTTON */}
        <div className="mt-3">
          <Button
            onClick={handleResend}
            disabled={timer > 0}
            className="bg-green-500 hover:bg-green-600"
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </Button>
        </div>

      </div>

      
      <Popup
        show={showPopup}
        type={popupType}
        message={message}
        onClose={() => setShowPopup(false)}
      />

    </div>
  );
};

export default VerifyOtpPage;