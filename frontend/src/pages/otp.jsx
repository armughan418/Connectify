import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

function Otp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const inputRefs = useMemo(
    () => Array.from({ length: 4 }, () => React.createRef()),
    []
  );

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);

  // Start 1-minute countdown on mount
  useEffect(() => {
    setTimeLeft(60); // Reset to 60 seconds
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < inputRefs.length - 1 && value) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(api().verifyOtp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok && data.status) {
        toast.success("OTP verified successfully!");
        navigate("/update-password", { state: { email, token: data.token } });
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Server error, try again later.");
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch(api().forgetPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("New OTP sent to your email!");
        setOtp(["", "", "", ""]);
        inputRefs[0].current.focus();
        setTimeLeft(60); // Reset 1-minute countdown
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error.message || "Server error while resending OTP.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">
          OTP Verification
        </h2>
        <p className="text-white/90 mb-6">
          Enter the OTP sent to <b>{email}</b>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex justify-between gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                ref={inputRefs[index]}
                maxLength="1"
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-lg font-bold rounded-lg bg-white/30 border border-white/40 text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-purple-700 font-semibold py-3 rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-6">
          {timeLeft > 0 ? (
            <p className="text-white/80">
              Resend OTP in <b>{formatTime(timeLeft)}</b>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-white font-semibold hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Otp;
