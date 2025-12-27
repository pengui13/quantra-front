"use client";
export default function InfoBox({ header, text, icon: Icon }) {
  return (
    <div className="flex gap-4 bg-black border border-[#36C6E0]/20 rounded-xl p-6 items-start">
      {Icon && <Icon className="w-6 h-6 text-[#36C6E0]" />}
      <div className="flex flex-col">
        <h6 className="font-semibold text-bl text-lg">{header}</h6>
        <p className="text-gray-400 text-sm">{text}</p>
      </div>
    </div>
  );
}
