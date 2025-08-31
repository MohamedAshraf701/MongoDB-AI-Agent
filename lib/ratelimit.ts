type Bucket = { tokens: number; updatedAt: number }

declare global {
  // eslint-disable-next-line no-var
  var __RL__: Map<string, Bucket> | undefined
}

function store(): Map<string, Bucket> {
  if (!globalThis.__RL__) globalThis.__RL__ = new Map()
  return globalThis.__RL__!
}

/**
 * Token bucket limiter.
 * capacity: max tokens
 * refillAmount: tokens added per intervalMs
 * intervalMs: refill interval
 */
export function checkRateLimit(key: string, { capacity = 20, refillAmount = 20, intervalMs = 60_000 } = {}) {
  const now = Date.now()
  const s = store()
  const b = s.get(key) ?? { tokens: capacity, updatedAt: now }
  // refill
  if (now - b.updatedAt >= intervalMs) {
    b.tokens = Math.min(capacity, b.tokens + refillAmount)
    b.updatedAt = now
  }
  if (b.tokens <= 0) {
    const resetIn = intervalMs - (now - b.updatedAt)
    return { ok: false as const, remaining: 0, resetIn }
  }
  b.tokens -= 1
  s.set(key, b)
  return { ok: true as const, remaining: b.tokens, resetIn: 0 }
}
