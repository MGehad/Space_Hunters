export function AppLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 flex-shrink-0">
        <img
          src="/logo.png"
          alt="Space Hunters Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div>
        <h1 className="text-white font-bold text-xl leading-tight font-sans">Space Hunters</h1>
      </div>
    </div>
  )
}
