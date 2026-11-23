"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, Check, Clock3, Lock, Star } from "lucide-react";
import { Badge, Heading, Text } from "@radix-ui/themes";

import FinishedToggle from "@/components/finished-toggle";
import { formatDifficulty, formatReadingTime } from "@/lib/reading-time";
import type { GoalTreeView } from "@/services/goal.service";

type ConceptView = GoalTreeView["branches"][number]["concepts"][number];

// Narrow enough for five branches beside the details panel on a laptop.
const COLUMN_MIN_REM = 7;

const NODE_STYLE: Record<ConceptView["state"], string> = {
  done: "bg-green-500/25 text-green-300 ring-green-400/80",
  next: "bg-accent/40 text-white ring-sky shadow-[0_0_24px_rgb(141_164_239/0.55)]",
  later: "bg-white/[0.04] text-white/35 ring-white/15",
};

const STATE_LABEL: Record<ConceptView["state"], string> = {
  done: "Finished",
  next: "Up next",
  later: "Later",
};

function NodeIcon({ state }: { state: ConceptView["state"] }) {
  if (state === "done") return <Check size={22} strokeWidth={3} />;
  if (state === "next") return <BookOpen size={20} />;
  return <Lock size={17} />;
}

/** A concept as a round node, which opens its details when clicked. */
function Node({ concept, selected, onSelect }: { concept: ConceptView; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${concept.title}: ${STATE_LABEL[concept.state]}`}
      className="group flex w-full flex-col items-center gap-2 px-1 outline-none"
    >
      <span
        className={`relative grid size-12 place-items-center rounded-full ring-2 transition-transform duration-200 group-hover:scale-110 group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-white ${
          NODE_STYLE[concept.state]
        } ${selected ? "scale-110 outline-2 outline-offset-4 outline-white/80" : ""}`}
      >
        <NodeIcon state={concept.state} />

        {/* A slow glow on the concept to read next. */}
        {concept.state === "next" && (
          <span aria-hidden="true" className="absolute -inset-1 animate-pulse rounded-full ring-2 ring-sky/40 motion-reduce:animate-none" />
        )}

        {/* Papers finished so far, while a concept is part done. */}
        {concept.state !== "done" && concept.finished > 0 && (
          <span className="absolute -right-2 -top-1 rounded-full bg-green-500 px-1.5 text-[10px] font-bold text-night">
            {concept.finished}/{concept.paperCount}
          </span>
        )}
      </span>

      {/* Two lines tall even for short names, so every column's rows line up. */}
      <span className={`line-clamp-2 h-8 text-center text-xs leading-4 ${concept.state === "later" ? "text-white/55" : "text-white"}`}>
        {concept.title}
      </span>
    </button>
  );
}

/** The selected concept: why it matters, its papers, and the buttons to finish them. */
function Details({ concept }: { concept: ConceptView }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Heading as="h2" size="5">
          {concept.title}
        </Heading>
        <Badge color={concept.state === "done" ? "green" : concept.state === "next" ? "indigo" : "gray"} radius="full">
          {STATE_LABEL[concept.state]}
        </Badge>
      </div>

      {concept.state === "later" && concept.after && (
        <Text as="p" size="2" mt="2" className="flex items-center gap-1.5 text-mist">
          <Lock size={13} />
          Best after {concept.after}, but you can start it now.
        </Text>
      )}

      <Text as="p" color="gray" mt="3">
        {concept.why}
      </Text>

      <ul className="mt-4 flex flex-col gap-2">
        {concept.papers.map((paper) => (
          <li key={paper.id} className="rounded-lg bg-white/[0.06] p-3 ring-1 ring-white/10">
            <Link href={`/papers/${paper.id}`} className="font-medium leading-snug hover:text-sky hover:underline">
              {paper.title}
            </Link>
            <p className="mt-1 text-xs text-mist">
              {paper.author ? `${paper.author} et al. · ` : ""}
              {paper.year}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="flex gap-3 text-xs text-mist">
                <span className="flex items-center gap-1">
                  <Star size={13} />
                  {formatDifficulty(paper.difficulty)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock3 size={13} />
                  {formatReadingTime(paper.readingTime)}
                </span>
              </span>
              <FinishedToggle key={`${paper.id}-${paper.finished}`} paperId={paper.id} initialFinished={paper.finished} variant="compact" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A role's skill tree, drawn top-down: the role at the top with its progress,
 * one column per branch, and each branch's concepts as connected nodes in the
 * order to learn them. Clicking a node shows its papers in the panel.
 */
export default function SkillTreeView({ title, view }: { title: string; view: GoalTreeView }) {
  const concepts = view.branches.flatMap((branch) => branch.concepts);
  const [selectedId, setSelectedId] = useState(() => (concepts.find((c) => c.state === "next") ?? concepts[0])?.id);
  const selected = concepts.find((concept) => concept.id === selectedId) ?? concepts[0];
  const panel = useRef<HTMLElement>(null);
  const columns = view.branches.length;
  const percent = view.total > 0 ? Math.round((view.done / view.total) * 100) : 0;

  // When the tree is wider than the screen, start in the middle so the role is in view.
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = scroller.current!;
    element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
  }, []);

  // Below the tree on smaller screens, so bring it into view after a pick.
  const picked = useRef(false);
  useEffect(() => {
    if (!picked.current) return;
    if (window.matchMedia("(max-width: 79.99rem)").matches) {
      panel.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedId]);

  function select(id: string) {
    picked.current = true;
    setSelectedId(id);
  }

  return (
    // grid-cols-1, not the default auto column, so the wide tree scrolls inside its panel.
    <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="glass-panel min-w-0">
        <p className="mb-6 flex flex-wrap gap-x-5 gap-y-1 text-sm text-mist">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-green-500/40 ring-2 ring-green-400/80" /> Finished
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-accent/50 ring-2 ring-sky" /> Up next
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full ring-2 ring-white/20" /> Later, but you can start any time
          </span>
        </p>

        {/* On narrow screens the tree scrolls sideways rather than squeezing. */}
        <div ref={scroller} className="-mx-2 overflow-x-auto px-2 pb-2">
          <div style={{ minWidth: `${columns * COLUMN_MIN_REM}rem` }}>
            {/* The role, with a ring that fills as concepts are finished. */}
            <div className="flex flex-col items-center">
              <div
                className="grid size-20 place-items-center rounded-full p-1"
                style={{ background: `conic-gradient(var(--color-accent) ${percent}%, rgb(255 255 255 / 0.12) 0)` }}
              >
                <div className="grid size-full place-items-center rounded-full bg-[#0b1440]">
                  <span className="font-display text-lg font-bold">{percent}%</span>
                </div>
              </div>
              <p className="mt-2 text-center font-display font-bold">{title}</p>
              <p className="text-xs text-mist">
                {view.done} of {view.total} concepts
              </p>
              <span aria-hidden="true" className="mt-3 h-6 w-px bg-white/25" />
            </div>

            <div className="relative grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
              {/* The bar joining the role to every branch, from the first column's middle to the last's. */}
              {columns > 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-px bg-white/25"
                  style={{ left: `${50 / columns}%`, right: `${50 / columns}%` }}
                />
              )}

              {view.branches.map((branch) => {
                const done = branch.concepts.filter((concept) => concept.state === "done").length;

                return (
                  <section key={branch.title} aria-label={branch.title} className="flex flex-col items-center">
                    <span aria-hidden="true" className="h-6 w-px bg-white/25" />
                    {/* A fixed height, so one-line and two-line branch names keep the nodes level. */}
                    <div className="flex h-10 w-full items-center justify-center">
                      <h3 className="max-w-[95%] rounded-2xl bg-white/10 px-3 py-1 text-center text-xs font-semibold leading-4 ring-1 ring-white/15">
                        {branch.title}
                      </h3>
                    </div>
                    <span className="mt-1 text-[10px] text-mist">
                      {done}/{branch.concepts.length}
                    </span>

                    {branch.concepts.map((concept, index) => {
                      // A line turns green once the concept above it is finished.
                      const lit = index > 0 && branch.concepts[index - 1].state === "done";

                      return (
                        <Fragment key={concept.id}>
                          <span aria-hidden="true" className={`my-1 h-6 w-0.5 rounded-full ${lit ? "bg-green-400/70" : "bg-white/15"}`} />
                          <Node concept={concept} selected={concept.id === selected?.id} onSelect={() => select(concept.id)} />
                        </Fragment>
                      );
                    })}
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section ref={panel} aria-live="polite" className="glass-panel scroll-mt-3 xl:sticky xl:top-3">
        {selected ? <Details concept={selected} /> : <Text color="gray">This role has no concepts yet.</Text>}
      </section>
    </div>
  );
}
