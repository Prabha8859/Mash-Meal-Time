// GlassCard — base frosted glass container
export default function GlassCard({ children, className = "", style = {} }) {
  return (
    <div
      className={`
        relative overflow-hidden
        // bg-white/[0.13] backdrop-blur-sm
        border border-white/30
        rounded-[28px]
        // shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.45)]
        before:absolute before:inset-0 before:rounded-[28px] before:pointer-events-none
        before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-white/10
        ${className}
      `}
      style={style}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}