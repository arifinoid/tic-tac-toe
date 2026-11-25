"use client";

import { useCallback } from "react";
import { playSound, resumeAudio, type SoundKind } from "@/lib/game/sound";

/** Plays sounds through the shared WebAudio module, honouring the mute flag. */
export function useSound(soundOn: boolean) {
  const play = useCallback(
    (kind: SoundKind) => {
      playSound(kind, !soundOn);
    },
    [soundOn],
  );

  const resume = useCallback(() => resumeAudio(), []);

  return { play, resume };
}
