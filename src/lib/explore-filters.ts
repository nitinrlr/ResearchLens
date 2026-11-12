/** The Explore search params worth keeping in links, leaving out empty ones. */
export function filterParams({ query, topic }: { query: string; topic: string }) {
  const params: Record<string, string> = {};

  if (query) params.q = query;
  if (topic) params.topic = topic;

  return params;
}

/** A topic pill's link: picks the topic, or clears it when it's already picked. Keeps the search. */
export function topicPillParams(query: string, activeTopic: string, topic: string) {
  return filterParams({ query, topic: topic === activeTopic ? "" : topic });
}

/** Splits topics into the marquee's two rows; the topic in use goes first so it's easy to find. */
export function marqueeRows(topics: string[], activeTopic: string) {
  const all = activeTopic && !topics.includes(activeTopic) ? [activeTopic, ...topics] : topics;
  const half = Math.ceil(all.length / 2);

  return [all.slice(0, half), all.slice(half)];
}
