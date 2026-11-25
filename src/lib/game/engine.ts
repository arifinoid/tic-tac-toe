import type { Board, GameStatus, Player, WinLine } from "./types";

export const BOARD_LENGTH = 9;
export const BOARD_SIZE = 3;

/** Every three-in-a-row: three rows, three columns, two diagonals. */
export const WIN_LINES: readonly WinLine[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export function createEmptyBoard(): Board {
  return Array<Player | null>(BOARD_LENGTH).fill(null);
}

export function opponent(player: Player): Player {
  return player === "X" ? "O" : "X";
}

export function isLegalMove(board: Board, index: number): boolean {
  return (
    Number.isInteger(index) &&
    index >= 0 &&
    index < BOARD_LENGTH &&
    board[index] === null
  );
}

/** Returns a new board; never mutates the input. Throws on an illegal move. */
export function applyMove(board: Board, index: number, player: Player): Board {
  if (!isLegalMove(board, index)) {
    throw new Error(`Illegal move: index ${index} is not empty`);
  }
  const next = [...board];
  next[index] = player;
  return next;
}

/** Returns the winner and the winning line, or null. */
export function getWinner(board: Board): { winner: Player; line: WinLine } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const value = board[a];
    if (value !== null && value === board[b] && value === board[c]) {
      return { winner: value, line };
    }
  }
  return null;
}

export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

export function legalMoves(board: Board): number[] {
  const moves: number[] = [];
  for (let index = 0; index < board.length; index += 1) {
    if (board[index] === null) moves.push(index);
  }
  return moves;
}

/**
 * Winner takes precedence over a full board: a winning move made on the last
 * empty cell is a win, not a draw.
 */
export function evaluate(board: Board): {
  status: GameStatus;
  winner: Player | null;
  winLine: WinLine | null;
} {
  const result = getWinner(board);
  if (result) {
    return { status: "won", winner: result.winner, winLine: result.line };
  }
  if (isBoardFull(board)) {
    return { status: "draw", winner: null, winLine: null };
  }
  return { status: "playing", winner: null, winLine: null };
}

/**
 * Winning-line geometry in a 0..100 viewBox coordinate space. Cell centres sit
 * at 16.67 / 50 / 83.33; the segment is extended past both ends so the stroke
 * bleeds slightly beyond the outer cells. Single source of truth for the
 * win-line overlay.
 */
export function lineGeometry(line: WinLine): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
} {
  const centre = (index: number): { x: number; y: number } => ({
    x: ((index % BOARD_SIZE) + 0.5) * (100 / BOARD_SIZE),
    y: (Math.floor(index / BOARD_SIZE) + 0.5) * (100 / BOARD_SIZE),
  });

  const start = centre(line[0]);
  const end = centre(line[2]);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy) || 1;
  const extend = 12;
  const ux = dx / length;
  const uy = dy / length;

  return {
    x1: start.x - ux * extend,
    y1: start.y - uy * extend,
    x2: end.x + ux * extend,
    y2: end.y + uy * extend,
  };
}
