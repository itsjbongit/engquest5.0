"use client";
import { useEffect, useRef } from "react";
import type { EventItem, Festival } from "@/content/types";

interface Props { event: EventItem; festival: Festival; onClose: () => void }

export function EventDetail({ event: e, festival: f, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (k: KeyboardEvent) => k.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const time = e.startTime ? e.startTime + (e.endTime ? ` – ${e.endTime}` : "") : undefined;
  const rows: [string, string | undefined][] = [
    ["Category", e.category], ["Date", e.date ?? f.date], ["Time", time ?? (f.hours && `Festival hours, ${f.hours}`)],
    ["Venue", e.venue ?? f.venue], ["Team size", e.teamSize], ["Prize", e.prize], ["Contact", e.contact],
  ];
  const text = e.description ?? e.shortDescription;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="event-h" className="rise fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/95 px-6 py-20 md:px-16">
      <div className="mx-auto max-w-3xl">
        <button ref={closeRef} type="button" onClick={onClose} className="mb-10 border border-volt px-4 py-3 font-display text-sm">Back to the Quest</button>
        <h2 id="event-h" className="font-display text-4xl font-bold md:text-6xl">{e.name}</h2>
        <p className="mt-6 max-w-prose text-lg text-white/80">{text ?? "Details will be announced."}</p>
        <dl className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="border-t border-volt/40 pt-3"><dt className="text-sm text-volt">{k}</dt><dd className="mt-1">{v}</dd></div>
          ))}
        </dl>
        <div className="mt-10 flex flex-wrap gap-4">
          {e.registrationUrl && <a href={e.registrationUrl} className="bg-volt px-5 py-3 font-display text-black">Register</a>}
          {e.rulesUrl && <a href={e.rulesUrl} className="border border-volt px-5 py-3 font-display">Rules</a>}
        </div>
      </div>
    </div>
  );
}
