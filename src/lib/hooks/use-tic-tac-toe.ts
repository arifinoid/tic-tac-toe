"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { chooseMove } from "@/lib/game/ai";
import {
  gameReducer,
  initialGameState,
  type GameState,
} from "@/lib/game/reducer";
import { emptyScore, recordResult, type Score } from "@/lib/game/score";
import type { Difficulty, GameMode } from "@/lib/game/types";
import { useLocalStorage } from "./use-local-storage";

export const AI_PLAYER = "O" as const;

const AI_MOVE_DELAY_MS = 420;

const STORAGE_KEYS = {
  score: "ink-ttt:score:v1",
  mode: "ink-ttt:mode:v1",
  difficulty: "ink-ttt:difficulty:v1",
  sound: "ink-ttt:sound:v1",
} as const;

export interface UseTicTacToe {
  game: GameState;
  mode: GameMode;
  difficulty: Difficulty;
  aiThinking: boolean;
  soundOn: boolean;
  score: Score;
  scoreHydrated: boolean;
  play: (index: number) => void;
  newGame: () => void;
  resetScore: () => void;
  changeMode: (mode: GameMode) => void;
  changeDifficulty: (difficulty: Difficulty) => void;
  toggleSound: () => void;
}

export function useTicTacToe(): UseTicTacToe {
  const [game, dispatch] = useReducer(gameReducer, initialGameState);
  const [mode, setMode] = useLocalStorage<GameMode>(STORAGE_KEYS.mode, "local");
  const [difficulty, setDifficulty] = useLocalStorage<Difficulty>(
    STORAGE_KEYS.difficulty,
    "hard",
  );
  const [soundOn, setSoundOn] = useLocalStorage<boolean>(STORAGE_KEYS.sound, true);
  const [score, setScore, scoreHydrated] = useLocalStorage<Score>(
    STORAGE_KEYS.score,
    emptyScore,
  );
  const [aiThinking, setAiThinking] = useState(false);

  const play = useCallback((index: number) => {
    dispatch({ type: "PLAY", index });
  }, []);

  const newGame = useCallback(() => {
    setAiThinking(false);
    dispatch({ type: "RESET" });
  }, []);

  // The AI move is an effect, not an event handler, so it is cancelled cleanly
  // on reset, unmount, or mode change (and is idempotent under StrictMode).
  useEffect(() => {
    if (mode !== "ai" || game.status !== "playing" || game.turn !== AI_PLAYER) {
      return;
    }
    setAiThinking(true);
    const id = window.setTimeout(() => {
      dispatch({ type: "PLAY", index: chooseMove(game.board, AI_PLAYER, difficulty) });
      setAiThinking(false);
    }, AI_MOVE_DELAY_MS);

    return () => {
      window.clearTimeout(id);
      setAiThinking(false);
    };
  }, [mode, difficulty, game]);

  // Record a finished round exactly once. `roundId` changes on every reset, and
  // the ref guard keeps this idempotent under StrictMode's double invocation.
  const scoredRound = useRef<number | null>(null);
  useEffect(() => {
    if (game.status === "playing") return;
    if (scoredRound.current === game.roundId) return;
    scoredRound.current = game.roundId;
    setScore((current) => recordResult(current, game.winner));
  }, [game.status, game.roundId, game.winner, setScore]);

  const resetScore = useCallback(() => setScore(emptyScore), [setScore]);

  const changeMode = useCallback(
    (next: GameMode) => {
      setMode(next);
      dispatch({ type: "RESET" });
    },
    [setMode],
  );

  const changeDifficulty = useCallback(
    (next: Difficulty) => setDifficulty(next),
    [setDifficulty],
  );

  const toggleSound = useCallback(() => setSoundOn((on) => !on), [setSoundOn]);

  return {
    game,
    mode,
    difficulty,
    aiThinking,
    soundOn,
    score,
    scoreHydrated,
    play,
    newGame,
    resetScore,
    changeMode,
    changeDifficulty,
    toggleSound,
  };
}
