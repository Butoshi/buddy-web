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

  // Colors - dark theme with contrast
  const strokeColor = "#06b6d4"; // cyan outline
  const pupilColor = "#ffffff";  // white pupils (matches "Buddy" text)
  const lidColor = "#06b6d4";    // cyan eyelids
  const bgColor = "#0d1f3c";     // dark blue background for contrast

  const drawBuddy = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const sx = W / 130;
    const sy = H / 115;
    const px = (x: number) => x * sx;
    const py = (y: number) => y * sy;

    ctx.clearRect(0, 0, W, H);

    const maxDX = px(7);
    const maxDY = py(6);
    const pdx = smoothRef.current.x * maxDX;
    const pdy = smoothRef.current.y * maxDY;

    const drawArch = (x1: number, topX: number, w: number, lidFrac: number) => {
      ctx.save();

      // Arch shape
      ctx.beginPath();
      ctx.moveTo(px(x1), py(95));
      ctx.lineTo(px(x1), py(48));
      ctx.quadraticCurveTo(px(x1), py(8), px(topX), py(8));
      ctx.quadraticCurveTo(px(x1 + w), py(8), px(x1 + w), py(48));
      ctx.lineTo(px(x1 + w), py(95));
      ctx.closePath();
      ctx.fillStyle = bgColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = px(10);
      ctx.lineJoin = "round";
      ctx.stroke();

      // Clip interior
      ctx.beginPath();
      ctx.moveTo(px(x1 + 5), py(95));
      ctx.lineTo(px(x1 + 5), py(48));
      ctx.quadraticCurveTo(px(x1 + 5), py(13), px(topX), py(13));
      ctx.quadraticCurveTo(px(x1 + w - 5), py(13), px(x1 + w - 5), py(48));
      ctx.lineTo(px(x1 + w - 5), py(95));
      ctx.closePath();
      ctx.clip();

      // Pupil - follows mouse
      const pux = px(x1 + w / 2 - 9) + pdx;
      const puy = py(52) + pdy;
      const puw = px(18);
      const puh = py(22);
      const r = px(6);
      ctx.beginPath();
      ctx.roundRect(pux, puy, puw, puh, r);
      ctx.fillStyle = pupilColor;
      ctx.fill();

      // Eyelid
      if (lidFrac > 0) {
        ctx.fillStyle = lidColor;
        ctx.fillRect(px(x1 + 5), py(13), px(w - 10), py(82) * lidFrac);
      }

      ctx.restore();
    };

    drawArch(8, 38, 60, lidRef.current.left);
    drawArch(62, 92, 60, lidRef.current.right);

    // Bottom bar - cyan to match outline
    ctx.beginPath();
    ctx.roundRect(px(3), py(88), px(124), py(12), px(3));
    ctx.fillStyle = strokeColor;
    ctx.fill();
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
    animateLid(1, 1, 90, 55, () => {
      setTimeout(() => animateLid(0, 0, 140, 55), 80);
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
      const nextBlink = 3000 + Math.random() * 2500;
      timeoutId = setTimeout(autoBlink, nextBlink);
    };

    timeoutId = setTimeout(autoBlink, 2000);
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
