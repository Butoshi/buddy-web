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
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const lidRef = useRef({ left: 0, right: 0 });

  // Colors
  const textColor = "#ffffff";   // white B (same as "Buddy" text)
  const pupilColor = "#0f172a";  // dark blue pupils (site background)
  const lidColor = "#ffffff";    // white eyelids (same as B)

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
    ctx.rotate(-Math.PI / 2); // Rotate -90 degrees

    // Font settings - bold/black like "Buddy" text
    const fontSize = Math.min(W, H) * 1.4;
    ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw the B
    ctx.fillStyle = textColor;
    ctx.fillText("B", 0, fontSize * 0.05);

    ctx.restore();

    // Pupil movement based on mouse
    const maxDX = W * 0.04;
    const maxDY = H * 0.04;
    const pdx = smoothRef.current.x * maxDX;
    const pdy = smoothRef.current.y * maxDY;

    // Pupil size
    const pupilW = W * 0.15;
    const pupilH = H * 0.12;
    const pupilR = Math.min(pupilW, pupilH) * 0.4;

    // Top eye position (smaller hole of B - top when rotated)
    const topEyeX = W * 0.52 + pdx;
    const topEyeY = H * 0.30 + pdy;

    // Bottom eye position (bigger hole of B - bottom when rotated)
    const bottomEyeX = W * 0.48 + pdx;
    const bottomEyeY = H * 0.68 + pdy;

    // Draw pupils (dark blue)
    ctx.fillStyle = pupilColor;

    // Top pupil
    if (lidRef.current.left < 0.9) {
      ctx.beginPath();
      ctx.roundRect(topEyeX - pupilW/2, topEyeY - pupilH/2, pupilW, pupilH, pupilR);
      ctx.fill();
    }

    // Bottom pupil
    if (lidRef.current.right < 0.9) {
      ctx.beginPath();
      ctx.roundRect(bottomEyeX - pupilW/2, bottomEyeY - pupilH/2, pupilW, pupilH, pupilR);
      ctx.fill();
    }

    // Eyelids (for blink - covers the pupils with white)
    if (lidRef.current.left > 0) {
      ctx.fillStyle = lidColor;
      const lidH = pupilH * 1.5 * lidRef.current.left;
      ctx.beginPath();
      ctx.roundRect(topEyeX - pupilW/2 - 2, topEyeY - pupilH/2 - 2, pupilW + 4, lidH, pupilR);
      ctx.fill();
    }

    if (lidRef.current.right > 0) {
      ctx.fillStyle = lidColor;
      const lidH = pupilH * 1.5 * lidRef.current.right;
      ctx.beginPath();
      ctx.roundRect(bottomEyeX - pupilW/2 - 2, bottomEyeY - pupilH/2 - 2, pupilW + 4, lidH, pupilR);
      ctx.fill();
    }
  }, []);

  const animateLid = useCallback(
    (targetL: number, targetR: number, duration: number, delayR: number, onDone?: () => void) => {
      const startL = lidRef.current.left;
      const startR = lidRef.current.right;
      const t0 = performance.now();

      const step = (t: number) => {
        const elapsed = t - t0;
        const progressL = Math.min(elapsed / duration, 1);
        const easedL = progressL < 0.5 ? 2 * progressL * progressL : -1 + (4 - 2 * progressL) * progressL;
        lidRef.current.left = startL + (targetL - startL) * easedL;

        const progressR = Math.min(Math.max(elapsed - delayR, 0) / duration, 1);
        const easedR = progressR < 0.5 ? 2 * progressR * progressR : -1 + (4 - 2 * progressR) * progressR;
        lidRef.current.right = startR + (targetR - startR) * easedR;

        if (progressL < 1 || progressR < 1) {
          requestAnimationFrame(step);
        } else if (onDone) {
          onDone();
        }
      };

      requestAnimationFrame(step);
    },
    []
  );

  const blink = useCallback(() => {
    animateLid(1, 1, 90, 30, () => {
      setTimeout(() => animateLid(0, 0, 120, 30), 60);
    });
  }, [animateLid]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = Math.max(
        -1,
        Math.min(1, (e.clientX - window.innerWidth / 2) / (window.innerWidth * 0.5))
      );
      mouseRef.current.y = Math.max(
        -1,
        Math.min(1, (e.clientY - window.innerHeight / 2) / (window.innerHeight * 0.5))
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const loop = () => {
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.08;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.08;
      drawBuddy();
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawBuddy]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const autoBlink = () => {
      blink();
      const nextBlink = 2500 + Math.random() * 2000;
      timeoutId = setTimeout(autoBlink, nextBlink);
    };

    timeoutId = setTimeout(autoBlink, 1500);
    return () => clearTimeout(timeoutId);
  }, [blink]);

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
