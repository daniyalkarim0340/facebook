import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../api/user.api";
import { motion } from "framer-motion"; // 🔥 Added for background animations

import Heading from "./heading";
import Paragraph from "./paragraph";
import Input from "./input";
import Button from "./button";
import Popup from "./popupcard";

const VerifyOtpPage = () => {
  // ==========================================
  //  ALL LOGIC KEPT EXACTLY THE SAME
  // ==========================================
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

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

  const handleVerify = async () => {
    setLoading(true);

    const res = await verifyOtp({ email, otp });

    if (res.success) {
      setPopupType("success");
      setMessage("OTP Verified Successfully!");
      setShowPopup(true);

      setTimeout(() => {
        navigate("/ai");
      }, 1500);
    } else {
      setPopupType("error");
      setMessage(res.message || "Invalid OTP");
      setShowPopup(true);
    }

    setLoading(false);
  };

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

  // ==========================================
  // ✨ UI CHANGES ONLY BELOW THIS LINE
  // ==========================================
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden px-4">
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] top-0 left-0"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] bottom-0 right-0"
        />
      </div>

      {/* Glassmorphism Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl text-center"
      >
        <Heading className="text-white">Verify OTP</Heading>

        <Paragraph className="text-zinc-300 mt-2">We sent a code to</Paragraph>

        <p className="text-blue-400 font-semibold mb-8 tracking-wide">
          {email}
        </p>

        {/* Enhanced Input Styling */}
        <div className="mb-6">
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="000000"
            maxLength={6}
            className="text-center text-2xl tracking-[0.5em] font-mono bg-white/5 border-white/20 text-white placeholder:text-white/20 rounded-xl py-3"
          />
        </div>

        {/* Buttons with modern styling */}
        <div className="mt-4 flex flex-col gap-3">
          <Button 
            loading={loading} 
            onClick={handleVerify}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 rounded-xl py-3 transition-all"
          >
            Verify OTP
          </Button>

          <Button
            onClick={handleResend}
            disabled={timer > 0}
            className={`w-full py-3 rounded-xl transition-all border ${
              timer > 0 
                ? "bg-white/5 border-white/10 text-zinc-500 cursor-not-allowed" 
                : "bg-transparent border-white/20 text-white hover:bg-white/10"
            }`}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </Button>
        </div>

      </motion.div>

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