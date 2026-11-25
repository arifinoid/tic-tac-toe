"use client";

import { cn } from "@/lib/utils";
import type { CellValue } from "@/lib/game/types";
import { Mark } from "./marks";

interface CellProps {
  index: number;
  value: CellValue;
  disabled: boolean;
  isWinning: boolean;
  onPlay: (index: number) => void;
}

export function Cell({ index, value, disabled, isWinning, onPlay }: CellProps) {
  const row = Math.floor(index / 3) + 1;
  const column = (index % 3) + 1;
  const label = value
    ? `Row ${row}, column ${column}: ${value}`
    : `Row ${row}, column ${column}: empty`;

  return (
    <button
      type="button"
      data-testid={`cell-${index}`}
      aria-label={label}
      disabled={disabled}
      onClick={() => onPlay(index)}
      className={cn(
        "relative flex aspect-square items-center justify-center bg-paper-raised transition-colors duration-200",
        // Hover feedback only on playable cells; winning cells keep their
        // highlight (disabled:hover would otherwise out-rank it).
        !isWinning &&
          "hover:bg-paper-deep/70 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none disabled:cursor-default disabled:hover:bg-paper-raised",
        isWinning && "animate-cell-pulse bg-paper-deep/70 motion-reduce:animate-none",
      )}
    >
      {value && (
        <Mark
          player={value}
          className={cn(
            "h-3/5 w-3/5",
            value === "X" ? "-rotate-2 text-ink" : "rotate-1 text-accent",
          )}
        />
      )}
    </button>
  );
}
