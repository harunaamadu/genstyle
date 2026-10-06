"use client";

import { siteConfig } from "@/data/site-config";
import { motion, type Easing } from "framer-motion";

const SHADOW = "oklch(0.421 0.095 57.708)";
const INK = "oklch(0.852 0.199 91.936)";

const STROKE = 14;
const BALL_R = 7;

const DROP = 0.55; // Ball falls onto the first letter
const HOP = 0.34; // Time between letter landings
const DRAW = 0.55; // Stroke draw duration

type Point = {
  x: number;
  y: number;
};

type Letter = {
  id: string;
  paths: string[];
  start: Point;
};

// Monoline glyphs on a shared baseline (y=260)
// x-height 200, cap height 140
const LETTERS: Letter[] = [
  {
    id: "G",
    start: { x: 172.4, y: 157.6 },
    paths: [
      "M172.4,157.6 A60,60 0 1 0 190,200 L148,200",
      // "M130 205q19-9 21-35 3-45-49-11-51 34-58 75-9 49 46 37 62-19 77-73-14 97-64 159-58 61-52 6 4-35 147-112",
    ],
  },
  {
    id: "e1",
    start: { x: 218, y: 230 },
    paths: [
      "M218,230 H275 A30,30 0 1 0 266.2,251.2",
      // "M198 251q11-4 23-4 14-3 1-14-16-12-25 21-14 48 68-3"
    ],
  },
  {
    id: "n",
    start: { x: 300, y: 200 },
    paths: [
      "M300,200 V260",
      "M300,228 A25,25 0 0 1 350,228 V260",
      // "M273 237q-18 31-8 55 8-21 25-41 14-15 6 17-9 36 59-14",
    ],
  },
  {
    id: "S",
    start: { x: 441, y: 155 },
    paths: ["M441,155 A30,30 0 1 0 415,200 A30,30 0 1 1 389,245"],
  },
  {
    id: "t",
    start: { x: 490, y: 150 },
    paths: ["M490,150 V244 Q490,260 510,258", "M472,200 H514"],
  },
  {
    id: "y",
    start: { x: 535, y: 200 },
    paths: ["M535,200 V226 A22,22 0 0 0 579,226", "M580 200 580 300"],
  },
  {
    id: "l",
    start: { x: 615, y: 140 },
    paths: ["M615,140 V244 Q615,260 635,258"],
  },
  {
    id: "e2",
    start: { x: 658, y: 230 },
    paths: ["M658,230 H715 A30,30 0 1 0 706.2,251.2"],
  },
];

const END_DOT: Point = {
  x: 742,
  y: 260 - BALL_R,
};

const LANDINGS: Point[] = [...LETTERS.map((letter) => letter.start), END_DOT];

const landingTime = (index: number) => DROP + index * HOP;

const TOTAL = landingTime(LANDINGS.length - 1);

function buildBallKeyframes() {
  const first = LANDINGS[0];

  const cx = [first.x, first.x];
  const cy = [0, first.y];

  const times = [0, DROP / TOTAL];

  const yEase: Easing[] = ["easeIn"];

  LANDINGS.slice(1).forEach((to, idx) => {
    const from = LANDINGS[idx];
    const tLand = landingTime(idx + 1);

    cx.push((from.x + to.x) / 2, to.x);

    cy.push(Math.min(from.y, to.y) - 60, to.y);

    times.push((tLand - HOP / 2) / TOTAL, tLand / TOTAL);

    yEase.push("easeOut", "easeIn");
  });

  return {
    cx,
    cy,
    times,
    yEase,
  };
}

const BALL = buildBallKeyframes();

const BURST_ANGLES = [-150, -90, -30];

type SpeedBurstProps = {
  at: Point;
  delay: number;
};

