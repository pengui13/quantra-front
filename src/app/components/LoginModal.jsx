"use client";
import Modal from "react-modal";
import { Eye, EyeOff, X } from "lucide-react";

export default function LoginModal({
  showLogin,
  setShowLogin,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  showLoginPassword,
  setShowLoginPassword,
  loginError,
  handleLogin,
}) {
  return (
    <Modal
      isOpen={showLogin}
      onRequestClose={() => setShowLogin(false)}
      contentLabel="Login Modal"
      className="relative w-[95%] max-w-md rounded-[24px] bg-[#121212] p-8 shadow-lg flex flex-col gap-6 !outline-none"
      overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[10000]"
    >
      {/* Header */}
      <button
        onClick={() => setShowLogin(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
        aria-label="Close"
      >
        <X size={22} />
      </button>

      <h2 className="text-2xl font-bold">Log In</h2>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          className="px-4 py-3 rounded-lg bg-black/40 border border-gray-700 focus:border-[#36C6E0] outline-none"
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showLoginPassword ? "text" : "password"}
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full px-4 py-3 pr-10 rounded-lg bg-black/40 border border-gray-700 focus:border-[#36C6E0] outline-none"
            required
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
          className="w-full py-3 bg-[#36C6E0] text-black rounded-lg font-semibold hover:scale-105 transition-transform"
        >
          Log In
        </button>
      </form>
    </Modal>
  );
}
