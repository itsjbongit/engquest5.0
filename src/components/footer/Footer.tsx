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
    </footer>
  );
}
