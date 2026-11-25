export type Player = "X" | "O";

export type CellValue = Player | null;

/** Row-major 3x3 board; index = row * 3 + column. */
export type Board = CellValue[];

export type WinLine = readonly [number, number, number];

export type GameStatus = "playing" | "won" | "draw";

export type Difficulty = "easy" | "medium" | "hard";

export type GameMode = "local" | "ai";
