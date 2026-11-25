import { applyMove, createEmptyBoard, evaluate, isLegalMove } from "./engine";
import type { Board, GameStatus, Player, WinLine } from "./types";

export interface GameState {
  board: Board;
  turn: Player;
  status: GameStatus;
  winner: Player | null;
  winLine: WinLine | null;
  moveCount: number;
  lastMove: number | null;
  /** Increments on every reset; lets callers score a round exactly once. */
  roundId: number;
  startingPlayer: Player;
}

export type GameAction =
  | { type: "PLAY"; index: number }
  | { type: "RESET"; startingPlayer?: Player };

export const initialGameState: GameState = {
  board: createEmptyBoard(),
  turn: "X",
  status: "playing",
  winner: null,
  winLine: null,
  moveCount: 0,
  lastMove: null,
  roundId: 1,
  startingPlayer: "X",
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "PLAY": {
      if (state.status !== "playing") return state;
      if (!isLegalMove(state.board, action.index)) return state;

      const board = applyMove(state.board, action.index, state.turn);
      const result = evaluate(board);

      return {
        ...state,
        board,
        turn: state.turn === "X" ? "O" : "X",
        status: result.status,
        winner: result.winner,
        winLine: result.winLine,
        moveCount: state.moveCount + 1,
        lastMove: action.index,
      };
    }

    case "RESET": {
      const roundId = state.roundId + 1;
      // Alternate who opens so neither player keeps the first-move advantage.
      const startingPlayer =
        action.startingPlayer ?? (roundId % 2 === 1 ? "X" : "O");

      return {
        ...initialGameState,
        board: createEmptyBoard(),
        roundId,
        startingPlayer,
        turn: startingPlayer,
      };
    }

    default:
      return state;
  }
}
