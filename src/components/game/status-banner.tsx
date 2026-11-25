"use client";

import { cn } from "@/lib/utils";
import type { GameStatus, Player } from "@/lib/game/types";

interface StatusBannerProps {
  status: GameStatus;
  winner: Player | null;
}

export function StatusBanner({ status, winner }: StatusBannerProps) {
  let text = "";
  if (status === "won" && winner) text = `${winner} takes the round.`;
  if (status === "draw") text = "A hard-fought draw.";

  return (
    <div
      data-testid="status-banner"
      role="status"
      aria-live="polite"
      className={cn(
        "min-h-8 text-center font-display text-2xl tracking-tight",
        status === "won" && winner === "O" && "text-accent",
        status === "won" && winner === "X" && "text-ink",
        status === "draw" && "text-ink-soft",
      )}
    >
      {text}
    </div>
  );
}
