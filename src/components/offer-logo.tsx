// A small, dependency-free brand monogram for an affiliate offer: a colored
// rounded tile with the brand's initial. Gives each offer card a visual anchor
// (like a real product logo) without hotlinking external images. The color is
// derived deterministically from the offer id, so it's stable across renders.

function hueFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 360;
}

export function OfferLogo({ id, name }: { id: string; name: string }) {
  const hue = hueFromId(id);
  const initial =
    name.replace(/[^A-Za-z0-9]/g, "").charAt(0).toUpperCase() || "•";
  // Soft diagonal gradient (two nearby hues) reads as a real brand mark.
  const bg = `linear-gradient(135deg, hsl(${hue} 62% 50%), hsl(${(hue + 22) % 360} 64% 38%))`;
  return (
    <span className="offer-logo" style={{ background: bg }} aria-hidden="true">
      {initial}
    </span>
  );
}
