// GlassCard — base frosted glass container
export default function GlassCard({ children, className = "", style = {} }) {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-white/10 backdrop-blur-xl
        border border-white/40
        rounded-[32px]
        shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]
        before:absolute before:inset-0 before:rounded-[28px] before:pointer-events-none
        before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-white/5
        ${className}
      `}
      style={style}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}