"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ConnectResponse = {
  ok: boolean
  schema?: {
    dbName: string
    collections: { name: string; fields: string[] }[]
  }
  error?: string
}

export function ConnectionCard({
  onConnected,
}: {
  onConnected: (payload: ConnectResponse | null) => void
}) {
  const [uri, setUri] = useState("")
  const [llmUrl, setLlmUrl] = useState("http://localhost:1234/v1")
  const [llmModel, setLlmModel] = useState("openai/gpt-oss-20b") // placeholder name for LM Studio
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uri, llmUrl, llmModel }),
      })
      const data: ConnectResponse = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to connect")
        onConnected(null)
      } else {
        onConnected(data)
      }
    } catch (err: any) {
      setError(err?.message ?? "Connection failed")
      onConnected(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Connect to MongoDB</CardTitle>
        <CardDescription>We’ll read your schema for safe, read‑only queries.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleConnect} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="uri">MongoDB URI</Label>
            <Input
              id="uri"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              placeholder="mongodb+srv://user:pass@cluster.mongodb.net/dbname"
              required
              type="password"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="llmUrl">LLM API URL</Label>
              <Input
                id="llmUrl"
                value={llmUrl}
                onChange={(e) => setLlmUrl(e.target.value)}
                placeholder="http://localhost:1234/v1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="llmModel">LLM Model</Label>
              <Input
                id="llmModel"
                value={llmModel}
                onChange={(e) => setLlmModel(e.target.value)}
                placeholder="openai/gpt-oss-20b"
              />
            </div>
          </div>
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <Button type="submit" disabled={loading}>
            {loading ? "Connecting..." : "Connect"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
