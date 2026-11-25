"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { Difficulty, GameMode } from "@/lib/game/types";

interface ControlsProps {
  mode: GameMode;
  difficulty: Difficulty;
  soundOn: boolean;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onToggleSound: () => void;
  onNewGame: () => void;
  onResetScore: () => void;
}

interface SegmentProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  testIdPrefix: string;
  disabled?: boolean;
}

function Segment<T extends string>({
  options,
  value,
  onChange,
  testIdPrefix,
  disabled = false,
}: SegmentProps<T>) {
  return (
    <div
      role="group"
      className="inline-flex rounded-lg border border-line bg-paper-deep/60 p-0.5"
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            data-testid={`${testIdPrefix}-${option.value}`}
            aria-pressed={active}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-[7px] px-3 py-1.5 text-xs font-medium tracking-wide transition-colors duration-150",
              active
                ? "bg-ink text-paper shadow-sm"
                : "text-ink-soft hover:text-ink",
              disabled && "cursor-not-allowed opacity-40",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

const MODE_OPTIONS = [
  { value: "local", label: "Two players" },
  { value: "ai", label: "Vs AI" },
] as const;

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
] as const;

export function Controls({
  mode,
  difficulty,
  soundOn,
  onModeChange,
  onDifficultyChange,
  onToggleSound,
  onNewGame,
  onResetScore,
}: ControlsProps) {
  return (
    <Card className="border-line bg-paper-raised/80">
      <CardContent className="flex flex-col gap-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-medium tracking-[0.2em] text-ink-faint uppercase">
            Mode
          </span>
          <Segment
            options={MODE_OPTIONS}
            value={mode}
            onChange={onModeChange}
            testIdPrefix="mode"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <span
            className={cn(
              "text-xs font-medium tracking-[0.2em] uppercase",
              mode === "ai" ? "text-ink-faint" : "text-ink-faint/50",
            )}
          >
            Difficulty
          </span>
          <Segment
            options={DIFFICULTY_OPTIONS}
            value={difficulty}
            onChange={onDifficultyChange}
            testIdPrefix="difficulty"
            disabled={mode !== "ai"}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-medium tracking-[0.2em] text-ink-faint uppercase">
            Sound
          </span>
          <Switch
            data-testid="sound-toggle"
            checked={soundOn}
            onCheckedChange={() => onToggleSound()}
          />
        </div>

        <div className="mt-1 flex flex-col gap-2">
          <Button
            type="button"
            data-testid="new-game"
            onClick={onNewGame}
            className="w-full"
          >
            New game
          </Button>
          <Button
            type="button"
            variant="ghost"
            data-testid="reset-score"
            onClick={onResetScore}
            className="w-full text-ink-soft"
          >
            Reset score
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
