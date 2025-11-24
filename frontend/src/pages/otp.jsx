import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

function Otp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email =
    location.state?.email || localStorage.getItem("resetEmail") || "";

  const inputRefs = useMemo(
    () => Array.from({ length: 6 }, () => React.createRef()),
    []
  );

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeLeft(60);
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
    if (enteredOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please start from forget password page.");
      navigate("/forget-password");
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
        localStorage.setItem("resetToken", data.token);
        localStorage.setItem("resetEmail", data.email || email);
        navigate("/update-password", {
          state: { email: data.email || email, token: data.token },
        });
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Server error, try again later.");
    }
  };

  const handleResend = async () => {
    const emailToUse = email || localStorage.getItem("resetEmail");
    if (!emailToUse) {
      toast.error("Email not found. Please start from forget password page.");
      navigate("/forget-password");
      return;
    }

    try {
      const response = await fetch(api().forgetPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("New OTP sent to your email!");
        setOtp(Array(6).fill(""));
        inputRefs[0].current.focus();
        setTimeLeft(60);
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error.message || "Server error while resending OTP.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center border-l-4 border-orange-500">
        <h2 className="text-3xl font-extrabold text-orange-600 mb-6">
          OTP Verification
        </h2>
        <p className="text-gray-600 mb-6">
          Enter the OTP sent to{" "}
          <b className="text-orange-600">{email || "your email"}</b>
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
                className="w-12 h-12 text-center text-lg font-bold rounded-lg bg-orange-50 border-2 border-orange-300 text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 transition shadow-lg disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-6">
          {timeLeft > 0 ? (
            <p className="text-gray-600">
              Resend OTP in{" "}
              <b className="text-orange-600">{formatTime(timeLeft)}</b>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-orange-600 font-semibold hover:text-orange-700 hover:underline"
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
