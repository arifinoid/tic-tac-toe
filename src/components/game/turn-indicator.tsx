"use client";

import { cn } from "@/lib/utils";
import type { GameMode, GameStatus, Player } from "@/lib/game/types";
import { Mark } from "./marks";

interface TurnIndicatorProps {
  status: GameStatus;
  turn: Player;
  mode: GameMode;
  aiThinking: boolean;
}

export function TurnIndicator({
  status,
  turn,
  mode,
  aiThinking,
}: TurnIndicatorProps) {
  if (status !== "playing") return null;

  const label =
    mode === "ai"
      ? aiThinking
        ? "The AI is thinking…"
        : "Your move"
      : `${turn} to move`;

  return (
    <div
      data-testid="turn-indicator"
      className="flex items-center justify-center gap-3 text-sm tracking-wide text-ink-soft"
    >
      <Mark
        player={turn}
        className={cn("h-5 w-5", turn === "X" ? "text-ink" : "text-accent")}
      />
      <span>{label}</span>
    </div>
  );
}
