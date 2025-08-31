"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  DatabaseIcon, 
  ArrowLeftIcon, 
  TableIcon,
  InfoIcon,
  BarChart3Icon,
  CodeIcon,
  RefreshCwIcon,
  CollectionsIcon as LayersIcon
} from "lucide-react"

type SchemaSummary = {
  dbName: string
  collections: { name: string; fields: string[] }[]
}

export function DatabaseDetailsPage() {
  const router = useRouter()
  const [schema, setSchema] = useState<SchemaSummary | null>(null)
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
        
        // Mock schema for demo - in real app this would come from session
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCwIcon className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading database details...</p>
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
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className={`max-w-7xl mx-auto p-4 md:p-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Database Details</h1>
              <p className="text-gray-300">Comprehensive view of your MongoDB schema and collections</p>
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <DatabaseIcon className="w-4 h-4 mr-2" />
              {schema?.dbName}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <InfoIcon className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="collections" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <LayersIcon className="mr-2 h-4 w-4" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BarChart3Icon className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center text-lg">
                    <DatabaseIcon className="mr-2 h-5 w-5 text-purple-400" />
                    Database Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-400">Name</div>
                      <div className="text-white font-mono">{schema?.dbName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Collections</div>
                      <div className="text-white">{schema?.collections.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Status</div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center text-lg">
                    <BarChart3Icon className="mr-2 h-5 w-5 text-blue-400" />
                    Query Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-400">Today</div>
                      <div className="text-white text-2xl font-bold">0</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">This Week</div>
                      <div className="text-white text-lg">0</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Success Rate</div>
                      <div className="text-green-400">100%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center text-lg">
                    <CodeIcon className="mr-2 h-5 w-5 text-yellow-400" />
                    AI Model
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-400">Model</div>
                      <div className="text-white font-mono text-sm">gpt-oss-20b</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Endpoint</div>
                      <div className="text-white font-mono text-sm">localhost:1234</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Status</div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        Online
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Collections Overview */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Collections Overview</CardTitle>
                <CardDescription className="text-gray-300">
                  Quick view of your database collections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {schema?.collections.slice(0, 4).map((collection, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div>
                        <div className="text-white font-medium">{collection.name}</div>
                        <div className="text-sm text-gray-400">{collection.fields.length} fields</div>
                      </div>
                      <TableIcon className="h-4 w-4 text-purple-400" />
                    </div>
                  ))}
                  {(schema?.collections.length || 0) > 4 && (
                    <div className="text-center pt-2">
                      <span className="text-sm text-gray-400">
                        +{(schema?.collections.length || 0) - 4} more collections
                      </span>
                    </div>
                  )}
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
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Collections Schema</CardTitle>
                <CardDescription className="text-gray-300">
                  Detailed view of all collections and their fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!schema ? (
                  <div className="text-gray-400">No schema available</div>
                ) : schema.collections.length === 0 ? (
                  <div className="text-gray-400">No collections found</div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {schema.collections.map((collection, index) => (
                      <AccordionItem key={collection.name} value={collection.name} className="border-white/10">
                        <AccordionTrigger className="text-white hover:text-purple-300 hover:no-underline">
                          <div className="flex items-center justify-between w-full mr-4">
                            <span className="font-medium">{collection.name}</span>
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                              {collection.fields.length} fields
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pt-4">
                            {collection.fields.map((field) => (
                              <div key={field} className="bg-white/5 rounded-md p-2 border border-white/10">
                                <code className="text-sm text-gray-300">{field}</code>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Query Performance</CardTitle>
                  <CardDescription className="text-gray-300">
                    Average response times and success rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Avg Response Time</span>
                      <span className="text-green-400 font-mono">~150ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Success Rate</span>
                      <span className="text-green-400">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Queries Cached</span>
                      <span className="text-blue-400">0%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Popular Collections</CardTitle>
                  <CardDescription className="text-gray-300">
                    Most frequently queried collections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {schema?.collections.slice(0, 3).map((collection, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300">{collection.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.random() * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">0</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </main>
    </div>
  )
}