import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const KYCPage = () => {
  const { user, setIsKycVerified } = useUser();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1=enter details, 2=enter OTP
  const navigate = useNavigate();

  // Normalize functions to compare email and phone properly
  const normalizeEmail = (email) => email.trim().toLowerCase();

  const normalizePhone = (phone) => {
    let p = phone.trim().replace(/\D/g, ""); // Remove non-digit characters
    if (p.length > 10) {
      // Remove country code if present, keep last 10 digits
      p = p.slice(-10);
    }
    return p;
  };

  // Set email and phone from user context on load
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  // Validate user input against user context data
  const isUserDetailsValid = () => {
  // if (!user) return false;

  // // Normalize email: trim and lowercase both
  // const normalizedEmail = String(email).trim().toLowerCase();
  // const userEmail = String(user.email || "").trim().toLowerCase();

  // // Normalize phone: remove all non-digit characters and keep last 10 digits
  // const normalizePhone = (p) => {
  //   let digits = String(p).replace(/\D/g, ""); // convert to string and remove non-digits
  //   if (digits.length > 10) {
  //     digits = digits.slice(-10); // keep last 10 digits only
  //   }
  //   return digits;
  // };

  // const normalizedPhone = normalizePhone(phone);
  // const userPhone = normalizePhone(user.phone || "");

  // return normalizedEmail === userEmail && normalizedPhone === userPhone;

  return true;
};

  const handleSendOtp = async () => {
    if (!email || normalizePhone(phone).length !== 10) {
      alert("Please enter a valid Email and 10-digit Phone Number.");
      return;
    }
    if (!isUserDetailsValid()) {
      alert("Email and Phone Number must match your signup details.");
      return;
    }

    try {
      const res = await fetch("https://chatboxbackend-89xz.onrender.com/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("OTP sent to your email!");
        setStep(2);
      } else {
        alert(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 0) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const res = await fetch("https://chatboxbackend-89xz.onrender.com/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok && data.verified) {
        setIsKycVerified(true);
        alert("KYC Verified Successfully!");
        navigate("/home");
      } else {
        alert(data.message || "Invalid OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Error verifying OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
      <div className="bg-[#1e293b] p-8 rounded-xl shadow-md w-full max-w-md">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">KYC Verification</h2>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10) {
                  setPhone(e.target.value);
                }
              }}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-green-600 hover:bg-green-700 p-2 rounded mt-2"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 hover:bg-green-700 p-2 rounded mt-2"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default KYCPage;
