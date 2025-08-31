import { MongoClient } from "mongodb"
import type { SchemaSummary } from "@/lib/session"

declare global {
  // eslint-disable-next-line no-var
  var __MONGO_CLIENTS__: Map<string, MongoClient> | undefined
}

function getClientStore(): Map<string, MongoClient> {
  if (!globalThis.__MONGO_CLIENTS__) {
    globalThis.__MONGO_CLIENTS__ = new Map()
  }
  return globalThis.__MONGO_CLIENTS__!
}

export async function getMongoClient(uri: string): Promise<MongoClient> {
  const store = getClientStore()
  const existing = store.get(uri)
  if (existing) {
    return existing
  }
  const client = new MongoClient(uri)
  await client.connect()
  store.set(uri, client)
  return client
}

function getDbNameFromUri(uri: string): string | undefined {
  // naive parse: mongodb[s]+://.../<dbName>?...
  try {
    // Using WHATWG URL will throw on mongodb+srv, so do manual fallback
    const afterSlash = uri.split("://")[1]?.split("/")?.[1] ?? ""
    const dbSegment = afterSlash.split("?")[0]
    return dbSegment || undefined
  } catch {
    return undefined
  }
}

export async function discoverSchema(client: MongoClient, preferredDb?: string): Promise<SchemaSummary> {
  const dbName = preferredDb || getDbNameFromUri(client.options?.srvHost ? "" : ((client as any).s?.url ?? "")) // best-effort
  const db = client.db(dbName) // if undefined, driver uses default ("test") or the one in URI
  const resolvedName = db.databaseName

  const collections: string[] = []
  try {
    const list = await db.listCollections({}, { nameOnly: true }).toArray()
    for (const c of list) {
      if (c?.name) collections.push(c.name)
    }
  } catch {
    // Fallback if listCollections not permitted
    // Try to infer from system namespaces is not feasible safely; leave empty.
  }

  const summaries = []
  for (const name of collections) {
    try {
      const docs = await db.collection(name).find({}, { limit: 5 }).toArray()
      const fieldSet = new Set<string>()
      for (const d of docs) {
        if (d && typeof d === "object") {
          Object.keys(d).forEach((k) => fieldSet.add(k))
        }
      }
      summaries.push({ name, fields: Array.from(fieldSet).slice(0, 50) })
    } catch {
      summaries.push({ name, fields: [] })
    }
  }

  return { dbName: resolvedName, collections: summaries }
}
