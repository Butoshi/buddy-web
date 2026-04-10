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

    // Left pupil size (smaller hole of B)
    const leftPupilW = W * 0.18;
    const leftPupilH = H * 0.22;
    const leftPupilR = Math.min(leftPupilW, leftPupilH) * 0.4;

    // Right pupil size (bigger hole of B) - slightly larger
    const rightPupilW = W * 0.20;
    const rightPupilH = H * 0.24;
    const rightPupilR = Math.min(rightPupilW, rightPupilH) * 0.4;

    // Left eye position (smaller hole of B)
    const leftEyeX = W * 0.30 + pdx;
    const leftEyeY = H * 0.48 + pdy;

    // Right eye position (bigger hole of B)
    const rightEyeX = W * 0.68 + pdx;
    const rightEyeY = H * 0.48 + pdy;

    // Draw pupils (dark blue)
    ctx.fillStyle = pupilColor;

    // Left pupil
    if (lidRef.current.left < 0.9) {
      ctx.beginPath();
      ctx.roundRect(leftEyeX - leftPupilW/2, leftEyeY - leftPupilH/2, leftPupilW, leftPupilH, leftPupilR);
      ctx.fill();
    }

    // Right pupil
    if (lidRef.current.right < 0.9) {
      ctx.beginPath();
      ctx.roundRect(rightEyeX - rightPupilW/2, rightEyeY - rightPupilH/2, rightPupilW, rightPupilH, rightPupilR);
      ctx.fill();
    }

    // Eyelids (for blink - covers the pupils with white)
    if (lidRef.current.left > 0) {
      ctx.fillStyle = lidColor;
      const lidH = leftPupilH * 1.5 * lidRef.current.left;
      ctx.beginPath();
      ctx.roundRect(leftEyeX - leftPupilW/2 - 2, leftEyeY - leftPupilH/2 - 2, leftPupilW + 4, lidH, leftPupilR);
      ctx.fill();
    }

    if (lidRef.current.right > 0) {
      ctx.fillStyle = lidColor;
      const lidH = rightPupilH * 1.5 * lidRef.current.right;
      ctx.beginPath();
      ctx.roundRect(rightEyeX - rightPupilW/2 - 2, rightEyeY - rightPupilH/2 - 2, rightPupilW + 4, lidH, rightPupilR);
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
