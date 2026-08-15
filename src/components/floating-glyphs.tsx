// Decorative ambient layer for the hero: math glyphs that gently drift.
// Purely cosmetic (aria-hidden, pointer-events none, low opacity), positions
// are fixed/deterministic so it stays SSG-stable, and motion is disabled for
// users who prefer reduced motion (handled in globals.css).

interface Glyph {
  char: string;
  top: string;
  left: string;
  size: number;
  rotate: number;
  dur: number;
  delay: number;
  soft?: boolean;
}

const GLYPHS: Glyph[] = [
  { char: "%", top: "18%", left: "6%", size: 42, rotate: -12, dur: 9, delay: 0 },
  { char: "🧮", top: "60%", left: "9%", size: 40, rotate: 8, dur: 11, delay: 1.2 },
  { char: "+", top: "74%", left: "20%", size: 30, rotate: 0, dur: 8, delay: 0.6, soft: true },
  { char: "÷", top: "12%", left: "30%", size: 26, rotate: 10, dur: 10, delay: 2 },
  { char: "$", top: "70%", left: "38%", size: 30, rotate: -6, dur: 12, delay: 0.3, soft: true },
  { char: "=", top: "16%", left: "62%", size: 30, rotate: 6, dur: 9, delay: 1.5, soft: true },
  { char: "×", top: "66%", left: "66%", size: 34, rotate: -10, dur: 10, delay: 0.9 },
  { char: "π", top: "26%", left: "80%", size: 34, rotate: 4, dur: 11, delay: 2.3, soft: true },
  { char: "%", top: "72%", left: "88%", size: 40, rotate: 12, dur: 8.5, delay: 0.4 },
  { char: "√", top: "12%", left: "92%", size: 30, rotate: -8, dur: 12, delay: 1.8, soft: true },
];

export function FloatingGlyphs() {
  return (
    <div className="glyphs" aria-hidden="true">
      {GLYPHS.map((g, i) => (
        <span
          key={i}
          className={`glyph${g.soft ? " soft" : ""}`}
          style={
            {
              top: g.top,
              left: g.left,
              fontSize: `${g.size}px`,
              "--r": `${g.rotate}deg`,
              "--d": `${g.dur}s`,
              "--delay": `${g.delay}s`,
            } as React.CSSProperties
          }
        >
          {g.char}
        </span>
      ))}
    </div>
  );
}
