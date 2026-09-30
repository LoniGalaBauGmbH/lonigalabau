type PublicContentKey = "services" | "featured-project";
type QueryResult = { error: unknown };

// Only public editorial content. Never use for sessions, roles or submissions.
// Cache resolved data only: an in-flight promise must stay in its request context.
// Worker-local and bounded to two keys; edits become visible within 30 seconds.
export function createPublicContentCache(ttlMs = 30_000, now = Date.now) {
  const entries = new Map<PublicContentKey, { expires: number; value: QueryResult }>();
  return async function cached<T extends QueryResult>(
    key: PublicContentKey,
    load: () => PromiseLike<T>,
  ): Promise<T> {
    const hit = entries.get(key);
    if (hit && hit.expires > now()) return hit.value as T;
    const result = await load();
    if (!result.error) entries.set(key, { expires: now() + ttlMs, value: result });
    return result;
  };
}

export const publicContentQuery = createPublicContentCache();
