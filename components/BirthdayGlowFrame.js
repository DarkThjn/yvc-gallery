export default function BirthdayGlowFrame({
  children,
  variant = "spotlight",
  className = "",
}) {
  return (
    <div
      className={`birthday-glow-frame birthday-glow-frame--${variant} ${className}`.trim()}
    >
      <span className="birthday-flame" aria-hidden="true" />
      <span className="birthday-rim" aria-hidden="true" />
      <span className="birthday-sparks" aria-hidden="true" />
      {children}
    </div>
  );
}
