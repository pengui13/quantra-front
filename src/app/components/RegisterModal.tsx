"use client";
import Modal from "react-modal";
import Carousel from "./Carousel";
import { Eye, EyeOff, X } from "lucide-react";
import PinInput from "./PinInput";

export default function RegisterModal({
  showSignup,
  setShowSignup,
  signupEmail,
  setSignupEmail,
  signupPassword,
  setSignupPassword,
  signupPassword2,
  setSignupPassword2,
  signupCode,
  setSignupCode,
  signupError,
  setSignupError,
  handleSignupForm,
  handleVerify,
  step,
  setStep,
  showSignupPassword,
  setShowSignupPassword,
  showSignupPassword2,
  setShowSignupPassword2,
}) {
  return (
    <Modal
      isOpen={showSignup}
      onRequestClose={() => setShowSignup(false)}
      contentLabel="Register Modal"
      className="relative flex w-[95%] max-w-4xl overflow-hidden rounded-[28px] bg-[#121212] shadow-lg !outline-none"
      overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[10000]"
    >
      <div className="hidden md:block w-1/2">
        <Carousel />
      </div>

      <div className="w-full md:w-1/2 p-8 relative">
        <button
          onClick={() => setShowSignup(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {step === "form" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Create Account</h2>
            <form onSubmit={handleSignupForm} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="px-4 py-3 rounded-lg bg-black/40 border border-gray-700 focus:border-[#36C6E0] outline-none w-full"
                required
              />

              {/* Password */}
              <div className="relative">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="Password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-lg bg-black/40 border border-gray-700 focus:border-[#36C6E0] outline-none"
                  required
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
                  className="w-full px-4 py-3 pr-10 rounded-lg bg-black/40 border border-gray-700 focus:border-[#36C6E0] outline-none"
                  required
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
                className="w-full py-3 bg-[#36C6E0] text-black rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Continue
              </button>
            </form>
          </>
        )}

        {step === "verify" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Verify Email</h2>
            <p className="text-gray-300 mb-4">
              We sent a 6-digit code to{" "}
              <span className="font-semibold">{signupEmail}</span>. Please enter it below.
            </p>
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <PinInput length={6} onChange={setSignupCode} />
              {signupError && <p className="text-red-400 text-sm">{signupError}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-[#36C6E0] text-black rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Verify & Sign Up
              </button> 
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
