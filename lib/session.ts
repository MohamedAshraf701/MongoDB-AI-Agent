// Simple in-memory session store keyed by a cookie "sid"
// NOTE: This is volatile and will reset on server reloads. Good for demos/dev.

export type CollectionSummary = { name: string; fields: string[] }
export type SchemaSummary = { dbName: string; collections: CollectionSummary[] }

export type SessionData = {
  mongoUri?: string
  llmUrl?: string
  llmModel?: string
  dbName?: string
  schema?: SchemaSummary
  lastSeen: number
}

type Store = Map<string, SessionData>

declare global {
  // eslint-disable-next-line no-var
  var __SESSIONS__: Store | undefined
}

function getStore(): Store {
  if (!globalThis.__SESSIONS__) {
    globalThis.__SESSIONS__ = new Map()
  }
  return globalThis.__SESSIONS__
}

export function newSessionId(): string {
  // Use crypto.randomUUID when available; fallback for environments without it
  try {
    // @ts-ignore
    return crypto.randomUUID()
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
  }
}

export function getOrCreateSession(id?: string): { id: string; data: SessionData; isNew: boolean } {
  const store = getStore()
  let sid = id
  let isNew = false
  if (!sid) {
    sid = newSessionId()
    isNew = true
  }
  let data = store.get(sid!)
  if (!data) {
    data = { lastSeen: Date.now() }
    store.set(sid!, data)
    isNew = true
  } else {
    data.lastSeen = Date.now()
  }
  return { id: sid!, data, isNew }
}

export function updateSession(id: string, patch: Partial<SessionData>): SessionData {
  const store = getStore()
  const cur = store.get(id) ?? { lastSeen: Date.now() }
  const next = { ...cur, ...patch, lastSeen: Date.now() }
  store.set(id, next)
  return next
}

export function getSession(id: string): SessionData | undefined {
  return getStore().get(id)
}
