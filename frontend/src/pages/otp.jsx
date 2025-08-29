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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedStartTime = localStorage.getItem("otpStartTime");

    if (savedStartTime) {
      const elapsed = Math.floor(
        (Date.now() - parseInt(savedStartTime)) / 1000
      );
      const remaining = 60 - elapsed;
      setTimeLeft(remaining > 0 ? remaining : 0);
    } else {
      localStorage.setItem("otpStartTime", Date.now().toString());
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("otpStartTime");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

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
        localStorage.removeItem("otpStartTime");

        setTimeout(
          () =>
            navigate("/update-password", {
              state: { email, token: data.token },
            }),
          1200
        );
      } else {
        toast.error(`${data.message || "Invalid OTP"}`);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Server error, try again later." || error.message);
      //
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
        toast.success("New OTP has been sent to your Email");
        setOtp(["", "", "", ""]);
        inputRefs[0].current.focus();
        setTimeLeft(60);
        localStorage.setItem("otpStartTime", Date.now().toString());
      } else {
        toast.error(`${data.message || "Failed to resend OTP"}`);
      }
    } catch (error) {
      toast.error("Server error while resending OTP." || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="backdrop-blur-md bg-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/30">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white drop-shadow-lg">
          OTP Verification
        </h2>
        <p className="text-center text-pink-100 mb-6">
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
                className="w-12 h-12 text-center text-lg font-bold rounded-lg bg-white/30 border border-white/40 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-white font-medium">{message}</p>
        )}

        <div className="text-center mt-6">
          {timeLeft > 0 ? (
            <p className="text-pink-200">
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
