import type { Player } from "./types";

export interface Score {
  x: number;
  o: number;
  draws: number;
}

export const emptyScore: Score = { x: 0, o: 0, draws: 0 };

/** Returns a new score with the result applied once; never mutates. */
export function recordResult(score: Score, winner: Player | null): Score {
  if (winner === "X") return { ...score, x: score.x + 1 };
  if (winner === "O") return { ...score, o: score.o + 1 };
  return { ...score, draws: score.draws + 1 };
}
