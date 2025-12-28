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
import {
  LogOut,
  Globe,
  LayoutDashboard,
  LogIn,
  TrendingUp,
  Shuffle,
  List,
  BadgeQuestionMark,
  X,
  Menu,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);

  const switchLanguage = () => {
    const newLocale = currentLocale === "en" ? "de" : "en";
    const pathWithoutLocale = pathname.replace(/^\/(en|de)/, "");
    router.push(`/${newLocale}${pathWithoutLocale || ""}`);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    clientSideLogout();
    window.dispatchEvent(new CustomEvent("ping:update", { detail: false }));
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-black border-b border-[#36C6E0]/10">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo */}
        <button
          onClick={() => router.push(`/${currentLocale}`)}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <Image src="/logo.png" alt="Quantra Logo" width={32} height={32} />
          <span className="text-lg font-bold text-white tracking-wide">Quantra</span>
        </button>

        {/* Desktop Nav */}
        {isAuthed && (
          <nav className="hidden lg:flex items-center gap-6">
            <NavItem href={`/${currentLocale}/dashboard`} icon={<LayoutDashboard />} label="Dashboard" />
            <NavItem href={`/${currentLocale}/about-us`} icon={<BadgeQuestionMark />} label="About Us" />
            <NavItem href={`/${currentLocale}/deposit`} icon={<LogIn />} label="Deposit" />
            <NavItem href={`/${currentLocale}/withdraw`} icon={<LogOut />} label="Withdraw" />
            <NavItem href={`/${currentLocale}/staking`} icon={<TrendingUp />} label="Staking" />
            <NavItem href={`/${currentLocale}/otc`} icon={<Shuffle />} label="OTC" />
          </nav>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {!isAuthed ? (
            <>
              <button
                onClick={() => setShowLogin(true)}
                className="px-3 py-2 border border-[#36C6E0]/30 rounded-lg text-white hover:border-[#36C6E0] hover:text-[#36C6E0] transition text-sm sm:text-base"
              >
                {t("login")}
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="px-4 py-2 bg-[#36C6E0] text-black rounded-lg font-semibold hover:bg-[#36C6E0]/90 transition text-sm sm:text-base"
              >
                {t("signup")}
              </button>
            </>
          ) : (
            <>
              {/* Desktop Right Controls */}
              <div className="hidden lg:flex items-center gap-2">
                <BalanceDropdown />
                <CoinModal />
                <button
                  onClick={switchLanguage}
                  className="p-2 border border-[#36C6E0]/30 rounded-lg hover:border-[#36C6E0] hover:bg-[#36C6E0]/10 transition flex items-center justify-center"
                >
                  <Globe className="w-4 h-4 text-[#36C6E0]" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 border border-[#36C6E0]/30 rounded-lg hover:border-[#36C6E0] hover:bg-[#36C6E0]/10 transition flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Mobile/Tablet Hamburger */}
              <button
                className="lg:hidden p-2 border border-[#36C6E0]/30 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-black border-t border-[#36C6E0]/10 flex flex-col gap-2 px-4 sm:px-6 py-4"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
                hidden: { transition: { staggerChildren: 0.05 } },
              }}
              className="flex flex-col gap-2"
            >
              {/* Nav Links */}
              <MobileNavItem href={`/${currentLocale}/dashboard`} icon={<LayoutDashboard />} label="Dashboard" />
              <MobileNavItem href={`/${currentLocale}/about-us`} icon={<BadgeQuestionMark />} label="About Us" />
              <MobileNavItem href={`/${currentLocale}/deposit`} icon={<LogIn />} label="Deposit" />
              <MobileNavItem href={`/${currentLocale}/withdraw`} icon={<LogOut />} label="Withdraw" />
              <MobileNavItem href={`/${currentLocale}/staking`} icon={<TrendingUp />} label="Staking" />
              <MobileNavItem href={`/${currentLocale}/otc`} icon={<Shuffle />} label="OTC" />

              {/* Balance & CoinModal in dropdown */}
              <div className="flex flex-col gap-2 mt-4">
                <BalanceDropdown isMobile />
                <CoinModal />

                <button
                  onClick={switchLanguage}
                  className="px-4 py-2 border border-[#36C6E0]/30 rounded-lg text-white hover:border-[#36C6E0] hover:text-[#36C6E0] transition flex items-center"
                >
                  <Globe className="inline w-4 h-4 mr-1 text-[#36C6E0]" /> Switch Language
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-[#36C6E0]/30 rounded-lg text-white hover:border-[#36C6E0] hover:text-[#36C6E0] transition flex items-center"
                >
                  <LogOut className="inline w-4 h-4 mr-1 text-white" /> Logout
                </button>
              </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showSignup && <RegisterModal showSignup={showSignup} setShowSignup={setShowSignup} />}
        {showLogin && <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />}
      </AnimatePresence>
    </header>
  );
}

// --- Desktop Balance Dropdown ---
function BalanceDropdown({ isMobile }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative ${isMobile ? "" : "cursor-pointer"}`}>
      {!isMobile ? (
        <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
          <Balance />
        </div>
      ) : (
        <div onClick={() => setOpen(!open)}>
          <Balance />
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute ${isMobile ? "relative mt-2" : "right-0 mt-2"} w-52 bg-[#0d0d0d] border border-gray-700 rounded-lg shadow-lg p-3 flex flex-col gap-2 z-50`}
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
  );
}

// --- NavItem ---
function NavItem({ href, icon, label }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white hover:text-[#36C6E0] hover:bg-[#36C6E0]/10 transition-all"
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </a>
  );
}


function MobileNavItem({ href, icon, label }) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white hover:text-[#36C6E0] hover:bg-[#36C6E0]/10 transition-all"
    >
      {icon}
      {label}
    </motion.a>
  );
}
