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
  return (
    <span
      className="offer-logo"
      style={{ background: `hsl(${hue} 55% 42%)` }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
