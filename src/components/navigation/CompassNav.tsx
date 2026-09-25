const links = [["About", "#intro"], ["Events", "#quest"], ["Contact", "#contact"]] as const;

export function CompassNav() {
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 mix-blend-difference">
      <a href="#main" aria-label="ENGQUEST 5.0, back to top">
        <svg viewBox="0 0 40 40" className="size-9" fill="none" stroke="#00a8ff" strokeWidth="2" aria-hidden>
          <circle cx="20" cy="20" r="17" /><path d="M20 4v32M4 20h32" strokeWidth="1" /><path d="M20 8l4 12h-8z" fill="#fff" stroke="none" />
        </svg>
      </a>
      <ul className="flex gap-5 font-display text-sm tracking-wide">
        {links.map(([label, href]) => <li key={href}><a href={href} className="py-2">{label}</a></li>)}
      </ul>
    </nav>
  );
}
