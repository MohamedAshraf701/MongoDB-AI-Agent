import { PlanSchema, type Plan, type SchemaSummary, extractFirstJsonObject } from "@/lib/plan"

type PlanOptions = {
  llmUrl?: string
  llmModel?: string
}

function getEnv(key: string): string | undefined {
  try {
    // @ts-ignore
    return process.env[key]
  } catch {
    return undefined
  }
}

export async function getQueryPlan({
  question,
  schema,
  options,
}: {
  question: string
  schema: SchemaSummary
  options?: PlanOptions
}): Promise<Plan> {
  const llmUrl = options?.llmUrl || getEnv("LM_STUDIO_URL") || "http://localhost:1234/v1"
  const llmModel = options?.llmModel || getEnv("LM_STUDIO_MODEL") || "openai/gpt-oss-20b"

  const system = [
    "You are a MongoDB query planner.",
    "Return ONLY strict JSON with no markdown, no prose.",
    "Schema is provided; choose the most relevant collection.",
    "Allowed actions: find, aggregate, count, distinct, update, delete.",
    "Constraints:",
    "- For aggregate, forbid $out and $merge stages.",
    "- Never use $where, $function, or $accumulator.",
    "- Limit results to <= 100 unless the user requests a larger number (max 1000).",
    "JSON shape examples:",
    '{ "action": "find", "collection": "users", "filter": { "status": "active" }, "projection": { "email": 1 }, "sort": { "createdAt": -1 }, "limit": 50, "skip": 0 }',
    '{ "action": "count", "collection": "orders", "filter": { "status": "pending" } }',
    '{ "action": "distinct", "collection": "orders", "field": "status", "filter": {} }',
    '{ "action": "aggregate", "collection": "orders", "pipeline": [ { "$match": { "status": "shipped" } }, { "$group": { "_id": "$userId", "total": { "$sum": "$total" } } }, { "$sort": { "total": -1 } }, { "$limit": 50 } ] }',
    '{ "action": "update", "collection": "users", "filter": { "status": "inactive" }, "update": { "$set": { "status": "active", "updatedAt": "$$NOW" } }, "multi": true }',
    '{ "action": "delete", "collection": "temp_data", "filter": { "createdAt": { "$lt": "$$NOW-7d" } }, "limit": 100 }',
  ].join("\n")

  const user = ["Question:", question, "", "Schema summary:", JSON.stringify(schema, null, 2)].join("\n")

  const res = await fetch(`${llmUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: llmModel,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0,
      response_format: { 
        type: "json_schema",
        json_schema: {
          schema: {
            type: "object",
            properties: {
              action: { type: "string", enum: ["find", "aggregate", "count", "distinct", "update", "delete"] },
              collection: { type: "string" },
              filter: { type: "object" },
              projection: { type: "object" },
              sort: { type: "object" },
              limit: { type: "number" },
              skip: { type: "number" },
              pipeline: { type: "array", items: { type: "object" } },
              field: { type: "string" },
              update: { type: "object" },
              upsert: { type: "boolean" },
              multi: { type: "boolean" }
            },
            required: ["action", "collection"]
          }
        }
      }, // LM Studio supports OpenAI-compatible APIs
    }),
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(`LLM error: ${msg}`)
  }

  const data = (await res.json()) as any
  const content: string | undefined = data?.choices?.[0]?.message?.content
  if (!content) throw new Error("No content from LLM")

  const jsonText = extractFirstJsonObject(content) || content.trim()
  let candidate: unknown
  try {
    candidate = JSON.parse(jsonText)
  } catch {
    throw new Error("Invalid JSON from LLM")
  }

  const plan = PlanSchema.parse(candidate)
  return plan
}
