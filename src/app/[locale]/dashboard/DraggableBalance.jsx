import React, { useState, useRef } from "react";
import Image from "next/image";

export function capitalizeFirstLetter(string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function DraggableBalance({
  type,
  layout = "horizontal",
  containerWidth = 0,
  isMobile = false,
  balance,
  hiddenBalance,
  isEditMode = false,
  onDragStart: parentDragStart,
  onDragEnd: parentDragEnd,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);

  const safeBalance = !balance || isNaN(parseFloat(balance)) ? "0" : balance;

  // Handle the start of dragging (desktop only)
  const handleDragStart = (e) => {
    if (isMobile) return;

    setIsDragging(true);
    
    // IMPORTANT: Set drag data with the type
    e.dataTransfer.setData("text/plain", type);
    e.dataTransfer.effectAllowed = "move";

    console.log("🚀 Drag Start:", type);

    // Create a custom drag image
    if (dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      const ghostElement = dragRef.current.cloneNode(true);

      ghostElement.style.width = `${rect.width}px`;
      ghostElement.style.height = `${rect.height}px`;
      ghostElement.style.opacity = "0.9";
      ghostElement.style.position = "absolute";
      ghostElement.style.top = "-1000px";
      ghostElement.style.boxShadow = "0 6px 12px rgba(54, 198, 224, 0.25)";
      ghostElement.style.zIndex = "9999";
      ghostElement.style.pointerEvents = "none";
      ghostElement.style.transform = "rotate(2deg)";

      document.body.appendChild(ghostElement);
      e.dataTransfer.setDragImage(ghostElement, 15, 15);

      setTimeout(() => {
        if (document.body.contains(ghostElement)) {
          document.body.removeChild(ghostElement);
        }
      }, 0);
    }

    if (parentDragStart) parentDragStart();
  };

  // Handle the end of dragging (desktop only)
  const handleDragEnd = () => {
    if (isMobile) return;

    console.log("🛑 Drag End");
    setIsDragging(false);
    if (parentDragEnd) parentDragEnd();
  };

  return (
    <div
      ref={dragRef}
      className={`rounded-xl flex border p-4 transition-all duration-200
        ${
          isDragging
            ? "opacity-30 border-[#36C6E0]/20"
            : isEditMode && isMobile
            ? "opacity-100 border-[#36C6E0]/30 bg-gradient-to-br from-[#0d0d0d] via-black to-[#1a1a1a]"
            : "opacity-100 border-[#36C6E0]/20 hover:border-[#36C6E0]/50 hover:shadow-lg hover:shadow-[#36C6E0]/20 hover:-translate-y-1 hover:scale-105"
        } 
        ${
          isMobile ? "" : "cursor-grab active:cursor-grabbing"
        }
        ${layout === "fit-width" ? "w-full" : ""}
        bg-gradient-to-br from-[#0d0d0d] via-black to-[#1a1a1a]
      `}
      style={{
        width: layout === "fit-width" ? "100%" : "auto",
        minWidth: layout === "scrollable" && !isMobile ? "271px" : "150px",
      }}
      draggable={!isMobile}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-type={type}
    >
      {/* Mobile layout */}
      {isMobile ? (
        <div className="flex w-full justify-between items-start">
          <div className="flex flex-col items-left">
            <Image
              alt=""
              src={`/assets/icons/${type}_icon.svg`}
              width={32}
              height={32}
              className="mb-3"
            />

            <div className="flex flex-col items-left text-left">
              <h5 className="font-semibold text-[#36C6E0] text-sm">
                {type == "otc"
                  ? "OTC"
                  : type == "staking"
                  ? "Staking"
                  : capitalizeFirstLetter(type)}
              </h5>
              <p className="font-semibold text-white text-base">
                {hiddenBalance ? "******" : safeBalance} USDT
              </p>
            </div>
          </div>

          <Image
            src={"/assets/icons/drag_dots.svg"}
            width={20}
            height={20}
            alt=""
            className={
              isEditMode
                ? "opacity-60"
                : "cursor-grab active:cursor-grabbing hover:opacity-80 transition-opacity"
            }
            draggable="false"
          />
        </div>
      ) : (
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              alt=""
              src={`/assets/icons/${type}_icon.svg`}
              width={40}
              height={40}
            />

            <div className="flex flex-col">
              <h5 className="font-semibold text-[#36C6E0] text-sm">
                {type == "otc"
                  ? "OTC"
                  : type == "copyTrade"
                  ? "Staking"
                  : capitalizeFirstLetter(type)}{" "}
              </h5>
              <p className="font-semibold text-white text-lg">
                {hiddenBalance ? "******" : safeBalance} USDT
              </p>
            </div>
          </div>

          <Image
            src={"/assets/icons/drag_dots.svg"}
            width={20}
            height={20}
            alt="Drag to reorder"
            className="cursor-grab active:cursor-grabbing hover:opacity-80 transition-opacity opacity-70 hover:opacity-100"
            draggable="false"
          />
        </div>
      )}
    </div>
  );
}