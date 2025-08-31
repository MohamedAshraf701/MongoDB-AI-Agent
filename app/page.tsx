"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ConnectionCard } from "@/components/connection-card"
import { SchemaViewer } from "@/components/schema-viewer"
import { ChatPanel } from "@/components/chat-panel"
import { ResultTable } from "@/components/result-table"

type SchemaSummary = {
  dbName: string
  collections: { name: string; fields: string[] }[]
}

type QueryResult = {
  rows: any[]
  meta?: { executedAt?: string; type?: string }
}

export default function HomePage() {
  const [connected, setConnected] = useState(false)
  const [schema, setSchema] = useState<SchemaSummary | null>(null)
  const [results, setResults] = useState<QueryResult | null>(null)

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-balance text-2xl font-semibold tracking-tight">MongoDB AI Agent</h1>
        <p className="text-sm text-muted-foreground">
          Connect to MongoDB, view schema, and ask natural-language questions.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <ConnectionCard
            onConnected={(payload) => {
              setConnected(true)
              setSchema(payload?.schema ?? null)
            }}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Connection</CardTitle>
              <CardDescription>Status and details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={connected ? "text-green-600" : "text-amber-600"}>
                    {connected ? "Connected" : "Not connected"}
                  </span>
                </div>
                <Separator className="my-3" />
                <div className="text-muted-foreground">
                  {schema ? (
                    <div>
                      <div>
                        Database: <span className="text-foreground">{schema.dbName}</span>
                      </div>
                      <div>
                        Collections: <span className="text-foreground">{schema.collections.length}</span>
                      </div>
                    </div>
                  ) : (
                    <div>Enter a MongoDB URI to connect.</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <SchemaViewer schema={schema} />
          <ChatPanel disabled={!connected || !schema} onResult={(res) => setResults(res)} />
          <ResultTable rows={results?.rows ?? []} />
        </div>
      </div>
    </main>
  )
}
