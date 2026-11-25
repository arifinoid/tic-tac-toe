"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTicTacToe, AI_PLAYER } from "@/lib/hooks/use-tic-tac-toe";
import { useSound } from "@/lib/hooks/use-sound";
import type { GameStatus } from "@/lib/game/types";
import { Board } from "./board";
import { Controls } from "./controls";
import { Scoreboard } from "./scoreboard";
import { StatusBanner } from "./status-banner";
import { TurnIndicator } from "./turn-indicator";

export function TicTacToeGame() {
  const {
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
  } = useTicTacToe();
  const { play: playSound, resume } = useSound(soundOn);

  // Sounds fire on state transitions, not on clicks, so AI moves and resets
  // are covered too. The previous-state ref makes this idempotent when the
  // mute flag changes and the effect re-runs.
  const previous = useRef<{ lastMove: number | null; status: GameStatus }>({
    lastMove: null,
    status: "playing",
  });

  useEffect(() => {
    if (game.lastMove !== null && game.lastMove !== previous.current.lastMove) {
      playSound(game.board[game.lastMove] === "X" ? "place-x" : "place-o");
    }
    if (previous.current.status === "playing" && game.status === "won") {
      playSound("win");
    }
    if (previous.current.status === "playing" && game.status === "draw") {
      playSound("draw");
    }
    previous.current = { lastMove: game.lastMove, status: game.status };
  }, [game, playSound]);

  const handlePlay = useCallback(
    (index: number) => {
      resume();
      play(index);
    },
    [play, resume],
  );

  const handleNewGame = useCallback(() => {
    resume();
    playSound("ui");
    newGame();
  }, [newGame, playSound, resume]);

  const interactive = mode === "local" || game.turn !== AI_PLAYER;

  return (
    <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-5 px-5 py-10 sm:max-w-lg">
      <header className="text-center">
        <p className="text-[0.7rem] font-medium tracking-[0.35em] text-ink-faint uppercase">
          Ink &amp; Editorial
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight text-ink sm:text-6xl">
          Tic <span className="text-accent">·</span> Tac{" "}
          <span className="text-accent">·</span> Toe
        </h1>
        <p className="mt-3 text-sm text-ink-soft">
          Two players. One grid. No mercy.
        </p>
      </header>

      <TurnIndicator
        status={game.status}
        turn={game.turn}
        mode={mode}
        aiThinking={aiThinking}
      />

      <Board
        board={game.board}
        status={game.status}
        winLine={game.winLine}
        interactive={interactive}
        onPlay={handlePlay}
      />

      <StatusBanner status={game.status} winner={game.winner} />

      <Scoreboard score={score} hydrated={scoreHydrated} />

      <Controls
        mode={mode}
        difficulty={difficulty}
        soundOn={soundOn}
        onModeChange={changeMode}
        onDifficultyChange={changeDifficulty}
        onToggleSound={toggleSound}
        onNewGame={handleNewGame}
        onResetScore={resetScore}
      />
    </main>
  );
}
