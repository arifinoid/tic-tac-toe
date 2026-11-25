import { describe, expect, it } from "vitest";
import { gameReducer, initialGameState } from "./reducer";
import { emptyScore, recordResult } from "./score";

describe("gameReducer", () => {
  it("alternates turns and tracks the last move", () => {
    let state = gameReducer(initialGameState, { type: "PLAY", index: 0 });
    expect(state.board[0]).toBe("X");
    expect(state.turn).toBe("O");
    expect(state.lastMove).toBe(0);
    expect(state.moveCount).toBe(1);

    state = gameReducer(state, { type: "PLAY", index: 4 });
    expect(state.board[4]).toBe("O");
    expect(state.turn).toBe("X");
    expect(state.moveCount).toBe(2);
  });

  it("ignores a move on an occupied cell", () => {
    const first = gameReducer(initialGameState, { type: "PLAY", index: 0 });
    const second = gameReducer(first, { type: "PLAY", index: 0 });
    expect(second).toBe(first);
  });

  it("ignores moves after the game is over", () => {
    let state = initialGameState;
    for (const [index, player] of [
      [0, "X"],
      [3, "O"],
      [1, "X"],
      [4, "O"],
      [2, "X"],
    ] as const) {
      state = gameReducer(state, { type: "PLAY", index });
      expect(state.turn).toBe(player === "X" ? "O" : "X");
    }
    expect(state.status).toBe("won");
    expect(state.winner).toBe("X");
    expect(state.winLine).toEqual([0, 1, 2]);

    const after = gameReducer(state, { type: "PLAY", index: 5 });
    expect(after).toBe(state);
  });

  it("RESET clears the board, flips the starter and increments roundId", () => {
    const played = gameReducer(initialGameState, { type: "PLAY", index: 0 });
    const reset = gameReducer(played, { type: "RESET" });

    expect(reset.board.every((cell) => cell === null)).toBe(true);
    expect(reset.turn).toBe("O");
    expect(reset.startingPlayer).toBe("O");
    expect(reset.roundId).toBe(2);
    expect(reset.status).toBe("playing");
    expect(reset.lastMove).toBeNull();
  });

  it("RESET honours an explicit starting player", () => {
    const reset = gameReducer(initialGameState, {
      type: "RESET",
      startingPlayer: "O",
    });
    expect(reset.turn).toBe("O");
  });
});

describe("recordResult", () => {
  it("increments the matching counter once and stays immutable", () => {
    const base = emptyScore;
    const xWins = recordResult(base, "X");
    expect(xWins).toEqual({ x: 1, o: 0, draws: 0 });
    expect(base).toEqual({ x: 0, o: 0, draws: 0 });

    expect(recordResult(xWins, "O")).toEqual({ x: 1, o: 1, draws: 0 });
    expect(recordResult(xWins, null)).toEqual({ x: 1, o: 0, draws: 1 });
  });
});
