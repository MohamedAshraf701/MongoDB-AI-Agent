import { z } from "zod"

export const ActionEnum = z.enum(["find", "aggregate", "count", "distinct", "update", "delete"])
export type Action = z.infer<typeof ActionEnum>

const RecordAny = z.record(z.any())

// Common constraints
const SortSchema = z
  .record(
    z
      .number()
      .int()
      .refine((v) => v === 1 || v === -1, "Sort directions must be 1 or -1"),
  )
  .optional()
const ProjectionSchema = z.record(z.union([z.literal(0), z.literal(1), z.boolean()])).optional()

// Filters are arbitrary but we block dangerous keys like $where later
const FilterSchema = RecordAny.optional()

const FindPlan = z.object({
  action: z.literal("find"),
  collection: z.string().min(1),
  filter: FilterSchema.default({}),
  projection: ProjectionSchema,
  sort: SortSchema,
  limit: z.number().int().min(0).max(1000).default(100),
  skip: z.number().int().min(0).default(0),
})

const CountPlan = z.object({
  action: z.literal("count"),
  collection: z.string().min(1),
  filter: FilterSchema.default({}),
})

const DistinctPlan = z.object({
  action: z.literal("distinct"),
  collection: z.string().min(1),
  field: z.string().min(1),
  filter: FilterSchema.default({}),
})

const PipelineStage = z.record(z.any())
const AggregatePlan = z.object({
  action: z.literal("aggregate"),
  collection: z.string().min(1),
  pipeline: z.array(PipelineStage).min(1).max(20),
  allowDiskUse: z.boolean().optional(),
})

const UpdatePlan = z.object({
  action: z.literal("update"),
  collection: z.string().min(1),
  filter: FilterSchema.default({}),
  update: z.record(z.any()),
  upsert: z.boolean().optional().default(false),
  multi: z.boolean().optional().default(false),
})

const DeletePlan = z.object({
  action: z.literal("delete"),
  collection: z.string().min(1),
  filter: FilterSchema.default({}),
  limit: z.number().int().min(1).max(1000).default(1),
})

export const PlanSchema = z.discriminatedUnion("action", [FindPlan, CountPlan, DistinctPlan, AggregatePlan, UpdatePlan, DeletePlan])
export type Plan = z.infer<typeof PlanSchema>

export type SchemaSummary = {
  dbName: string
  collections: { name: string; fields: string[] }[]
}

// Safety helpers
const FORBIDDEN_FILTER_KEYS = new Set<string>(["$where"])
const FORBIDDEN_AGG_STAGES = new Set<string>(["$out", "$merge"])
const FORBIDDEN_AGG_OPERATORS = new Set<string>(["$function", "$accumulator", "$where"])
const FORBIDDEN_UPDATE_OPERATORS = new Set<string>(["$where", "$function", "$accumulator"])

export function hasForbiddenKeyDeep(obj: any, forbidden: Set<string>): boolean {
  if (!obj || typeof obj !== "object") return false
  for (const [k, v] of Object.entries(obj)) {
    if (forbidden.has(k)) return true
    if (v && typeof v === "object" && hasForbiddenKeyDeep(v, forbidden)) return true
  }
  return false
}

export function validatePlanSafety(plan: Plan) {
  if ("collection" in plan) {
    if (typeof plan.collection !== "string" || !plan.collection.trim()) {
      throw new Error("Invalid collection")
    }
  }

  switch (plan.action) {
    case "find": {
      if (hasForbiddenKeyDeep(plan.filter, FORBIDDEN_FILTER_KEYS)) {
        throw new Error("Filter contains forbidden keys")
      }
      if (plan.limit && plan.limit > 1000) {
        throw new Error("Limit too large")
      }
      break
    }
    case "count": {
      if (hasForbiddenKeyDeep(plan.filter, FORBIDDEN_FILTER_KEYS)) {
        throw new Error("Filter contains forbidden keys")
      }
      break
    }
    case "distinct": {
      if (!plan.field?.trim()) throw new Error("Distinct field required")
      if (hasForbiddenKeyDeep(plan.filter, FORBIDDEN_FILTER_KEYS)) {
        throw new Error("Filter contains forbidden keys")
      }
      break
    }
    case "aggregate": {
      // Validate stages
      for (const stage of plan.pipeline) {
        const keys = Object.keys(stage)
        if (!keys.length) throw new Error("Empty pipeline stage")
        for (const key of keys) {
          if (FORBIDDEN_AGG_STAGES.has(key)) throw new Error(`Forbidden stage: ${key}`)
        }
        if (hasForbiddenKeyDeep(stage, FORBIDDEN_AGG_OPERATORS)) {
          throw new Error("Pipeline contains forbidden operators")
        }
      }
      break
    }
    case "update": {
      if (hasForbiddenKeyDeep(plan.filter, FORBIDDEN_FILTER_KEYS)) {
        throw new Error("Filter contains forbidden keys")
      }
      if (hasForbiddenKeyDeep(plan.update, FORBIDDEN_UPDATE_OPERATORS)) {
        throw new Error("Update contains forbidden operators")
      }
      break
    }
    case "delete": {
      if (hasForbiddenKeyDeep(plan.filter, FORBIDDEN_FILTER_KEYS)) {
        throw new Error("Filter contains forbidden keys")
      }
      if (plan.limit && plan.limit > 1000) {
        throw new Error("Delete limit too large")
      }
      break
    }
  }
}

// Utility: extract first JSON object from a text blob
export function extractFirstJsonObject(text: string): string | null {
  let depth = 0
  let start = -1
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === "{") {
      if (depth === 0) start = i
      depth++
    } else if (ch === "}") {
      depth--
      if (depth === 0 && start !== -1) {
        return text.slice(start, i + 1)
      }
    }
  }
  return null
}
