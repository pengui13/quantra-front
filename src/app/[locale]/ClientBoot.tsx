"use client";

import { useEffect } from "react";
import { GetPing } from "../../../api/ApiWrapper"; // adjust path if different

export default function ClientBoot() {
  useEffect(() => {
    const MIN_SHOW_MS = 600;
    const FADE_MS = 220;

    // --- end splash ---
    const splash = document.getElementById("splash");
    const main = document.getElementById("main");
    const start = Date.now();

    function finish() {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_SHOW_MS - elapsed);
      setTimeout(() => {
        if (splash) {
          splash.style.opacity = "0";
          setTimeout(() => {
            splash.parentNode && splash.parentNode.removeChild(splash);
          }, FADE_MS);
        }
        if (main) {
          main.style.opacity = "1";
          (main as HTMLElement).style.pointerEvents = "auto";
          main.removeAttribute("aria-busy");
        }
      }, wait);
    }

    const img = new Image();
    img.src = "/logo.png";
    (img.decode ? img.decode() : Promise.resolve()).then(finish).catch(finish);
    const cap = setTimeout(finish, 2500);

    // --- ping via ApiWrapper to set auth status ---
    function setOnline(ok: boolean) {
      document.documentElement.setAttribute("data-api-online", ok ? "true" : "false");
      window.dispatchEvent(new CustomEvent("ping:update", { detail: !!ok }));
    }
    function pingOnce() { GetPing(setOnline); }

    pingOnce();
    const interval = setInterval(pingOnce, 60_000);
    const onPop = () => pingOnce();
    window.addEventListener("popstate", onPop);

    return () => {
      clearInterval(interval);
      clearTimeout(cap);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  return null;
}
