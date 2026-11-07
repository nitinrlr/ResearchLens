"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Check, Search } from "lucide-react";

gsap.registerPlugin(useGSAP);

function Row({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="border-b border-line py-3 last:border-0">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-0.5 text-xs text-ink-muted">{meta}</p>
    </div>
  );
}

function DiscoverMock() {
  return (
    <>
      <div className="mb-1 flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm">
        <Search size={15} className="text-ink-muted" />
        image recognition
      </div>
      <Row title="Deep Residual Learning for Image Recognition" meta="Kaiming He et al." />
      <Row title="An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale" meta="Alexey Dosovitskiy et al." />
      <Row title="Learning Transferable Architectures for Scalable Image Recognition" meta="Barret Zoph et al." />
    </>
  );
}

function ReadingMock() {
  return (
    <>
      <Row title="Deep Residual Learning for Image Recognition" meta="Kaiming He et al. · 35 min" />
      <Row title="Playing Atari with Deep Reinforcement Learning" meta="Volodymyr Mnih et al. · 30 min" />
      <Row title="Neural Machine Translation by Jointly Learning to Align and Translate" meta="Dzmitry Bahdanau et al. · 30 min" />
    </>
  );
}

function CollectionsMock() {
  const collections = [
    { name: "Saved", checked: true },
    { name: "Transformers", checked: true },
    { name: "Reinforcement learning", checked: false },
  ];

  return (
    <>
      <p className="mb-2 text-sm font-medium">Attention Is All You Need</p>
      {collections.map(({ name, checked }) => (
        <div key={name} className="flex items-center gap-2.5 py-2 text-sm">
          <span className={`grid size-4 place-items-center rounded ${checked ? "bg-accent text-white" : "border border-line-strong"}`}>
            {checked && <Check size={12} strokeWidth={3} />}
          </span>
          {name}
        </div>
      ))}
    </>
  );
}

function ReaderMock() {
  return (
    <div className="px-4 pt-2 text-center">
      <p className="font-serif text-xl">Attention Is All You Need</p>
      <p className="mt-1 text-[10px] text-ink-muted">Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit</p>
      <div className="mt-4 grid h-64 grid-cols-2 gap-4">
        <div className="bg-[repeating-linear-gradient(to_bottom,#c9cfe3_0_2px,transparent_2px_8px)]" />
        <div className="bg-[repeating-linear-gradient(to_bottom,#c9cfe3_0_2px,transparent_2px_8px)]" />
      </div>
    </div>
  );
}

const FEATURES = [
  { title: "Discover", body: "Search titles, abstracts, authors, and topics across the most-cited open-access CS papers.", tone: "bg-night text-white", Mock: DiscoverMock },
  { title: "Continue Reading", body: "Papers are added the moment you open them, most recent first.", tone: "bg-accent text-white", Mock: ReadingMock },
  { title: "Collections", body: "A Saved collection to start, plus any you make yourself.", tone: "bg-accent-soft text-ink", Mock: CollectionsMock },
  { title: "Built-in reader", body: "Open-access PDFs open right in the page, when the publisher allows it.", tone: "bg-deep text-white", Mock: ReaderMock },
];

export default function FeatureReveal() {
  const [active, setActive] = useState(0);
  const panels = useRef<HTMLDivElement>(null);
  const shown = useRef(0);
  const topLayer = useRef(1);

  // The newest panel goes on top and wipes in from its bottom-left corner.
  useGSAP(() => {
    if (active === shown.current) return;
    shown.current = active;

    const panel = panels.current!.children[active] as HTMLElement;
    panel.style.zIndex = String(++topLayer.current);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      panel,
      { clipPath: "inset(100% 100% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut", overwrite: true }
    );
  }, { dependencies: [active] });

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
      <div>
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Explore what&apos;s <em className="font-serif text-[1.12em] font-normal text-accent">inside</em>
        </h2>

        <div className="mt-8">
          {FEATURES.map(({ title }, index) => (
            <button
              key={title}
              type="button"
              aria-pressed={index === active}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              className={`flex w-full items-center justify-between border-b py-4 text-left text-xl transition-colors duration-300 ${
                index === active ? "border-ink text-ink" : "border-line text-ink-muted"
              }`}
            >
              {title}
              <ArrowRight size={20} className={`transition-transform duration-300 ${index === active ? "-rotate-45" : ""}`} />
            </button>
          ))}
        </div>
      </div>

      <div ref={panels} className="relative h-[540px] overflow-hidden rounded-[1.25rem] lg:h-[470px]">
        {FEATURES.map(({ title, body, tone, Mock }, index) => (
          <div
            key={title}
            aria-hidden={index !== active}
            className={`absolute inset-0 flex flex-col p-6 sm:p-8 ${tone} ${index === 0 ? "z-[1]" : ""}`}
          >
            <h3 className="font-display text-3xl font-bold tracking-tight">{title}</h3>
            <p className="mt-3 max-w-md leading-relaxed">{body}</p>
            <div className="-mb-8 mt-6 flex-1 rounded-t-xl bg-white p-4 pb-8 text-ink shadow-lg sm:p-5 sm:pb-8">
              <Mock />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
