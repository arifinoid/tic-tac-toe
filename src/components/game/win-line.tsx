"use client";

import { lineGeometry } from "@/lib/game/engine";
import type { WinLine } from "@/lib/game/types";

/**
 * Strike-through overlay for the winning triple. Geometry comes from the pure
 * engine so the line always connects the real cell centres.
 */
export function WinLineOverlay({ line }: { line: WinLine }) {
  const geometry = lineGeometry(line);

  return (
    <svg
      data-testid="win-line"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <line
        x1={geometry.x1}
        y1={geometry.y1}
        x2={geometry.x2}
        y2={geometry.y2}
        pathLength={1}
        className="win-line stroke-accent"
        strokeWidth={2.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
