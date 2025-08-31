"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChatPanel } from "@/components/chat-panel"
import { ResultTable } from "@/components/result-table"
import { 
  DatabaseIcon, 
  ArrowLeftIcon, 
  SettingsIcon,
  ActivityIcon,
  UsersIcon,
  BarChart3Icon,
  TableIcon,
  ExternalLinkIcon,
  RefreshCwIcon
} from "lucide-react"

type SchemaSummary = {
  dbName: string
  collections: { name: string; fields: string[] }[]
}

type QueryResult = {
  rows: any[]
  meta?: { executedAt?: string; type?: string }
}

export function DashboardPage() {
  const router = useRouter()
  const [connected, setConnected] = useState(false)
  const [schema, setSchema] = useState<SchemaSummary | null>(null)
  const [results, setResults] = useState<QueryResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    checkConnection()
  }, [])

  async function checkConnection() {
    try {
      const res = await fetch("/api/ping")
      if (res.ok) {
        // Check if we have a session with schema
        const testQuery = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: "test" }),
        })
        
        if (testQuery.status === 400) {
          // Not connected, redirect to connect page
          router.push("/connect")
          return
        }
        
        // We're connected, but we need to get the schema somehow
        // For now, we'll assume connection exists
        setConnected(true)
        setSchema({
          dbName: "Connected Database",
          collections: []
        })
      }
    } catch (error) {
      router.push("/connect")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCwIcon className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Checking connection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <DatabaseIcon className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold text-white">MongoDB AI Agent</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/database">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  <TableIcon className="mr-2 h-4 w-4" />
                  Database Details
                </Button>
              </Link>
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className={`max-w-7xl mx-auto p-4 md:p-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-300">Query your MongoDB database with natural language</p>
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <ActivityIcon className="w-4 h-4 mr-2" />
              Connected
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Connection Status */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DatabaseIcon className="mr-2 h-5 w-5 text-purple-400" />
                  Connection Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Status</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Connected
                    </Badge>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Database</span>
                      <span className="text-white">{schema?.dbName || "Loading..."}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Collections</span>
                      <span className="text-white">{schema?.collections.length || 0}</span>
                    </div>
                  </div>
                  <Link href="/database">
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      <ExternalLinkIcon className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3Icon className="mr-2 h-5 w-5 text-blue-400" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-sm text-gray-300">Queries Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-sm text-gray-300">Results Found</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample Queries */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-sm">Sample Queries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "Show me all users",
                    "Count active sessions",
                    "Find recent orders",
                    "List top products"
                  ].map((query, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-white/10 h-auto py-2"
                      onClick={() => {
                        // You could implement auto-filling the chat input here
                      }}
                    >
                      <span className="text-xs truncate">{query}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat Panel */}
            <ChatPanel 
              disabled={!connected || !schema} 
              onResult={(res) => setResults(res)} 
            />
            
            {/* Results */}
            <ResultTable rows={results?.rows ?? []} />
          </div>
        </div>
      </main>
    </div>
  )
}