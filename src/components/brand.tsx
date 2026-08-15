// CalcLumen brand mark: an indigo tile with a white "spark" — a nod to
// "lumen" (light / a bright, clear answer). Reused in the header and footer.
export function BrandMark({
  size = 32,
  radius = 10,
}: {
  size?: number;
  radius?: number;
}) {
  return (
    <span
      className="grid place-items-center shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: "var(--accent)",
      }}
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 24 24"
        fill="#ffffff"
        aria-hidden="true"
      >
        <path d="M12 1.6c.6 6.8 3.6 9.8 10.4 10.4C15.6 12.6 12.6 15.6 12 22.4 11.4 15.6 8.4 12.6 1.6 12 8.4 11.4 11.4 8.4 12 1.6Z" />
      </svg>
    </span>
  );
}
