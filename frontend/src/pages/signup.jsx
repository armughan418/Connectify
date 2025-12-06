import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";

function SignupDashboard() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !address
    ) {
      toast.warning("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(api().registerUser, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          phone,
          address,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        setLoading(false);
        toast.error("Invalid response from server. Please try again.");
        return;
      }

      setLoading(false);

      if (response.ok && data.status) {
        toast.success(data.message || "Signup successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        const errorMessage = data.message || data.error || "Signup failed!";
        toast.error(errorMessage);
        console.error("Signup Error Response:", data);
      }
    } catch (error) {
      setLoading(false);
      console.error("Signup Error:", error);
      
      // Better error messages
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        toast.error("Cannot connect to server. Please check if backend is running on port 5000.");
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-white to-purple-200 relative overflow-hidden">
      {/* Floating Background Effects */}
      <div className="absolute w-60 h-60 bg-indigo-300 opacity-30 rounded-full blur-3xl top-10 left-10" />
      <div className="absolute w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl bottom-10 right-10" />

      <div className="flex w-full max-w-5xl bg-white/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] overflow-hidden border border-white/40">
        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col justify-center w-1/2 p-14 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 backdrop-blur-xl">
          <h1 className="text-4xl font-extrabold text-indigo-800 leading-tight drop-shadow-sm">
            Join our community,
            <br /> and start connecting.
          </h1>
          <p className="mt-4 text-slate-700 text-lg opacity-90 leading-relaxed">
            Create your account today and enjoy seamless interactions with
            people globally.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-1/2 p-12">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">
            Sign Up
          </h2>
          <p className="text-center text-slate-600 mb-8 text-sm">
            Fill in your details to create a new account.
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-400 shadow-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-400 shadow-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-400 shadow-sm"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-400 shadow-sm"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-400 shadow-sm"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-400 shadow-sm"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-transform duration-200 hover:scale-[1.02]"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="flex justify-between pt-2 text-sm">
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
                onClick={() => navigate("/login")}
              >
                Already have an account?
              </button>

              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
                onClick={() => navigate("/forget-password")}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupDashboard;
