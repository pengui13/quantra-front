"use client";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import Carousel from "./Carousel";
import { Eye, EyeOff, X } from "lucide-react";
import PinInput from "./PinInput";

export default function RegisterModal({ showSignup, setShowSignup }) {
  // All state managed internally
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPassword2, setSignupPassword2] = useState("");
  const [signupCode, setSignupCode] = useState("");
  const [signupError, setSignupError] = useState("");
  const [step, setStep] = useState("form");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupPassword2, setShowSignupPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Set app element for accessibility
  useEffect(() => {
    if (typeof window !== "undefined") {
      Modal.setAppElement(document.body);
    }
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!showSignup) {
      setSignupEmail("");
      setSignupPassword("");
      setSignupPassword2("");
      setSignupCode("");
      setSignupError("");
      setStep("form");
      setShowSignupPassword(false);
      setShowSignupPassword2(false);
    }
  }, [showSignup]);

  const handleSignupForm = async (e) => {
    e.preventDefault();
    setSignupError("");

    if (signupPassword !== signupPassword2) {
      setSignupError("Passwords don't match");
      return;
    }

    if (signupPassword.length < 8) {
      setSignupError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, password: signupPassword }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setSignupError(data.error || "Registration failed");
        return;
      }

      setStep("verify");
    } catch (err) {
      setSignupError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setSignupError("");

    if (signupCode.length !== 6) {
      setSignupError("Please enter the 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, code: signupCode }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setSignupError(data.error || "Verification failed");
        return;
      }

      // Success - close modal and trigger auth update
      setShowSignup(false);
      window.dispatchEvent(new CustomEvent("ping:update", { detail: true }));
    } catch (err) {
      setSignupError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={showSignup}
      onRequestClose={() => setShowSignup(false)}
      contentLabel="Register Modal"
      className="relative flex w-[95%] max-w-4xl overflow-hidden rounded-[28px] bg-[#121212] shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[10000]"
    >
      {/* Carousel - left side on desktop */}
      <div className="hidden md:block w-1/2">
        <Carousel />
      </div>

      {/* Form - right side */}
      <div className="w-full md:w-1/2 p-8 relative">
        <button
          onClick={() => setShowSignup(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {step === "form" && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-white">Create Account</h2>
            <form onSubmit={handleSignupForm} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="px-4 py-3 rounded-lg bg-black/40 border border-gray-700 focus:border-[#36C6E0] outline-none w-full text-white placeholder-gray-500"
                required
                disabled={isLoading}
              />

              {/* Password */}
              <div className="relative">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="Password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-lg bg-black/40 border border-gray-700 focus:border-[#36C6E0] outline-none text-white placeholder-gray-500"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showSignupPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showSignupPassword2 ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={signupPassword2}
                  onChange={(e) => setSignupPassword2(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-lg bg-black/40 border border-gray-700 focus:border-[#36C6E0] outline-none text-white placeholder-gray-500"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword2(!showSignupPassword2)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showSignupPassword2 ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {signupError && <p className="text-red-400 text-sm">{signupError}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#36C6E0] text-black rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? "Loading..." : "Continue"}
              </button>
            </form>
          </>
        )}

        {step === "verify" && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-white">Verify Email</h2>
            <p className="text-gray-300 mb-4">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-[#36C6E0]">{signupEmail}</span>. Please enter it below.
            </p>
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <PinInput length={6} onChange={setSignupCode} />
              
              {signupError && <p className="text-red-400 text-sm">{signupError}</p>}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#36C6E0] text-black rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? "Verifying..." : "Verify & Sign Up"}
              </button>

              <button
                type="button"
                onClick={() => setStep("form")}
                className="text-gray-400 hover:text-white text-sm transition"
              >
                ← Back to form
              </button>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}