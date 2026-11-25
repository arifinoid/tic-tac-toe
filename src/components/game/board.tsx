"use client";

import type { Board as BoardModel, GameStatus, WinLine } from "@/lib/game/types";
import { Cell } from "./cell";
import { WinLineOverlay } from "./win-line";

interface BoardProps {
  board: BoardModel;
  status: GameStatus;
  winLine: WinLine | null;
  interactive: boolean;
  onPlay: (index: number) => void;
}

export function Board({ board, status, winLine, interactive, onPlay }: BoardProps) {
  const disabled = status !== "playing" || !interactive;

  return (
    <div className="relative">
      <div
        data-testid="board"
        role="grid"
        aria-label="Tic-tac-toe board"
        className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line/70 shadow-[0_1px_0_rgba(26,23,18,0.05),0_16px_40px_-20px_rgba(26,23,18,0.35)]"
      >
        {board.map((value, index) => (
          <Cell
            key={index}
            index={index}
            value={value}
            disabled={disabled}
            isWinning={winLine?.includes(index) ?? false}
            onPlay={onPlay}
          />
        ))}
      </div>
      {winLine && <WinLineOverlay line={winLine} />}
    </div>
  );
}
