import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSession } from "@/lib/session"
import { getMongoClient } from "@/lib/mongo"
import { checkRateLimit } from "@/lib/ratelimit"
import { getQueryPlan } from "@/lib/llm"
import { PlanSchema, validatePlanSafety } from "@/lib/plan"

export async function POST(req: Request) {
  try {
    const { question, plan: providedPlan } = await req.json()
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Missing question" }, { status: 400 })
    }

    const sid = (await cookies()).get("sid")?.value
    if (!sid) {
      return NextResponse.json({ error: "Not connected. Please connect first." }, { status: 400 })
    }
    const sess = getSession(sid)
    if (!sess?.mongoUri || !sess?.dbName || !sess?.schema) {
      return NextResponse.json({ error: "Not connected. Please connect first." }, { status: 400 })
    }

    // Rate limit per session
    const rl = checkRateLimit(`q:${sid}`)
    if (!rl.ok) {
      return NextResponse.json({ error: "Rate limit exceeded", retryInMs: rl.resetIn }, { status: 429 })
    }

    let parsed
    if (providedPlan) {
      // Use the provided plan (already validated by the plan endpoint)
      parsed = PlanSchema.parse(providedPlan)
    } else {
      // Get plan from LLM and validate strictly
      const plan = await getQueryPlan({
        question,
        schema: sess.schema,
        options: { llmUrl: sess.llmUrl, llmModel: sess.llmModel },
      })
      // Parse again to be extra strict (defense-in-depth), then safety-check
      parsed = PlanSchema.parse(plan)
    }
    validatePlanSafety(parsed)

    // Execute
    const client = await getMongoClient(sess.mongoUri)
    const { executePlan } = await import("@/lib/execute")
    const result = await executePlan({ client, dbName: sess.dbName, plan: parsed })

    return NextResponse.json({ ...result, plan: parsed })
  } catch (err: any) {
    const message = err?.message ?? "Query failed"
    // Return 502 for upstream LLM issues, else 500
    const status = message.toLowerCase().includes("llm") ? 502 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
