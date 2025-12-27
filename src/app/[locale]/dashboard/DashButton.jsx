import React from "react";
import { 
  ArrowUpRight, 
  Send, 
  Download, 
  Copy, 
  MoreHorizontal, 
  Plus,
  Minus,
  Shuffle,
  LogIn,
  LogOut
} from "lucide-react";

export default function DashButton({ text, icon = "send" }) {
  // Map icon names to lucide icons
  const iconMap = {
    send: Send,
    arrowUp: ArrowUpRight,
    download: Download,
    copy: Copy,
    more: MoreHorizontal,
    plus: Plus,
    minus: Minus,
    shuffle: Shuffle,
    login: LogIn,
    logout: LogOut,
  };

  const IconComponent = iconMap[icon] || Send;

  return (
    <button className="flex py-3 w-full rounded-xl items-center bg-[#36C6E0] hover:bg-[#36C6E0]/90 justify-center gap-2 px-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#36C6E0]/30 active:scale-95">
      <span className="text-black text-sm font-semibold">{text}</span>
      <IconComponent width={18} height={18} className="text-black" strokeWidth={2.5} />
    </button>
  );
}