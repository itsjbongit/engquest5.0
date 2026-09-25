import Image from "next/image";
import { festival as f } from "@/content/festival";

const links = [["About", "#intro"], ["Events", "#quest"], ["Contact", "#contact"]] as const;

export function CompassNav() {
  return (
    <div className="fixed inset-x-0 top-0 z-40 px-4 sm:px-6">
      <div className="mx-auto max-w-screen-2xl rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-3 sm:p-4">
        <nav aria-label="Primary" className="flex items-center justify-between">
          <a href="#main" aria-label={`${f.name} ${f.edition}, back to top`} className="block size-12">
            <Image src={f.logo} alt="" width={48} height={48} className="size-full object-contain" priority />
          </a>
          <ul className="flex gap-5 font-display text-sm tracking-wide">
            {links.map(([label, href]) => <li key={href}><a href={href} className="py-2">{label}</a></li>)}
          </ul>
        </nav>
      </div>
    </div>
  );
}