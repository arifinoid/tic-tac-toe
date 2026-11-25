import { describe, expect, it } from "vitest";
import {
  WIN_LINES,
  applyMove,
  createEmptyBoard,
  evaluate,
  getWinner,
  isBoardFull,
  isLegalMove,
  legalMoves,
  lineGeometry,
} from "./engine";
import type { Board, Player, WinLine } from "./types";

function boardWith(line: WinLine, player: Player): Board {
  const board = createEmptyBoard();
  for (const index of line) board[index] = player;
  return board;
}

describe("createEmptyBoard", () => {
  it("creates nine empty cells", () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(9);
    expect(board.every((cell) => cell === null)).toBe(true);
  });
});

describe("applyMove", () => {
  it("returns a new board and does not mutate the input", () => {
    const board = createEmptyBoard();
    const next = applyMove(board, 4, "X");
    expect(board[4]).toBeNull();
    expect(next).not.toBe(board);
    expect(next[4]).toBe("X");
  });

  it("throws on out-of-range and occupied cells", () => {
    const board = applyMove(createEmptyBoard(), 0, "X");
    expect(() => applyMove(board, -1, "O")).toThrow();
    expect(() => applyMove(board, 9, "O")).toThrow();
    expect(() => applyMove(board, 0, "O")).toThrow();
  });

  it("agrees with isLegalMove", () => {
    const board = applyMove(createEmptyBoard(), 3, "O");
    expect(isLegalMove(board, 3)).toBe(false);
    expect(isLegalMove(board, 4)).toBe(true);
  });
});

describe("getWinner", () => {
  it.each(WIN_LINES.map((line) => [line]))("detects a win on line %j", (line) => {
    const result = getWinner(boardWith(line, "X"));
    expect(result).not.toBeNull();
    expect(result?.winner).toBe("X");
    expect(result?.line).toEqual(line);
  });

  it("detects O wins", () => {
    expect(getWinner(boardWith([6, 7, 8], "O"))?.winner).toBe("O");
  });

  it("returns null when there is no winner", () => {
    expect(getWinner(createEmptyBoard())).toBeNull();
    const mixed = createEmptyBoard();
    mixed[0] = "X";
    mixed[1] = "O";
    mixed[2] = "X";
    expect(getWinner(mixed)).toBeNull();
  });
});

describe("evaluate", () => {
  it("reports a full board with a winner as a win, not a draw", () => {
    // X wins the main diagonal; the board is otherwise full.
    const board: Board = ["X", "O", "O", "O", "X", "O", "O", "O", "X"];
    expect(isBoardFull(board)).toBe(true);
    expect(evaluate(board)).toEqual({
      status: "won",
      winner: "X",
      winLine: [0, 4, 8],
    });
  });

  it("reports a full board without a winner as a draw", () => {
    // X O X / X O O / O X X
    const board: Board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
    expect(isBoardFull(board)).toBe(true);
    expect(evaluate(board)).toEqual({
      status: "draw",
      winner: null,
      winLine: null,
    });
  });

  it("reports a non-full board without a winner as playing", () => {
    expect(evaluate(createEmptyBoard())).toEqual({
      status: "playing",
      winner: null,
      winLine: null,
    });
  });
});

describe("legalMoves", () => {
  it("returns exactly the empty indices", () => {
    const board = createEmptyBoard();
    board[0] = "X";
    board[4] = "O";
    expect(legalMoves(board)).toEqual([1, 2, 3, 5, 6, 7, 8]);
  });
});

describe("lineGeometry", () => {
  it("maps a row to a horizontal segment through the cell centres", () => {
    const geo = lineGeometry([0, 1, 2]);
    expect(geo.y1).toBeCloseTo(100 / 6);
    expect(geo.y2).toBeCloseTo(100 / 6);
    expect(geo.x1).toBeLessThan(100 / 6);
    expect(geo.x2).toBeGreaterThan(83.33);
  });

  it("maps a column to a vertical segment", () => {
    const geo = lineGeometry([0, 3, 6]);
    expect(geo.x1).toBeCloseTo(100 / 6);
    expect(geo.x2).toBeCloseTo(100 / 6);
    expect(geo.y1).toBeLessThan(100 / 6);
    expect(geo.y2).toBeGreaterThan(83.33);
  });

  it("maps the diagonals symmetrically", () => {
    const main = lineGeometry([0, 4, 8]);
    expect(main.x1).toBeCloseTo(main.y1);
    expect(main.x2).toBeCloseTo(main.y2);
    expect(main.x1).toBeLessThan(main.x2);

    const anti = lineGeometry([2, 4, 6]);
    expect(anti.x1).toBeCloseTo(anti.y2);
    expect(anti.x2).toBeCloseTo(anti.y1);
  });
});
