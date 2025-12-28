"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Balance from "./Balance.jsx";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import CoinModal from "./CoinModal.jsx";
import { loginUser, registerUser } from "../../../api/ApiWrapper";
import {
  LogOut,
  BadgeQuestionMark,
  Globe,
  LayoutDashboard,
  LogIn,
  TrendingUp,
  Shuffle,
  LogOut as WithdrawIcon,
  List
} from "lucide-react";

export default function Header() {
  const t = useTranslations("Header");
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = useMemo(() => {
    if (!pathname) return "en";
    return pathname.split("/")[1] === "de" ? "de" : "en";
  }, [pathname]);

  const initialOnline =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-api-online") === "true";

  const [apiOnline, setApiOnline] = useState(initialOnline);
  const [isAuthed, setIsAuthed] = useState(initialOnline);

  useEffect(() => {
    const sync = () => {
      const ok = document.documentElement.getAttribute("data-api-online") === "true";
      setApiOnline(ok);
      setIsAuthed(ok);
    };
    sync();
    const onPing = (e) => {
      if (e && typeof e.detail === "boolean") {
        setApiOnline(e.detail);
        setIsAuthed(e.detail);
      } else sync();
    };
    window.addEventListener("ping:update", onPing);
    return () => window.removeEventListener("ping:update", onPing);
  }, []);

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
      () => {
        setShowLogin(false);
        window.dispatchEvent(new CustomEvent("ping:update", { detail: true }));
      },
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

  function clearCookieEverywhere(name) {
    try {
      const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
      const host = location.hostname;
      const base = host.replace(/^www\./, "");
      const domains = ["", `; domain=${base}`, `; domain=.${base}`];
      const paths = ["", "; path=/"];
      for (const d of domains) {
        for (const p of paths) {
          document.cookie = `${name}=; expires=${expires}${p}${d}`;
          document.cookie = `${name}=; Max-Age=0${p}${d}`;
          document.cookie = `${name}=; expires=${expires}${p}${d}; SameSite=Lax`;
        }
      }
    } catch {}
  }

  function clientSideLogout() {
    const keys = [
      "access",
      "access_token",
      "refresh",
      "refresh_token",
      "jwt",
      "Authorization",
      "auth",
      "authToken",
      "accessToken",
      "refreshToken",
    ];
    for (const k of keys) {
      try { localStorage.removeItem(k); } catch {}
      try { sessionStorage.removeItem(k); } catch {}
    }
    for (const k of keys) clearCookieEverywhere(k);
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
    } catch {}
    clientSideLogout();
    window.dispatchEvent(new CustomEvent("ping:update", { detail: false }));
  };

  const [balanceOpen, setBalanceOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-black border-b border-[#36C6E0]/10">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <button
          onClick={() => router.push(`/${currentLocale}`)}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <Image src="/logo.png" alt="Quantra Logo" width={32} height={32} />
          <span className="text-lg font-bold text-white tracking-wide">Quantra</span>
        </button>

        {/* Center Navigation */}
        {isAuthed && (
          <nav className="flex items-center gap-6">
            <NavItem href={`/${currentLocale}/dashboard`} icon={<LayoutDashboard />} label="Dashboard" />
            <NavItem href={`/${currentLocale}/about-us`} icon={<BadgeQuestionMark />} label="About Us" />
            <NavItem href={`/${currentLocale}/deposit`} icon={<LogIn />} label="Deposit" />
            <NavItem href={`/${currentLocale}/withdraw`} icon={<WithdrawIcon />} label="Withdraw" />
            <NavItem href={`/${currentLocale}/staking`} icon={<TrendingUp />} label="Staking" />
            <NavItem href={`/${currentLocale}/otc`} icon={<Shuffle />} label="OTC" />
          </nav>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {!isAuthed ? (
            <>
              <button onClick={() => setShowLogin(true)} className="px-4 py-2 border border-[#36C6E0]/30 rounded-lg text-white hover:border-[#36C6E0] hover:text-[#36C6E0] transition">
                {t("login")}
              </button>
              <button onClick={() => setShowSignup(true)} className="px-5 py-2 bg-[#36C6E0] text-black rounded-lg font-semibold hover:bg-[#36C6E0]/90 transition">
                {t("signup")}
              </button>
            </>
          ) : (
            <>
              {/* Balance Dropdown */}
              <div className="relative" onMouseEnter={() => setBalanceOpen(true)} onMouseLeave={() => setBalanceOpen(false)}>
                <Balance />
                <AnimatePresence>
                  {balanceOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-52 bg-[#0d0d0d] border border-gray-700 rounded-lg shadow-lg p-3 flex flex-col gap-2 z-50"
                    >
                      <a
                        href={`/${currentLocale}/transactions`}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[#36C6E0]/10 rounded text-white text-sm"
                      >
                        <List className="w-4 h-4" />
                        <span>Transactions</span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <CoinModal />

              <button onClick={switchLanguage} className="p-2 border border-[#36C6E0]/30 rounded-lg hover:border-[#36C6E0] hover:bg-[#36C6E0]/10 transition flex items-center justify-center">
                <Globe className="w-4 h-4 text-[#36C6E0]" />
              </button>

              <button onClick={handleLogout} className="p-2 border border-[#36C6E0]/30 rounded-lg hover:border-[#36C6E0] hover:bg-[#36C6E0]/10 transition flex items-center justify-center">
                <LogOut className="w-4 h-4 text-white" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSignup && <RegisterModal
          showSignup={showSignup} setShowSignup={setShowSignup}
          signupEmail={signupEmail} setSignupEmail={setSignupEmail}
          signupPassword={signupPassword} setSignupPassword={setSignupPassword}
          signupPassword2={signupPassword2} setSignupPassword2={setSignupPassword2}
          signupCode={signupCode} setSignupCode={setSignupCode}
          signupError={signupError} setSignupError={setSignupError}
          handleSignupForm={handleSignupForm} handleVerify={handleVerify}
          step={step} setStep={setStep}
          showSignupPassword={showSignupPassword} setShowSignupPassword={setShowSignupPassword}
          showSignupPassword2={showSignupPassword2} setShowSignupPassword2={setShowSignupPassword2}
        />}
        {showLogin && <LoginModal
          showLogin={showLogin} setShowLogin={setShowLogin}
          loginEmail={loginEmail} setLoginEmail={setLoginEmail}
          loginPassword={loginPassword} setLoginPassword={setLoginPassword}
          showLoginPassword={showLoginPassword} setShowLoginPassword={setShowLoginPassword}
          loginError={loginError} handleLogin={handleLogin}
        />}
      </AnimatePresence>
    </header>
  );
}

// --- NavItem Component ---
function NavItem({ href, icon, label }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white hover:text-[#36C6E0] hover:bg-[#36C6E0]/10 transition-all"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
