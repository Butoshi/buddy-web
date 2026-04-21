'use client';

import { useCallback, useEffect, useRef } from 'react';
import styles from './BuddyLogo.module.css';

type BuddyLogoProps = {
  /** Width / height in px (or any CSS size string). Default: 300. */
  size?: number | string;
  /** Whether the pupils follow the cursor. Default: true. */
  trackMouse?: boolean;
  /** Extra class applied to the wrapper. */
  className?: string;
  /** Path to the logo png. Default: /buddy-logo.png (put the file in public/). */
  src?: string;
  /** Show the breathing animation. Default: true. */
  breathe?: boolean;
};

export default function BuddyLogo({
  size = 300,
  trackMouse = true,
  className = '',
  src = '/buddy-logo.png',
  breathe = true,
}: BuddyLogoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const leftTrackRef = useRef<HTMLDivElement>(null);
  const rightTrackRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  const blink = useCallback(async () => {
    const wrap = wrapRef.current;
    if (!wrap || busyRef.current) return;
    busyRef.current = true;

    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    wrap.classList.add(styles.blinking);
    await wait(130);
    wrap.classList.remove(styles.blinking);
    await wait(110);

    // Occasional double-blink for a more organic feel
    if (Math.random() < 0.25) {
      await wait(110);
      wrap.classList.add(styles.blinking);
      await wait(110);
      wrap.classList.remove(styles.blinking);
    }

    busyRef.current = false;
  }, []);

  // Auto-blink loop
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const loop = () => {
      const delay = 2400 + Math.random() * 3600;
      timer = setTimeout(async () => {
        if (!active) return;
        await blink();
        if (active) loop();
      }, delay);
    };
    loop();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [blink]);

  // Mouse / touch tracking
  useEffect(() => {
    if (!trackMouse) return;

    const handleMove = (clientX: number, clientY: number) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const wrapRect = wrap.getBoundingClientRect();
      const maxOffset = wrapRect.width * 0.022;

      [leftTrackRef.current, rightTrackRef.current].forEach((track) => {
        if (!track) return;
        const r = track.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const sat = Math.min(dist / 180, 1);
        const off = maxOffset * sat;
        track.style.setProperty('--tx', `${((dx / dist) * off).toFixed(2)}px`);
        track.style.setProperty('--ty', `${((dy / dist) * off).toFixed(2)}px`);
      });
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onLeave = () => {
      [leftTrackRef.current, rightTrackRef.current].forEach((t) => {
        if (!t) return;
        t.style.setProperty('--tx', '0px');
        t.style.setProperty('--ty', '0px');
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, [trackMouse]);

  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      ref={wrapRef}
      onClick={blink}
      role="img"
      aria-label="Buddy"
      className={[
        styles.logo,
        breathe ? styles.breathe : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ width: sizeValue, height: sizeValue }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className={styles.base}
      />

      <div className={styles.eyeBox} style={{ left: '30.7%', top: '41.2%' }}>
        <div className={styles.eyeWhite} />
        <div ref={leftTrackRef} className={styles.eyeTrack}>
          <div className={styles.eye} />
        </div>
      </div>

      <div className={styles.eyeBox} style={{ left: '55.5%', top: '41.2%' }}>
        <div className={styles.eyeWhite} />
        <div ref={rightTrackRef} className={styles.eyeTrack}>
          <div className={styles.eye} />
        </div>
      </div>
    </div>
  );
}
