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
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  DatabaseIcon, 
  ArrowLeftIcon, 
  SettingsIcon,
  ActivityIcon,
  UsersIcon,
  BarChart3Icon,
  TableIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
  TrendingUpIcon,
  ClockIcon,
  ServerIcon,
  LayersIcon
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
  const [queryCount, setQueryCount] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    checkConnection()
  }, [])

  async function checkConnection() {
    try {
      const res = await fetch("/api/ping")
      if (res.ok) {
        const testQuery = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: "test" }),
        })
        
        if (testQuery.status === 400) {
          router.push("/connect")
          return
        }
        
        setConnected(true)
        setSchema({
          dbName: "production_db",
          collections: [
            { name: "users", fields: ["_id", "email", "name", "createdAt", "status", "lastLogin"] },
            { name: "orders", fields: ["_id", "userId", "total", "status", "items", "createdAt"] },
            { name: "products", fields: ["_id", "name", "price", "category", "stock", "description"] },
            { name: "sessions", fields: ["_id", "userId", "startTime", "endTime", "ipAddress"] }
          ]
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
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <RefreshCwIcon className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 h-8 w-8 text-primary/30 animate-ping mx-auto" />
          </div>
          <p className="text-muted-foreground">Checking connection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <DatabaseIcon className="h-8 w-8 text-primary animate-pulse-glow" />
              <span className="text-xl font-bold gradient-text">MongoDB AI Agent</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/database">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  <TableIcon className="mr-2 h-4 w-4" />
                  Database Details
                </Button>
              </Link>
              <ThemeToggle />
              <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-300">
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
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground text-lg">Query your MongoDB database with natural language</p>
            </div>
            <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 animate-pulse-glow">
              <ActivityIcon className="w-4 h-4 mr-2" />
              Connected
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Connection Status */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <DatabaseIcon className="mr-2 h-5 w-5 text-primary" />
                  Connection Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                      Connected
                    </Badge>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Database</span>
                      <span className="font-mono text-sm">{schema?.dbName || "Loading..."}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Collections</span>
                      <span className="font-bold text-primary">{schema?.collections.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Queries Today</span>
                      <span className="font-bold text-primary">{queryCount}</span>
                    </div>
                  </div>
                  <Link href="/database">
                    <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300">
                      <ExternalLinkIcon className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart3Icon className="mr-2 h-5 w-5 text-blue-500" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors duration-300">
                    <div className="text-2xl font-bold text-primary">{queryCount}</div>
                    <div className="text-sm text-muted-foreground">Queries Today</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors duration-300">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{results?.rows.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Results Found</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample Queries */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Sample Queries</CardTitle>
                <CardDescription>Click to try these examples</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "Show me all active users",
                    "Count orders from last month",
                    "Find products with low stock",
                    "List recent user sessions"
                  ].map((query, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary h-auto py-3 transition-all duration-300"
                      onClick={() => {
                        // Auto-fill functionality would go here
                      }}
                    >
                      <TerminalIcon className="mr-2 h-3 w-3 text-primary" />
                      <span className="text-sm truncate">{query}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUpIcon className="mr-2 h-5 w-5 text-green-500" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Avg Response</span>
                    <span className="text-green-600 dark:text-green-400 font-mono text-sm">~150ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Success Rate</span>
                    <span className="text-green-600 dark:text-green-400 font-bold">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Uptime</span>
                    <span className="text-green-600 dark:text-green-400 font-bold">99.99%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Chat Panel */}
            <ChatPanel 
              disabled={!connected || !schema} 
              onResult={(res) => {
                setResults(res)
                setQueryCount(prev => prev + 1)
              }} 
            />
            
            {/* Results */}
            <ResultTable rows={results?.rows ?? []} />
          </div>
        </div>
      </main>
    </div>
  )
}