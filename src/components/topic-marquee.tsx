import Link from "next/link";

import { marqueeRows, topicPillParams } from "@/lib/explore-filters";
import { pageHref } from "@/lib/pagination";

// Seconds each pill takes to scroll past, so both rows move at the same speed.
const SECONDS_PER_TOPIC = 8;

type TopicMarqueeProps = {
  topics: string[];
  activeTopic: string;
  query: string;
};

/**
 * Two rows of topic pills drifting in opposite directions. Each row is drawn
 * twice side by side, so sliding by half its width loops without a jump.
 * Hovering or tabbing into a row pauses it.
 */
export default function TopicMarquee({ topics, activeTopic, query }: TopicMarqueeProps) {
  const rows = marqueeRows(topics, activeTopic);

  return (
    <nav aria-label="Filter by topic" className="flex min-w-0 basis-80 flex-1 flex-col gap-2">
      {rows.map((row, index) => (
        <div key={index} className="topic-marquee">
          <div
            className="topic-marquee-track"
            data-direction={index === 0 ? "right" : "left"}
            style={{ "--marquee-duration": `${row.length * SECONDS_PER_TOPIC}s` } as React.CSSProperties}
          >
            {[false, true].map((copy) => (
              <ul key={String(copy)} aria-hidden={copy || undefined} className="flex shrink-0 gap-2 pr-2">
                {row.map((topic) => {
                  const active = topic === activeTopic;

                  return (
                    <li key={topic}>
                      <Link
                        href={pageHref("/explore", 1, topicPillParams(query, activeTopic, topic))}
                        tabIndex={copy ? -1 : undefined}
                        aria-current={active || undefined}
                        className={`block whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          active
                            ? "border-transparent bg-accent text-white"
                            : "border-white/10 bg-white/[0.18] text-ink-muted hover:bg-white/15 hover:text-ink"
                        }`}
                      >
                        {topic}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