function SpeedBurst({ at, delay }: SpeedBurstProps) {
  return (
    <>
      {BURST_ANGLES.map((deg) => {
        const rad = (deg * Math.PI) / 180;

        return (
          <motion.line
            key={deg}
            x1={at.x + Math.cos(rad) * 14}
            y1={at.y + Math.sin(rad) * 14}
            x2={at.x + Math.cos(rad) * 30}
            y2={at.y + Math.sin(rad) * 30}
            stroke={INK}
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={{
              pathLength: 0,
              pathOffset: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: [0, 1, 0],
              pathOffset: [0, 0, 1],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.35,
              delay,
              ease: "easeOut",
            }}
          />
        );
      })}
    </>
  );
}

type LetterStrokeProps = {
  letter: Letter;
  index: number;
  width?: number | string;
};

function LetterStroke({ letter, index, width }: LetterStrokeProps) {
  const start = landingTime(index);

  return (
    <motion.g
      style={{
        transformBox: "fill-box",
        transformOrigin: "50% 100%",
        width,
        willChange: "opacity",
      }}
      initial={{
        scale: 0.85,
      }}
      animate={{
        scale: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 9,
        delay: start,
      }}
    >
      {/*
        Shadow-colored strokes lead,
        white strokes chase them.

        All shadow layers render first so they
        never cover another stroke's white layer.
      */}
      {[SHADOW, INK].map((color, layer) =>
        letter.paths.map((d, j) => {
          const delay = start + j * 0.12 + layer * 0.1;

          return (
            <motion.path
              key={`${letter.id}-${j}-${color}`}
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeLinejoin="bevel"
              initial={{
                pathLength: 0,
                opacity: 0,
              }}
              animate={{
                pathLength: 1,
                opacity: 1,
              }}
              transition={{
                pathLength: {
                  duration: DRAW,
                  delay,
                  ease: "easeOut",
                },
                opacity: {
                  duration: 0.01,
                  delay,
                },
              }}
            />
          );
        }),
      )}
    </motion.g>
  );
}

const VIEW_BOX = "30 30 740 370";

// Tight crop of the finished wordmark,
// used for the compact static logo.
const STATIC_VIEW_BOX = "80 85 680 230";

type GenStyleLogoProps = {
  className?: string;

  /**
   * Play the bouncing intro once.
   * When false, renders the finished logo.
   */
  animated?: boolean;

  /**
   * Called once the animated intro has finished.
   */
  onComplete?: () => void;
};

type StaticLogoProps = {
  className?: string;
};

function StaticLogo({ className }: StaticLogoProps) {
  return (
    <svg
      viewBox={STATIC_VIEW_BOX}
      className={className}
      role="img"
      aria-label={`${siteConfig().name ?? "GenStyle"}`}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {LETTERS.flatMap((letter) =>
          letter.paths.map((d, j) => <path key={`${letter.id}-${j}`} d={d} />),
        )}
      </g>

      <circle cx={END_DOT.x} cy={END_DOT.y} r={BALL_R} fill="currentColor" />
    </svg>
  );
}

export default function GenStyleLogo({
  className,
  animated = true,
  onComplete,
}: GenStyleLogoProps) {
  if (!animated) {
    return <StaticLogo className={className} />;
  }

  return (
    <svg
      viewBox={VIEW_BOX}
      className={className}
      role="img"
      aria-label={`${siteConfig().name ?? "GenStyle"}`}
    >
      {LETTERS.map((letter, i) => (
        <LetterStroke key={letter.id} letter={letter} index={i} />
      ))}

      {LANDINGS.map((point, i) => (
        <SpeedBurst key={i} at={point} delay={landingTime(i) - 0.03} />
      ))}

      <motion.circle
        r={BALL_R}
        fill={INK}
        initial={{
          cx: BALL.cx[0],
          cy: BALL.cy[0],
        }}
        animate={{
          cx: BALL.cx,
          cy: BALL.cy,
        }}
        transition={{
          cx: {
            duration: TOTAL,
            times: BALL.times,
            ease: "linear",
          },
          cy: {
            duration: TOTAL,
            times: BALL.times,
            ease: BALL.yEase,
          },
        }}
        onAnimationComplete={onComplete}
      />
    </svg>
  );
}
