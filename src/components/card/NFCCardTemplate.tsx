"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface NFCCardTemplateProps {
  studentName: string;
  cardImageUrl?: string | null;
  interactive?: boolean;
  size?: "sm" | "md" | "lg" | "tv";
  showFlipButton?: boolean;
  className?: string;
}

export function NFCCardTemplate({
  studentName,
  cardImageUrl,
  interactive = true,
  size = "md",
  showFlipButton = false,
  className = "",
}: NFCCardTemplateProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Responsive size configurations
  const sizeClasses = {
    sm: "w-full max-w-[320px] text-xs",
    md: "w-full max-w-[440px] text-sm",
    lg: "w-full max-w-[560px] text-base",
    tv: "w-[92vw] max-w-[740px] xl:max-w-[860px] text-lg",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateY((x / (rect.width / 2)) * 12);
    setRotateX((-y / (rect.height / 2)) * 12);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setRotateX(0);
    setRotateY(0);
  };

  const displayName = (studentName || "STUDENT NAME").toUpperCase();

  return (
    <div className={`w-full flex justify-center perspective-[1200px] select-none ${className}`}>
      <motion.div
        className={`relative ${sizeClasses[size]} rounded-[24px] cursor-pointer shadow-card-3d transition-transform duration-200 ease-out`}
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: rotateX,
          rotateY: rotateY + (isFlipped ? 180 : 0),
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => showFlipButton && setIsFlipped(!isFlipped)}
      >
        {/* If a real pre-rendered high-res PNG image exists, render it with 3D wrapper */}
        {cardImageUrl ? (
          <div className="relative w-full rounded-[24px] overflow-hidden border border-amber-500/30">
            <img
              src={cardImageUrl}
              alt={`NFC Card - ${displayName}`}
              className="w-full h-auto block object-cover"
            />
            {/* Glossy Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </div>
        ) : (
          /* FRONT SIDE OVER OFFICIAL TEMPLATE PICTURE */
          <div
            className="relative w-full rounded-[24px] overflow-hidden border border-purple-500/30 shadow-2xl select-none"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Template Background Image in normal flow so container never collapses */}
            <img
              src="/assets/nfc-card-template.png"
              alt="NFC Card Template"
              className="w-full h-auto block object-cover"
            />

            {/* Overwritten Dynamic Student Name Only */}
            <div className="absolute left-[8%] top-[55%] -translate-y-1/2 flex flex-col justify-center max-w-[55%] z-10">
              <div className="font-display font-extrabold text-white text-base sm:text-xl md:text-2xl xl:text-3xl tracking-wide truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {displayName}
              </div>
            </div>

            {/* Shimmer Light Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
