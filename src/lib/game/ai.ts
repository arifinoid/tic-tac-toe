import { applyMove, getWinner, isBoardFull, legalMoves, opponent } from "./engine";
import type { Board, Difficulty, Player } from "./types";

export type Rng = () => number;

/**
 * Minimax with alpha-beta pruning. A win scores 10 - depth and a loss
 * depth - 10, so the AI prefers faster wins and slower losses.
 */
function minimax(
  board: Board,
  current: Player,
  aiPlayer: Player,
  depth: number,
  alpha: number,
  beta: number,
): number {
  const result = getWinner(board);
  if (result) return result.winner === aiPlayer ? 10 - depth : depth - 10;
  if (isBoardFull(board)) return 0;

  const maximizing = current === aiPlayer;
  let best = maximizing ? -Infinity : Infinity;

  for (const move of legalMoves(board)) {
    const score = minimax(
      applyMove(board, move, current),
      opponent(current),
      aiPlayer,
      depth + 1,
      alpha,
      beta,
    );
    if (maximizing) {
      if (score > best) best = score;
      if (score > alpha) alpha = score;
    } else {
      if (score < best) best = score;
      if (score < beta) beta = score;
    }
    if (beta <= alpha) break;
  }

  return best;
}

/** Perfect play: the move with the best minimax score, ties broken by `rng`. */
export function findBestMove(board: Board, player: Player, rng: Rng = Math.random): number {
  const moves = legalMoves(board);
  if (moves.length === 0) throw new Error("No legal moves");

  let bestScore = -Infinity;
  let best: number[] = [];

  for (const move of moves) {
    const score = minimax(
      applyMove(board, move, player),
      opponent(player),
      player,
      1,
      -Infinity,
      Infinity,
    );
    if (score > bestScore) {
      bestScore = score;
      best = [move];
    } else if (score === bestScore) {
      best.push(move);
    }
  }

  return best[Math.floor(rng() * best.length)]!;
}

/**
 * Difficulty select. `rng` is injected so tests can be deterministic.
 * - easy: always a random legal move
 * - medium: 30% random, otherwise best move
 * - hard: always best move (unbeatable)
 */
export function chooseMove(
  board: Board,
  player: Player,
  difficulty: Difficulty = "hard",
  rng: Rng = Math.random,
): number {
  const moves = legalMoves(board);
  if (moves.length === 0) throw new Error("No legal moves");

  if (difficulty === "easy") {
    return moves[Math.floor(rng() * moves.length)]!;
  }
  if (difficulty === "medium" && rng() < 0.3) {
    return moves[Math.floor(rng() * moves.length)]!;
  }
  return findBestMove(board, player, rng);
}
