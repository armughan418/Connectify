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
        toast.success("OTP Verified!");
        localStorage.setItem("resetToken", data.token);
        localStorage.setItem("resetEmail", data.email);
        navigate("/update-password", {
          state: {
            token: data.token,
            email: data.email,
          },
        });
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Server error, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-white to-purple-200 relative overflow-hidden">
      <div className="absolute w-60 h-60 bg-indigo-300 opacity-30 rounded-full blur-3xl top-10 left-10" />
      <div className="absolute w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl bottom-10 right-10" />

      <div className="w-full max-w-lg bg-white/60 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] rounded-3xl border border-white/40 p-10 relative z-10">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">
          OTP Verification
        </h2>
        <p className="text-center text-slate-600 mb-6 text-sm">
          Enter the 6-digit code sent to{" "}
          <b className="text-indigo-700">{email}</b>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-lg font-bold rounded-xl bg-white/70 border border-slate-300 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 backdrop-blur"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-6">
          {timeLeft > 0 ? (
            <p className="text-slate-700">
              Resend OTP in <b className="text-indigo-700">{timeLeft}s</b>
            </p>
          ) : (
            <button
              onClick={handleSubmit}
              className="text-indigo-700 font-semibold hover:underline hover:text-indigo-900"
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
