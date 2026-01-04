"use client";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { Eye, EyeOff, X } from "lucide-react";
import { loginUser } from "../../../api/ApiWrapper";

export default function LoginModal({ showLogin, setShowLogin }) {
  // All state managed internally
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Set app element for accessibility
  useEffect(() => {
    if (typeof window !== "undefined") {
      Modal.setAppElement(document.body);
    }
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!showLogin) {
      setLoginEmail("");
      setLoginPassword("");
      setShowLoginPassword(false);
      setLoginError("");
    }
  }, [showLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    await loginUser(
      loginEmail,
      loginPassword,
      // onSuccess
      (data) => {
        setIsLoading(false);
        setShowLogin(false);
        window.dispatchEvent(new CustomEvent("ping:update", { detail: true }));
      },
      // onError
      (error) => {
        setIsLoading(false);
        setLoginError(error?.message || error?.detail || "Login failed. Please check your credentials.");
      }
    );
  };

  return (
    <Modal
      isOpen={showLogin}
      onRequestClose={() => setShowLogin(false)}
      contentLabel="Login Modal"
      className="relative w-[95%] max-w-md rounded-[24px] bg-[#121212] p-8 shadow-lg flex flex-col gap-6 outline-none"
      overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[10000]"
    >
      {/* Close button */}
      <button
        onClick={() => setShowLogin(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        aria-label="Close"
      >
        <X size={22} />
      </button>

      <h2 className="text-2xl font-bold text-white">Log In</h2>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          className="px-4 py-3 rounded-lg bg-black/40 border border-gray-700 focus:border-[#36C6E0] outline-none text-white placeholder-gray-500"
          required
          disabled={isLoading}
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showLoginPassword ? "text" : "password"}
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full px-4 py-3 pr-10 rounded-lg bg-black/40 border border-gray-700 focus:border-[#36C6E0] outline-none text-white placeholder-gray-500"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowLoginPassword(!showLoginPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
          >
            {showLoginPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {/* Error */}
        {loginError && <p className="text-red-400 text-sm">{loginError}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#36C6E0] text-black rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>

      {/* Forgot password link */}
      <button
        type="button"
        className="text-gray-400 hover:text-[#36C6E0] text-sm transition self-center"
        onClick={() => {
          // You can add forgot password logic here
          console.log("Forgot password clicked");
        }}
      >
        Forgot your password?
      </button>
    </Modal>
  );
}