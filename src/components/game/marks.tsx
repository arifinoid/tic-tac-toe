interface MarkProps {
  className?: string;
}

/**
 * Hand-drawn X: two slightly curved strokes. `pathLength={1}` normalises the
 * dash so the CSS `mark-stroke` animation draws each stroke in.
 */
export function MarkX({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <path
        d="M 27 25 Q 50 45 73 75"
        pathLength={1}
        className="mark-stroke"
        style={{ animationDelay: "0ms" }}
      />
      <path
        d="M 73 25 Q 50 45 27 75"
        pathLength={1}
        className="mark-stroke"
        style={{ animationDelay: "140ms" }}
      />
    </svg>
  );
}

/** Hand-drawn O: one loose, slightly overlapping loop. */
export function MarkO({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <path
        d="M 50 19 C 71 18 81 32 81 49 C 81 67 68 81 50 81 C 31 81 19 67 19 49 C 19 33 31 18 52 20"
        pathLength={1}
        className="mark-stroke"
      />
    </svg>
  );
}

/** Renders the mark for a player, or nothing for an empty cell. */
export function Mark({
  player,
  className,
}: {
  player: "X" | "O";
  className?: string;
}) {
  if (player === "X") return <MarkX className={className} />;
  return <MarkO className={className} />;
}
