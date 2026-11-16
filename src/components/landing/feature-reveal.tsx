"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  Bookmark,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock3,
  Folder,
  Plus,
  Search,
  Send,
  Sparkles,
  Star,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { COLLECTION_COLORS } from "@/lib/collection-colors";

gsap.registerPlugin(useGSAP);

/*
  Small, simplified copies of the real pages: the dark fluted background, glass
  panels and mostly solid dark cards. They're pictures of the app, so they sit
  in an aria-hidden box and nothing in them is clickable.
*/

// The dashboard's background, with the fluted columns faked by stripes.
const SCREEN =
  "h-full overflow-hidden rounded-t-xl bg-[#070f2b] bg-[repeating-linear-gradient(90deg,rgb(255_255_255/0.035)_0_2px,transparent_2px_26px),radial-gradient(80%_60%_at_30%_0%,#1a2f7a,transparent)] p-3 text-white shadow-lg ring-1 ring-white/10 sm:p-4";
const GLASS = "rounded-lg bg-white/[0.08] ring-1 ring-white/10";
const SOLID = "rounded-xl bg-[rgb(10_18_50/0.82)] ring-1 ring-white/10";

type MockPaper = { title: string; author: string; topics: string[]; year: number; difficulty: number; minutes: number };

// Real papers. Reading times follow the app's formula: pages × minutes per page for the difficulty.
const RESNET: MockPaper = { title: "Deep Residual Learning for Image Recognition", author: "Kaiming He", topics: ["Advanced Neural Network Applications"], year: 2016, difficulty: 3, minutes: 40 };
const VIT: MockPaper = { title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale", author: "Alexey Dosovitskiy", topics: ["Domain Adaptation and Few-Shot Learning"], year: 2020, difficulty: 4, minutes: 90 };
const ATARI: MockPaper = { title: "Playing Atari with Deep Reinforcement Learning", author: "Volodymyr Mnih", topics: ["Reinforcement Learning in Robotics"], year: 2013, difficulty: 3, minutes: 30 };
const BAHDANAU: MockPaper = { title: "Neural Machine Translation by Jointly Learning to Align and Translate", author: "Dzmitry Bahdanau", topics: ["Natural Language Processing Techniques"], year: 2014, difficulty: 3, minutes: 50 };

function PaperCardMock({ paper }: { paper: MockPaper }) {
  return (
    <div className={`${SOLID} flex flex-col p-3`}>
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-[13px] font-medium leading-snug">{paper.title}</p>
        <Bookmark size={14} className="shrink-0 text-mist" />
      </div>
      <p className="mt-1 text-[11px] text-mist">{paper.author} et al.</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {paper.topics.map((topic) => (
          <span key={topic} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-mist">
            {topic}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-end justify-between text-[10px] text-mist">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {paper.year}
        </span>
        <span className="flex gap-3">
          <span className="flex gap-1">
            <Star size={12} />
            <span>
              Difficulty
              <span className="block text-[11px] text-white">{paper.difficulty}/5</span>
            </span>
          </span>
          <span className="flex gap-1">
            <Clock3 size={12} />
            <span>
              Reading Time
              <span className="block text-[11px] text-white">{paper.minutes} min</span>
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}

function PageHeaderMock({ title, note }: { title: string; note: string }) {
  return (
    <div className={`${GLASS} mb-2 px-3 py-2.5`}>
      <p className="font-display text-base font-bold">{title}</p>
      <p className="text-[11px] text-mist">{note}</p>
    </div>
  );
}

function SearchMock({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-mist ring-1 ring-white/10">
      <Search size={13} />
      {text}
    </div>
  );
}

function DiscoverMock() {
  const pills = ["Topic Modeling", "Computer Graphics and Visualization Techniques", "3D Shape Modeling and Analysis", "Virtual Reality Applications"];

  return (
    <div className={SCREEN}>
      <div className={`${GLASS} mb-2 space-y-2.5 p-3`}>
        <p className="font-display text-base font-bold">Discover</p>
        <SearchMock text="image recognition" />
        {/* The real pills drift sideways; here they just run off the edge. */}
        <div className="flex gap-1.5 overflow-hidden [mask-image:linear-gradient(to_right,black_80%,transparent)]">
          {pills.map((pill, index) => (
            <span
              key={pill}
              className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${
                index === 1 ? "bg-accent text-white" : "bg-white/[0.18] text-white"
              }`}
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <PaperCardMock paper={RESNET} />
        <div className="max-sm:hidden">
          <PaperCardMock paper={VIT} />
        </div>
      </div>
    </div>
  );
}

function ReadingMock() {
  return (
    <div className={SCREEN}>
      <PageHeaderMock title="Continue Reading" note="Papers you've opened, most recent first." />
      <div className="grid gap-3 sm:grid-cols-2">
        {[ATARI, BAHDANAU].map((paper, index) => (
          <div key={paper.title} className={index === 1 ? "max-sm:hidden" : ""}>
            <PaperCardMock paper={paper} />
            <p className="mt-1 px-1 text-right text-[10px] text-mist">Remove</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollectionsMock() {
  const collections = [
    { name: "Saved", count: 12, color: COLLECTION_COLORS.darkBlue, Icon: Bookmark },
    { name: "Transformers", count: 8, color: COLLECTION_COLORS.purple, Icon: Folder },
    { name: "Reinforcement learning", count: 5, color: COLLECTION_COLORS.green, Icon: Folder },
  ];

  return (
    <div className={SCREEN}>
      <div className={`${GLASS} mb-2 flex items-center justify-between gap-3 p-3`}>
        <p className="font-display text-base font-bold">Collections</p>
        <div className="w-40 max-sm:hidden">
          <SearchMock text="Search collections" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {collections.map(({ name, count, color, Icon }) => (
          <div
            key={name}
            className="flex items-start gap-2 rounded-xl p-3 ring-1 ring-white/15"
            // The same tint as the real cards: 30% of the color over dark glass.
            style={{ background: `color-mix(in srgb, ${color.fill} 30%, rgb(10 18 50 / 0.7))` }}
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-md ring-1 ring-white/15" style={{ background: color.fill, color: color.ink }}>
              <Icon size={14} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium">{name}</span>
              <span className="block text-[10px] text-mist">{count} papers</span>
            </span>
          </div>
        ))}
        <div className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-white/25 text-xs text-sky">
          <Plus size={14} />
          New Collection
        </div>
      </div>
    </div>
  );
}

function ReaderMock() {
  return (
    <div className={`${SCREEN} grid gap-2 sm:grid-cols-[3fr_2fr]`}>
      <div className={`${SOLID} overflow-hidden`}>
        <div className="flex items-center justify-between px-3 py-2 text-[10px] text-mist">
          <span className="flex items-center gap-1.5">
            <ChevronUp size={12} />
            <ChevronDown size={12} />
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-white">1</span>/ 15
          </span>
          <span className="flex items-center gap-1.5">
            <ZoomOut size={12} />
            100%
            <ZoomIn size={12} />
          </span>
        </div>
        <div className="bg-black/25 p-2.5">
          <div className="rounded-sm bg-white px-4 pb-6 pt-4 text-center text-night">
            <p className="font-serif text-base leading-tight">Attention Is All You Need</p>
            <p className="mt-1 text-[8px] text-slate-500">Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit</p>
            {/* Lines of text; the highlight is what a reader would ask Lens about. */}
            <div className="mt-3 space-y-1.5 text-left">
              {[100, 96, 92, 98, 70].map((width, index) => (
                <div key={index} className={`h-1.5 rounded-full ${index === 2 ? "bg-sky/70" : "bg-slate-300"}`} style={{ width: `${width}%` }} />
              ))}
              <div className="!mt-3 grid grid-cols-2 gap-3">
                {[0, 1].map((column) => (
                  <div key={column} className="space-y-1.5">
                    {[100, 94, 98, 88, 96, 60].map((width, index) => (
                      <div key={index} className="h-1.5 rounded-full bg-slate-300" style={{ width: `${width}%` }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${GLASS} flex flex-col gap-2 p-3 max-sm:hidden`}>
        <p className="flex items-center gap-1.5 text-[13px] font-medium">
          <Sparkles size={13} className="text-sky" />
          Questions? Ask Lens!
        </p>
        {["Explain this simply", "What's the main idea?"].map((starter) => (
          <span key={starter} className="rounded-md bg-white/10 px-2 py-1 text-[10px]">
            {starter}
          </span>
        ))}
        <div className="ml-auto max-w-[85%] rounded-lg bg-accent px-2 py-1.5 text-[10px]">Why use attention instead of recurrence?</div>
        <div className="max-w-[90%] rounded-lg bg-white/10 px-2 py-1.5 text-[10px] leading-relaxed text-mist">
          Attention lets every word look at every other word at once, so training runs in parallel instead of one step at a time.
        </div>
        <div className="mt-auto flex items-center justify-between rounded-lg bg-white/10 px-2 py-1.5 text-[10px] text-mist">
          Ask a question…
          <Send size={11} />
        </div>
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
            <div aria-hidden="true" className="-mb-8 mt-6 min-h-0 flex-1">
              <Mock />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
