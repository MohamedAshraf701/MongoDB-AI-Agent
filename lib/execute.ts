import type { MongoClient } from "mongodb"
import type { Plan } from "@/lib/plan"

export async function executePlan({
  client,
  dbName,
  plan,
}: {
  client: MongoClient
  dbName: string
  plan: Plan
}): Promise<{ rows: any[]; meta: Record<string, any> }> {
  const db = client.db(dbName)
  const start = Date.now()

  switch (plan.action) {
    case "find": {
      const cursor = db
        .collection(plan.collection)
        .find(plan.filter || {}, {
          projection: plan.projection as any,
          skip: plan.skip || 0,
        })
        .sort(plan.sort || {})
        .limit(plan.limit ?? 100)
      const rows = await cursor.toArray()
      return { rows, meta: { type: "find", count: rows.length, ms: Date.now() - start } }
    }
    case "count": {
      const n = await db.collection(plan.collection).countDocuments(plan.filter || {})
      return { rows: [{ count: n }], meta: { type: "count", ms: Date.now() - start } }
    }
    case "distinct": {
      const values = await db.collection(plan.collection).distinct(plan.field, plan.filter || {})
      return {
        rows: values.map((v) => ({ value: v })),
        meta: { type: "distinct", count: values.length, ms: Date.now() - start },
      }
    }
    case "aggregate": {
      const rows = await db
        .collection(plan.collection)
        .aggregate(plan.pipeline as any, { allowDiskUse: plan.allowDiskUse ?? false })
        .toArray()
      return { rows, meta: { type: "aggregate", count: rows.length, ms: Date.now() - start } }
    }
    case "update": {
      const result = await db.collection(plan.collection).updateMany(
        plan.filter || {},
        plan.update,
        { upsert: plan.upsert || false }
      )
      return { 
        rows: [{ 
          matchedCount: result.matchedCount, 
          modifiedCount: result.modifiedCount, 
          upsertedCount: result.upsertedCount 
        }], 
        meta: { type: "update", ms: Date.now() - start } 
      }
    }
    case "delete": {
      const result = await db.collection(plan.collection).deleteMany(plan.filter || {})
      return { 
        rows: [{ deletedCount: result.deletedCount }], 
        meta: { type: "delete", ms: Date.now() - start } 
      }
    }
  }
}
