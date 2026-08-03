export default function BirthdayGlowFrame({
  children,
  variant = "spotlight",
  className = "",
}) {
  return (
    <div
      className={`birthday-glow-frame birthday-glow-frame--${variant} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
