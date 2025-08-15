"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

type SpotlightProps = {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
};

export const Spotlight = ({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)",
  translateY = -1100,
  width = 560,
  height = 2080,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
}: SpotlightProps = {}) => {
  const [dimensions, setDimensions] = useState({
    responsiveWidth: width,
    responsiveSmallWidth: smallWidth,
    responsiveHeight: height,
    responsiveTranslateY: translateY,
    responsiveXOffset: xOffset,
  });

  // Run only on client after mount
  useEffect(() => {
    const isSmallScreen = window.innerWidth < 768;
    setDimensions({
      responsiveWidth: isSmallScreen ? 300 : width,
      responsiveSmallWidth: isSmallScreen ? 120 : smallWidth,
      responsiveHeight: isSmallScreen ? 1200 : height,
      responsiveTranslateY: isSmallScreen ? -600 : translateY,
      responsiveXOffset: isSmallScreen ? 50 : xOffset,
    });
  }, [width, height, smallWidth, translateY, xOffset]);

  const {
    responsiveWidth,
    responsiveSmallWidth,
    responsiveHeight,
    responsiveTranslateY,
    responsiveXOffset,
  } = dimensions;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pointer-events-none absolute inset-0 h-full w-full mt-40"
    >
      {/* Left side */}
      <motion.div
        animate={{ x: [0, responsiveXOffset, 0] }}
        transition={{ duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none"
      >
        <div
          style={{
            transform: `translateY(${responsiveTranslateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${responsiveWidth}px`,
            height: `${responsiveHeight}px`,
          }}
          className="absolute top-0 left-0"
        />
        <div
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            background: gradientSecond,
            width: `${responsiveSmallWidth}px`,
            height: `${responsiveHeight}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
        <div
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            background: gradientThird,
            width: `${responsiveSmallWidth}px`,
            height: `${responsiveHeight}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
      </motion.div>

      {/* Right side */}
      <motion.div
        animate={{ x: [0, -responsiveXOffset, 0] }}
        transition={{ duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute top-0 right-0 w-screen h-screen z-40 pointer-events-none"
      >
        <div
          style={{
            transform: `translateY(${responsiveTranslateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${responsiveWidth}px`,
            height: `${responsiveHeight}px`,
          }}
          className="absolute top-0 right-0"
        />
        <div
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            background: gradientSecond,
            width: `${responsiveSmallWidth}px`,
            height: `${responsiveHeight}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
        <div
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            background: gradientThird,
            width: `${responsiveSmallWidth}px`,
            height: `${responsiveHeight}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
      </motion.div>
    </motion.div>
  );
};
