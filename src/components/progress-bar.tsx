import { Text } from "@radix-ui/themes";

/** "4 of 15 concepts" with a bar, for a goal's progress. */
export default function ProgressBar({ done, total }: { done: number; total: number }) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      <div
        role="progressbar"
        aria-label="Concepts finished"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        className="h-2 overflow-hidden rounded-full bg-white/10"
      >
        <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>
      <Text as="p" size="2" color="gray" mt="2">
        {done} of {total} concepts finished
      </Text>
    </div>
  );
}
