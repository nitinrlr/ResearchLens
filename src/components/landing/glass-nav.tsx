import Link from "next/link";

export default function GlassNav() {
  return (
    <>
      {/* Used by .glass-pill::after to bend what's behind the glass. */}
      <svg aria-hidden="true" className="absolute size-0">
        <filter id="glass-warp" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.014" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="3" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <header className="fixed inset-x-3 top-3 z-50 mx-auto max-w-5xl sm:inset-x-6">
        <nav className="glass-pill flex items-center justify-between gap-2 whitespace-nowrap py-1.5 pl-4 pr-1.5 text-white sm:gap-4 sm:py-2 sm:pl-5 sm:pr-2">
          <Link href="#top" className="flex items-center gap-2.5 font-display text-base font-bold tracking-tight">
            <span className="block size-4 rounded-[5px] bg-accent" />
            <span className="max-[359px]:sr-only">ResearchLens</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm md:flex">
            <a href="#papers" className="transition hover:text-sky">Papers</a>
            <a href="#features" className="transition hover:text-sky">Features</a>
          </div>

          <div className="flex items-center gap-1">
            <Link href="/login" className="rounded-full px-2.5 py-2 text-sm transition hover:text-sky sm:px-3.5">
              Sign in
            </Link>
            <Link href="/register" className="rounded-full bg-white px-3.5 py-2 text-sm font-medium text-night transition hover:bg-mist sm:px-4">
              Start reading
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
