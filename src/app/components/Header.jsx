"use client";

import RegisterModal from "../components/RegisterModal";
import LoginModal from "../components/LoginModal";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { loginUser, registerUser } from "../../../api/ApiWrapper";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const t = useTranslations("Header");
  const router = useRouter();
  const pathname = usePathname();

  // get locale from path (/en/... or /de/...)
  const currentLocale = pathname.split("/")[1] === "de" ? "de" : "en";

  // modal & form state
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPassword2, setSignupPassword2] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupPassword2, setShowSignupPassword2] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupCode, setSignupCode] = useState("");
  const [step, setStep] = useState("form");

  // switch locale (preserve current route)
  const switchLanguage = () => {
    const newLocale = currentLocale === "en" ? "de" : "en";
    const pathWithoutLocale = pathname.replace(/^\/(en|de)/, "");
    router.push(`/${newLocale}${pathWithoutLocale || ""}`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    loginUser(
      loginEmail,
      loginPassword,
      () => setShowLogin(false),
      () => setLoginError("Invalid credentials, please try again.")
    );
  };

  const handleSignupForm = async (e) => {
    e.preventDefault();
    if (signupPassword !== signupPassword2) {
      setSignupError("Passwords do not match");
      return;
    }
    setSignupError("");
    setStep("verify");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (signupCode.length !== 6) {
      setSignupError("Verification code must be 6 digits");
      return;
    }
    setSignupError("");
    registerUser(
      signupEmail,
      signupPassword,
      signupCode,
      () => {
        setShowSignup(false);
        setShowLogin(true);
        setStep("form");
        setSignupEmail("");
        setSignupPassword("");
        setSignupPassword2("");
        setSignupCode("");
      },
      () => setSignupError("Registration failed, please try again.")
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-6 border-b border-white/10 bg-black/80 backdrop-blur-md z-[1000]">
      {/* ✅ Logo → Clickable, goes to localized Home */}
      <button
        onClick={() => router.push(`/${currentLocale}`)}
        className="flex items-center cursor-pointer gap-2 hover:opacity-80 transition"
      >
        <Image src="/logo.png" alt="Quantra Logo" width={32} height={32} />
        <span className="text-xl font-bold tracking-wide">Quantra</span>
      </button>

      {/* Navigation */}
      <nav className="flex gap-6 text-sm font-medium">
        {["features", "pricing", "about", "contact"].map((key) => (
          <a
            key={key}
            href={`#${key}`}
            className="relative hover:text-[#36C6E0] after:absolute after:w-0 after:h-[2px] after:bg-[#36C6E0] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
          >
            {t(key)}
          </a>
        ))}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Language switch */}
        <button
          onClick={switchLanguage}
          className="px-3 py-1 border border-gray-600 rounded-lg text-sm font-medium hover:border-[#36C6E0] hover:text-[#36C6E0] transition"
        >
          {currentLocale === "en" ? "EN" : "DE"}
        </button>

        {/* Auth buttons */}
        <button
          onClick={() => setShowLogin(true)}
          className="px-4 py-2 border border-gray-600 rounded-lg font-medium hover:border-[#36C6E0] hover:text-[#36C6E0]"
        >
          {t("login")}
        </button>
        <button
          onClick={() => setShowSignup(true)}
          className="px-5 py-2 bg-[#36C6E0] text-black rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-[#36C6E0]/30 transition"
        >
          {t("signup")}
        </button>

        {/* Modals */}
        <AnimatePresence>
          {showSignup && (
            <RegisterModal
              showSignup={showSignup}
              setShowSignup={setShowSignup}
              signupEmail={signupEmail}
              setSignupEmail={setSignupEmail}
              signupPassword={signupPassword}
              setSignupPassword={setSignupPassword}
              signupPassword2={signupPassword2}
              setSignupPassword2={setSignupPassword2}
              signupCode={signupCode}
              setSignupCode={setSignupCode}
              signupError={signupError}
              setSignupError={setSignupError}
              handleSignupForm={handleSignupForm}
              handleVerify={handleVerify}
              step={step}
              setStep={setStep}
              showSignupPassword={showSignupPassword}
              setShowSignupPassword={setShowSignupPassword}
              showSignupPassword2={showSignupPassword2}
              setShowSignupPassword2={setShowSignupPassword2}
            />
          )}

          {showLogin && (
            <LoginModal
              showLogin={showLogin}
              setShowLogin={setShowLogin}
              loginEmail={loginEmail}
              setLoginEmail={setLoginEmail}
              loginPassword={loginPassword}
              setLoginPassword={setLoginPassword}
              showLoginPassword={showLoginPassword}
              setShowLoginPassword={setShowLoginPassword}
              loginError={loginError}
              handleLogin={handleLogin}
            />
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
