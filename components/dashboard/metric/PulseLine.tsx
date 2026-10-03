"use client";

import { useState, useEffect } from "react";
import type { BearingRisk } from "@/lib/database/type";

interface PulseLineProps {
  color: string;
  risk: BearingRisk;
  muted: boolean;
}

const PATHS: Record<BearingRisk, string> = {
  HIGH:
    "M0,25 L30,25 L35,25 L40,5 L45,45 L50,10 L55,40 L60,25 L65,25 L100,25 L130,25 L135,25 L140,5 L145,45 L150,10 L155,40 L160,25 L165,25 L200,25 L230,25 L235,25 L240,5 L245,45 L250,10 L255,40 L260,25 L265,25 L300,25 L330,25 L335,25 L340,5 L345,45 L350,10 L355,40 L360,25 L365,25 L400,25",
  WARNING:
    "M0,25 L50,25 L55,25 L60,15 L65,35 L70,20 L75,30 L80,25 L130,25 L180,25 L185,25 L190,15 L195,35 L200,20 L205,30 L210,25 L260,25 L310,25 L315,25 L320,15 L325,35 L330,20 L335,30 L340,25 L400,25",
  NORMAL:
    "M0,25 L80,25 L85,25 L90,18 L95,32 L100,25 L180,25 L185,25 L190,18 L195,32 L200,25 L280,25 L285,25 L290,18 L295,32 L300,25 L400,25",
};

const SPEED: Record<BearingRisk, number> = { HIGH: 3, WARNING: 1.8, NORMAL: 1 };

export default function PulseLine({ color, risk, muted }: PulseLineProps):  React.JSX.Element {
  const [offset, setOffset] = useState<number>(0);
  const speed = SPEED[risk];

  useEffect(() => {
    let frame: number;
    const animate = (): void => {
      setOffset((p) => (p + speed) % 400);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [speed]);

  return (
    <svg
      width="100%"
      height="40"
      viewBox="0 0 200 50"
      preserveAspectRatio="none"
      style={{ overflow: "hidden", opacity: muted ? 0.3 : 0.6 }}
    >
      <path
        d={PATHS[risk]}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        style={{ transform: `translateX(-${offset % 200}px)` }}
      />
    </svg>
  );
}