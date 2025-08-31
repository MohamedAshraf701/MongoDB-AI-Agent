import { NextResponse } from "next/server"
import { cookies, headers } from "next/headers"
import { getMongoClient, discoverSchema } from "@/lib/mongo"
import { getOrCreateSession, updateSession } from "@/lib/session"

type ConnectBody = {
  uri?: string
  llmUrl?: string
  llmModel?: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ConnectBody
    const uri = body?.uri?.trim()
    if (!uri || typeof uri !== "string" || !uri.startsWith("mongodb")) {
      return NextResponse.json({ ok: false, error: "Invalid MongoDB URI" }, { status: 400 })
    }

    // Ensure session and cookie
    const cookieStore = await cookies()
    const sid = cookieStore.get("sid")?.value
    const { id: sessionId, data: _data, isNew } = getOrCreateSession(sid)

    // This fixes local/dev (http) where 'secure: true' would prevent the cookie from being saved.
    const proto = (await headers()).get("x-forwarded-proto") || (process.env.NODE_ENV === "production" ? "https" : "http")
    const isSecure = proto === "https"
    cookieStore.set("sid", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: isSecure,
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    })

    // Connect to MongoDB and discover schema
    const client = await getMongoClient(uri)
    const schema = await discoverSchema(client)

    // Persist connection + LLM prefs in session (server-side only)
    updateSession(sessionId, {
      mongoUri: uri,
      llmUrl: body?.llmUrl,
      llmModel: body?.llmModel,
      dbName: schema.dbName,
      schema,
    })

    return NextResponse.json({ ok: true, schema })
  } catch (err: any) {
    const message = err?.message || "Failed to connect"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
