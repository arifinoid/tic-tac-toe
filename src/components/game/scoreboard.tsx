"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Score } from "@/lib/game/score";

interface ScoreboardProps {
  score: Score;
  hydrated: boolean;
}

function Stat({
  label,
  value,
  testId,
  className,
}: {
  label: string;
  value: string;
  testId: string;
  className?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <span className="text-[0.65rem] font-medium tracking-[0.2em] text-ink-faint uppercase">
        {label}
      </span>
      <span
        data-testid={testId}
        className={cn("font-display text-3xl leading-none tabular-nums", className)}
      >
        {value}
      </span>
    </div>
  );
}

export function Scoreboard({ score, hydrated }: ScoreboardProps) {
  const value = (count: number) => (hydrated ? String(count) : "—");

  return (
    <Card size="sm" className="border-line bg-paper-raised/80">
      <CardContent className="flex items-stretch gap-3 py-3">
        <Stat
          label="X wins"
          value={value(score.x)}
          testId="score-x"
          className="text-ink"
        />
        <Separator orientation="vertical" className="bg-line" />
        <Stat
          label="Draws"
          value={value(score.draws)}
          testId="score-draws"
          className="text-ink-soft"
        />
        <Separator orientation="vertical" className="bg-line" />
        <Stat
          label="O wins"
          value={value(score.o)}
          testId="score-o"
          className="text-accent"
        />
      </CardContent>
    </Card>
  );
}
