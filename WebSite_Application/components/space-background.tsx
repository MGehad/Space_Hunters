export function SpaceBackground() {
  return (
    <div className="absolute inset-0 opacity-40">
      {/* subtle radial glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(96,165,250,0.25),transparent)] blur-2xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(192,132,252,0.25),transparent)] blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(244,114,182,0.18),transparent)] blur-2xl" />

      {/* fine grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-white rounded-full animate-pulse" />
      <div className="absolute top-[25%] left-[80%] w-1 h-1 bg-white rounded-full animate-pulse delay-100" />
      <div className="absolute top-[40%] left-[15%] w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-200" />
      <div className="absolute top-[60%] left-[70%] w-1 h-1 bg-white rounded-full animate-pulse delay-300" />
      <div className="absolute top-[75%] left-[40%] w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-150" />
      <div className="absolute top-[15%] left-[60%] w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-500" />
      <div className="absolute top-[85%] left-[25%] w-1 h-1 bg-white rounded-full animate-pulse delay-700" />
      <div className="absolute top-[50%] left-[90%] w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-400" />
    </div>
  )
}
