import React, { useState, useRef, useEffect } from "react";

export function capitalizeFirstLetter(string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const DraggableBalance = React.forwardRef(({
  type,
  layout = "horizontal",
  containerWidth = 0,
  isMobile = false,
  balance,
  balanceChangeUsd,
  balanceChangePerc,
  hiddenBalance,
  isEditMode = false,
  onDragStart: parentDragStart,
  onDragEnd: parentDragEnd,
  dragIndex,
  isDragging,
  isDropTarget,
}, dragRef) => {
  const isPositive = balanceChangePerc >= 0;
  const safeBalance = !balance || isNaN(parseFloat(balance)) ? "0" : balance;

  const handleDragStart = (e) => {
    if (isMobile) return;

    e.dataTransfer.setData("text/plain", dragIndex.toString());
    e.dataTransfer.effectAllowed = "move";

    if (dragRef && dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      const ghostElement = dragRef.current.cloneNode(true);

      ghostElement.style.width = `${rect.width}px`;
      ghostElement.style.height = `${rect.height}px`;
      ghostElement.style.opacity = "0.95";
      ghostElement.style.position = "absolute";
      ghostElement.style.top = "-1000px";
      ghostElement.style.boxShadow = "0 12px 48px rgba(54, 198, 224, 0.4)";
      ghostElement.style.zIndex = "9999";
      ghostElement.style.pointerEvents = "none";
      ghostElement.style.transform = "rotate(3deg) scale(1.03)";

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

  const handleDragEnd = () => {
    if (isMobile) return;
    if (parentDragEnd) parentDragEnd();
  };

  return (
    <div
      ref={dragRef}
      className={`rounded-xl flex items-center justify-between px-6 py-5 transition-all duration-300 border flex-1 bg-black
        ${
          isDragging
            ? "opacity-100 border-[#36C6E0]/20"
            : isDropTarget
            ? "border-[#36C6E0]/80 shadow-2xl shadow-[#36C6E0]/40"
            : "opacity-100 border-[#36C6E0]/30 hover:border-[#36C6E0]/60 hover:shadow-xl hover:shadow-[#36C6E0]/30"
        } 
        ${isMobile ? "" : "cursor-grab active:cursor-grabbing"}
      `}
      draggable={!isMobile}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-type={type}
      data-index={dragIndex}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <h5 className="font-semibold text-[#36C6E0] text-sm mb-0.5 tracking-wide">
            {type === "otc"
              ? "OTC"
              : type === "staking"
              ? "Staking"
              : capitalizeFirstLetter(type)}
          </h5>
          <p className="font-bold text-white text-base">
            {hiddenBalance ? "••••••" : `$${Number(safeBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className={`text-sm font-bold transition-colors duration-300 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            {isPositive ? "+" : ""}{balanceChangeUsd?.toFixed(2) || "0.00"}
          </p>
          <p className={`text-xs font-medium transition-colors duration-300 ${isPositive ? "text-emerald-400/70" : "text-red-400/70"}`}>
            {isPositive ? "+" : ""}{balanceChangePerc?.toFixed(2) || "0.00"}%
          </p>
        </div>

        <div className={`text-[#36C6E0] transition-all duration-300 flex-shrink-0 ${isDropTarget ? "opacity-100 scale-110" : "opacity-50 hover:opacity-100"}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="12" r="2.5" fill="currentColor" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            <circle cx="18" cy="12" r="2.5" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
});

DraggableBalance.displayName = "DraggableBalance";

export default function DraggableBalanceContainer({
  hiddenBalance = false,
  stakeBalanceUsd = 5234.50,
  stakeChangeUsd = 234.50,
  stakeChangePerc = 4.67,
  otcBalanceUsd = 8567.23,
  otcChangeUsd = 156.77,
  otcChangePerc = 1.86,
  spotBalanceUsd = 12345.67,
  spotChangePerc = 2.34,
  spotChangeUsd = 287.65,
}) {
  const defaultBalanceTypes = ["spot", "staking", "otc"];
  const COOKIE_NAME = "balanceTypesOrder";

  const [balanceTypes, setBalanceTypes] = useState(defaultBalanceTypes);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  const [isDraggingActive, setIsDraggingActive] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const containerRef = useRef(null);
  const dragRefs = useRef({});

  // Load from cookies on mount
  useEffect(() => {
    try {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${COOKIE_NAME}=`));

      if (cookieValue) {
        const storedBalanceTypes = JSON.parse(
          decodeURIComponent(cookieValue.split("=")[1])
        );
        
        if (Array.isArray(storedBalanceTypes) && storedBalanceTypes.length === 3) {
          console.log("✅ Loaded from cookies:", storedBalanceTypes);
          setBalanceTypes(storedBalanceTypes);
        }
      }
    } catch (error) {
      console.error("Error loading from cookies:", error);
    }
  }, []);

  // Save to cookies when balance types change
  useEffect(() => {
    if (balanceTypes.length === 3 && balanceTypes[0]) {
      try {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
          JSON.stringify(balanceTypes)
        )}; expires=${expirationDate.toUTCString()}; path=/`;
        
        console.log("✅ Saved to cookies:", balanceTypes);
      } catch (error) {
        console.error("Error saving to cookies:", error);
      }
    }
  }, [balanceTypes]);

  const handleDragStart = (e, index) => {
    console.log("🚀 Drag start - Index:", index, "Type:", balanceTypes[index]);
    setIsDraggingActive(true);
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragEnd = () => {
    console.log("🛑 Drag end");
    setIsDraggingActive(false);
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTargetIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();

    const dragIndexStr = e.dataTransfer.getData("text/plain");
    const dragIndex = parseInt(dragIndexStr);
    
    console.log("📥 Drop - From index:", dragIndex, "To index:", dropIndex);

    if (isNaN(dragIndex) || dragIndex === dropIndex) {
      console.log("❌ Invalid drop");
      setDropTargetIndex(null);
      return;
    }

    const newBalanceTypes = [...balanceTypes];
    const draggedItem = newBalanceTypes[dragIndex];
    newBalanceTypes.splice(dragIndex, 1);
    newBalanceTypes.splice(dropIndex, 0, draggedItem);

    console.log("✨ New order:", newBalanceTypes);
    setBalanceTypes(newBalanceTypes);
    setDropTargetIndex(null);
  };

  const handleContainerDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragLeave = (e) => {
    if (!containerRef.current?.contains(e.relatedTarget)) {
      setDropTargetIndex(null);
    }
  };

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="flex items-center gap-4 w-full"
        onDragOver={handleContainerDragOver}
        onDragLeave={handleDragLeave}
      >
        {balanceTypes.map((type, index) => {
          let balance = 0;
          let balanceChangeUsd = 0;
          let balanceChangePerc = 0;

          if (type === "spot") {
            balance = spotBalanceUsd;
            balanceChangeUsd = spotChangeUsd;
            balanceChangePerc = spotChangePerc;
          } else if (type === "staking") {
            balance = parseFloat(stakeBalanceUsd);
            balanceChangeUsd = stakeChangeUsd;
            balanceChangePerc = stakeChangePerc;
          } else if (type === "otc") {
            balance = otcBalanceUsd;
            balanceChangeUsd = otcChangeUsd;
            balanceChangePerc = otcChangePerc;
          }

          return (
            <div
              key={`${type}-${index}`}
              data-item-index={index}
              className="relative transition-all duration-300 flex-1"
              style={{
                opacity: 1,
              }}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              {dropTargetIndex === index && isDraggingActive && (
                <>
                  <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-[#36C6E0]/0 via-[#36C6E0]/80 to-[#36C6E0]/0 rounded-full" />
                  <div className="absolute -right-1 top-0 bottom-0 w-1 bg-gradient-to-b from-[#36C6E0]/0 via-[#36C6E0]/80 to-[#36C6E0]/0 rounded-full" />
                </>
              )}

              <DraggableBalance
                ref={(el) => {
                  dragRefs.current[index] = el;
                }}
                type={type}
                balance={balance}
                balanceChangeUsd={balanceChangeUsd}
                balanceChangePerc={balanceChangePerc}
                hiddenBalance={hiddenBalance}
                isMobile={false}
                dragIndex={index}
                isDragging={isDraggingActive && draggedIndex === index}
                isDropTarget={dropTargetIndex === index && isDraggingActive}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}