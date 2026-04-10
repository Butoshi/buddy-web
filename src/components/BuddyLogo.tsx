"use client";

import { useEffect, useRef, useCallback } from "react";

interface BuddyLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function BuddyLogo({
  width = 40,
  height = 35,
  className = "",
}: BuddyLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Colors
  const textColor = "#ffffff"; // white B (same as "Buddy" text)

  const drawBuddy = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Draw rotated "B" as the eye outline
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-Math.PI / 2); // Rotate -90 degrees (counter-clockwise)

    // Font settings - bold/black like "Buddy" text
    const fontSize = Math.min(W, H) * 1.4;
    ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw the B
    ctx.fillStyle = textColor;
    ctx.fillText("B", 0, fontSize * 0.05);

    ctx.restore();
  }, []);

  useEffect(() => {
    const draw = () => {
      drawBuddy();
      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawBuddy]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ display: "block" }}
    />
  );
}
