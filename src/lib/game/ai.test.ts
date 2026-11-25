import { describe, expect, it } from "vitest";
import {
  applyMove,
  createEmptyBoard,
  getWinner,
  isBoardFull,
  legalMoves,
  opponent,
} from "./engine";
import { chooseMove, findBestMove } from "./ai";
import type { Board, Player } from "./types";

const deterministic = () => 0.5;

describe("findBestMove", () => {
  it("takes an immediate winning move", () => {
    const board = createEmptyBoard();
    board[0] = "X";
    board[1] = "X";
    board[3] = "O";
    board[4] = "O";
    expect(findBestMove(board, "X", deterministic)).toBe(2);
  });

  it("blocks an immediate opponent threat", () => {
    const board = createEmptyBoard();
    board[0] = "O";
    board[1] = "O";
    board[4] = "X";
    board[8] = "X";
    expect(findBestMove(board, "X", deterministic)).toBe(2);
  });

  it("never loses from any opening move under perfect play", () => {
    for (let opening = 0; opening < 9; opening += 1) {
      let board = createEmptyBoard();
      board = applyMove(board, opening, "O");
      let current: Player = "X";

      while (getWinner(board) === null && !isBoardFull(board)) {
        board = applyMove(board, findBestMove(board, current, deterministic), current);
        current = opponent(current);
      }

      expect(getWinner(board)?.winner, `opening ${opening}`).not.toBe("O");
    }
  });
});

describe("chooseMove", () => {
  it("returns a legal move on a fresh board for every difficulty", () => {
    const board = createEmptyBoard();
    for (const difficulty of ["easy", "medium", "hard"] as const) {
      expect(legalMoves(board)).toContain(chooseMove(board, "X", difficulty, deterministic));
    }
  });

  it("returns a legal move on a near-full board", () => {
    const board: Board = ["X", "O", "X", "O", "O", "X", "X", "O", null];
    for (const difficulty of ["easy", "medium", "hard"] as const) {
      expect(chooseMove(board, "O", difficulty, deterministic)).toBe(8);
    }
  });

  it("easy plays the first legal move when rng is 0", () => {
    const board = createEmptyBoard();
    expect(chooseMove(board, "X", "easy", () => 0)).toBe(0);
  });

  it("medium takes the random branch when rng is below the threshold", () => {
    const board = createEmptyBoard();
    // rng() === 0 triggers the 30% random branch, then picks moves[0].
    expect(chooseMove(board, "X", "medium", () => 0)).toBe(0);
  });
});
