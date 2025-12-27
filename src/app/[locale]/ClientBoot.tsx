"use client";

import { useEffect } from "react";
import { GetPing } from "../../../api/ApiWrapper";

export default function ClientBoot() {
  useEffect(() => {
    const MIN_SHOW_MS = 600;
    const FADE_MS = 220;

    const splash = document.getElementById("splash");
    const main = document.getElementById("main");
    const start = Date.now();

    function finish() {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_SHOW_MS - elapsed);
      
      setTimeout(() => {
        // Hide splash with display instead of removing
        if (splash) {
          splash.style.opacity = "0";
          splash.style.pointerEvents = "none";
          setTimeout(() => {
            splash.style.display = "none";
          }, FADE_MS);
        }
        
        // Show main
        if (main) {
          main.style.opacity = "1";
          main.style.pointerEvents = "auto";
          main.removeAttribute("aria-busy");
        }
      }, wait);
    }

    // Load logo and finish when ready
    const img = new Image();
    img.src = "/logo.png";
    
    Promise.resolve(img.decode?.() || Promise.resolve())
      .then(finish)
      .catch(finish);
    
    const cap = setTimeout(finish, 2500);

    // --- API health check ---
    function setOnline(ok: boolean) {
      document.documentElement.setAttribute("data-api-online", ok ? "true" : "false");
      window.dispatchEvent(new CustomEvent("ping:update", { detail: !!ok }));
    }

    function pingOnce() {
      GetPing(setOnline);
    }

    pingOnce();
    const interval = setInterval(pingOnce, 60_000);
    
    const handlePopState = () => pingOnce();
    window.addEventListener("popstate", handlePopState);

    // Cleanup
    return () => {
      clearInterval(interval);
      clearTimeout(cap);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}