"use client";

interface BuddyLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function BuddyLogo({ size = 40, className = "", showText = true }: BuddyLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo :b style - yeux en haut, bouche en bas */}
      <div
        className="relative rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden"
        style={{ width: size, height: size }}
      >
        <svg
          width={size * 0.7}
          height={size * 0.7}
          viewBox="0 0 28 28"
          fill="none"
        >
          {/* Yeux - deux points en haut */}
          <circle cx="9" cy="8" r="3" fill="white" />
          <circle cx="19" cy="8" r="3" fill="white" />

          {/* Bouche - le "b" en bas (langue qui sort) */}
          <path
            d="M8 16 L8 24 M8 18 Q8 14 14 14 Q20 14 20 19 Q20 24 14 24 L8 24"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>

        {/* Effet de brillance */}
        <div
          className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl"
        />
      </div>

      {/* Texte "Buddy" */}
      {showText && (
        <span className="text-xl font-black tracking-tight">
          Buddy
        </span>
      )}
    </div>
  );
}

// Version avec le :b en texte rotaté
export function BuddyLogoText({ size = 40, className = "", showText = true }: BuddyLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden"
        style={{ width: size, height: size }}
      >
        {/* :b tourné de 90° pour avoir : en haut et b en bas */}
        <span
          className="font-black text-white select-none"
          style={{
            fontSize: size * 0.5,
            transform: "rotate(-90deg)",
            letterSpacing: "-0.1em",
          }}
        >
          :b
        </span>

        {/* Effet de brillance */}
        <div
          className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl"
        />
      </div>

      {showText && (
        <span className="text-xl font-black tracking-tight">
          Buddy
        </span>
      )}
    </div>
  );
}

// Version minimaliste avec juste des formes
export function BuddyLogoMinimal({ size = 40, className = "", showText = true }: BuddyLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative rounded-xl bg-gradient-to-br from-primary to-accent flex flex-col items-center justify-center gap-1 overflow-hidden"
        style={{ width: size, height: size, padding: size * 0.15 }}
      >
        {/* Yeux */}
        <div className="flex gap-2">
          <div
            className="rounded-full bg-white"
            style={{ width: size * 0.18, height: size * 0.18 }}
          />
          <div
            className="rounded-full bg-white"
            style={{ width: size * 0.18, height: size * 0.18 }}
          />
        </div>

        {/* Bouche style "b" - sourire avec langue */}
        <div
          className="bg-white rounded-full"
          style={{
            width: size * 0.5,
            height: size * 0.25,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            marginTop: size * 0.05,
          }}
        />

        {/* Effet de brillance */}
        <div
          className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl"
        />
      </div>

      {showText && (
        <span className="text-xl font-black tracking-tight">
          Buddy
        </span>
      )}
    </div>
  );
}
