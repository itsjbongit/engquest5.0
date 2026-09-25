import Image from "next/image";
import { festival as f } from "@/content/festival";

export function Footer() {
  return (
    <footer className="flex flex-wrap items-center gap-5 border-t border-volt/30 px-6 py-10 md:px-16">
      <Image src={f.logo} alt={`${f.name} ${f.edition} logo`} width={56} height={56} />
      <div>
        <p className="font-display text-lg font-bold">{f.name} {f.edition}</p>
        <p className="text-white/70">{f.school}, {f.university} · {f.year}</p>
      </div>
      <nav aria-label="School links" className="flex flex-wrap gap-x-6 gap-y-2 md:ml-auto">
        <a href="https://soe.jnu.ac.in/" target="_blank" rel="noreferrer" className="underline underline-offset-4">SoE Website</a>
        <a href="https://www.instagram.com/soe_jnu?stkn=cDc5czk0b2ttNjYz" target="_blank" rel="noreferrer" className="underline underline-offset-4">Instagram</a>
      </nav>
    </footer>
  );
}
