"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  DatabaseIcon, 
  ArrowLeftIcon, 
  TableIcon, 
  InfoIcon, 
  BarChart3Icon, 
  CodeIcon, 
  RefreshCwIcon, 
  LayersIcon,
  FileTextIcon,
  HashIcon,
  CalendarIcon,
  UserIcon,
  ShoppingCartIcon,
  PackageIcon,
  ActivityIcon,
  TrendingUpIcon,
  PieChartIcon
} from "lucide-react"

type SchemaSummary = {
  dbName: string
  collections: { name: string; fields: string[] }[]
}

type CollectionStats = {
  name: string
  documentCount: number
  avgDocSize: string
  indexes: number
  storageSize: string
}

export function DatabaseDetailsPage() {
  const router = useRouter()
  const [schema, setSchema] = useState<SchemaSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [collectionStats] = useState<CollectionStats[]>([
    { name: "users", documentCount: 15420, avgDocSize: "2.1 KB", indexes: 5, storageSize: "32.4 MB" },
    { name: "orders", documentCount: 8932, avgDocSize: "3.8 KB", indexes: 7, storageSize: "33.9 MB" },
    { name: "products", documentCount: 2156, avgDocSize: "1.9 KB", indexes: 4, storageSize: "4.1 MB" },
    { name: "sessions", documentCount: 45231, avgDocSize: "0.8 KB", indexes: 3, storageSize: "36.2 MB" }
  ])

  const [sampleData] = useState({
    users: [
      { _id: "507f1f77bcf86cd799439011", email: "john@example.com", name: "John Doe", status: "active", createdAt: "2025-01-10T10:30:00Z" },
      { _id: "507f1f77bcf86cd799439012", email: "jane@example.com", name: "Jane Smith", status: "active", createdAt: "2025-01-09T14:22:00Z" },
      { _id: "507f1f77bcf86cd799439013", email: "bob@example.com", name: "Bob Johnson", status: "inactive", createdAt: "2025-01-08T09:15:00Z" }
    ],
    orders: [
      { _id: "507f1f77bcf86cd799439021", userId: "507f1f77bcf86cd799439011", total: 129.99, status: "shipped", createdAt: "2025-01-12T16:45:00Z" },
      { _id: "507f1f77bcf86cd799439022", userId: "507f1f77bcf86cd799439012", total: 89.50, status: "pending", createdAt: "2025-01-12T11:30:00Z" }
    ],
    products: [
      { _id: "507f1f77bcf86cd799439031", name: "Wireless Headphones", price: 99.99, category: "Electronics", stock: 45 },
      { _id: "507f1f77bcf86cd799439032", name: "Coffee Mug", price: 12.99, category: "Home", stock: 120 }
    ],
    sessions: [
      { _id: "507f1f77bcf86cd799439041", userId: "507f1f77bcf86cd799439011", startTime: "2025-01-12T10:00:00Z", endTime: "2025-01-12T10:45:00Z" }
    ]
  })

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
          <RefreshCwIcon className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading database details...</p>
        </div>
      </div>
    )
  }

  const getCollectionIcon = (name: string) => {
    switch (name) {
      case 'users': return UserIcon
      case 'orders': return ShoppingCartIcon
      case 'products': return PackageIcon
      case 'sessions': return ActivityIcon
      default: return TableIcon
    }
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
              <Link href="/dashboard">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className={`max-w-7xl mx-auto p-4 md:p-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Database Details</h1>
              <p className="text-muted-foreground text-lg">Comprehensive view of your MongoDB schema and data</p>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse-glow">
              <DatabaseIcon className="w-4 h-4 mr-2" />
              {schema?.dbName}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 border border-border/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <InfoIcon className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="collections" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <LayersIcon className="mr-2 h-4 w-4" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TableIcon className="mr-2 h-4 w-4" />
              Sample Data
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3Icon className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <DatabaseIcon className="mr-2 h-5 w-5 text-primary" />
                    Database Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Name</div>
                      <div className="font-mono text-sm">{schema?.dbName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Collections</div>
                      <div className="text-primary font-bold">{schema?.collections.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <BarChart3Icon className="mr-2 h-5 w-5 text-blue-500" />
                    Query Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Today</div>
                      <div className="text-blue-500 text-2xl font-bold">0</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">This Week</div>
                      <div className="text-blue-500 text-lg">0</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                      <div className="text-green-600 dark:text-green-400 font-bold">100%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <CodeIcon className="mr-2 h-5 w-5 text-yellow-500" />
                    AI Model
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Model</div>
                      <div className="font-mono text-sm">gpt-oss-20b</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Endpoint</div>
                      <div className="font-mono text-sm">localhost:1234</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                        Online
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUpIcon className="mr-2 h-5 w-5 text-green-500" />
                    Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Size</div>
                      <div className="text-green-600 dark:text-green-400 text-xl font-bold">106.6 MB</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Documents</div>
                      <div className="text-green-600 dark:text-green-400 font-bold">71,739</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Indexes</div>
                      <div className="text-green-600 dark:text-green-400 font-bold">19</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Collections Overview */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl">Collections Overview</CardTitle>
                <CardDescription>
                  Quick view of your database collections with key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {collectionStats.map((collection, index) => {
                    const Icon = getCollectionIcon(collection.name)
                    return (
                      <div 
                        key={index} 
                        className="p-4 rounded-lg glass border border-primary/20 hover:bg-card/80 transition-all duration-300 cursor-pointer group"
                        onClick={() => setSelectedCollection(collection.name)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                            {collection.documentCount.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="font-medium group-hover:text-primary transition-colors duration-300">{collection.name}</div>
                        <div className="text-sm text-muted-foreground">{collection.storageSize}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Collections List */}
              <div className="lg:col-span-1">
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Collections</CardTitle>
                    <CardDescription>Click to view details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {schema?.collections.map((collection, index) => {
                        const Icon = getCollectionIcon(collection.name)
                        const stats = collectionStats.find(s => s.name === collection.name)
                        return (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border transition-all duration-300 cursor-pointer group ${
                              selectedCollection === collection.name 
                                ? 'bg-primary/10 border-primary/30' 
                                : 'border-border/50 hover:bg-muted/50'
                            }`}
                            onClick={() => setSelectedCollection(collection.name)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Icon className="h-4 w-4 text-primary" />
                                <div>
                                  <div className="font-medium group-hover:text-primary transition-colors duration-300">
                                    {collection.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {collection.fields.length} fields
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-mono text-primary">
                                  {stats?.documentCount.toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground">docs</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Collection Details */}
              <div className="lg:col-span-2">
                {selectedCollection ? (
                  <Card className="glass border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl">
                        {React.createElement(getCollectionIcon(selectedCollection), { className: "mr-2 h-5 w-5 text-primary" })}
                        {selectedCollection} Collection
                      </CardTitle>
                      <CardDescription>
                        Detailed schema and statistics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {(() => {
                            const stats = collectionStats.find(s => s.name === selectedCollection)
                            return [
                              { label: "Documents", value: stats?.documentCount.toLocaleString(), icon: FileTextIcon },
                              { label: "Avg Size", value: stats?.avgDocSize, icon: HashIcon },
                              { label: "Indexes", value: stats?.indexes.toString(), icon: LayersIcon },
                              { label: "Storage", value: stats?.storageSize, icon: DatabaseIcon }
                            ].map((stat, i) => (
                              <div key={i} className="text-center p-3 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors duration-300">
                                <stat.icon className="h-4 w-4 text-primary mx-auto mb-1" />
                                <div className="text-lg font-bold text-primary">{stat.value}</div>
                                <div className="text-xs text-muted-foreground">{stat.label}</div>
                              </div>
                            ))
                          })()}
                        </div>

                        {/* Fields */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <CodeIcon className="mr-2 h-4 w-4 text-primary" />
                            Schema Fields
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {schema?.collections.find(c => c.name === selectedCollection)?.fields.map((field, i) => (
                              <Badge key={i} variant="outline" className="justify-start border-primary/30 text-primary hover:bg-primary/10 transition-colors duration-300">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="glass border-primary/20">
                    <CardContent className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <TableIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Select a collection to view details</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <div className="grid gap-6">
              {schema?.collections.map((collection, index) => {
                const Icon = getCollectionIcon(collection.name)
                const data = sampleData[collection.name as keyof typeof sampleData] || []
                return (
                  <Card key={index} className="glass border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Icon className="mr-2 h-5 w-5 text-primary" />
                        {collection.name} - Sample Data
                      </CardTitle>
                      <CardDescription>
                        Recent documents from this collection
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {data.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border/50">
                                {Object.keys(data[0]).map((key) => (
                                  <th key={key} className="text-left py-2 px-3 font-medium text-muted-foreground bg-muted/30">
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {data.map((row, i) => (
                                <tr key={i} className="border-b border-border/30 hover:bg-muted/30 transition-colors duration-200">
                                  {Object.values(row).map((value, j) => (
                                    <td key={j} className="py-2 px-3 font-mono text-xs">
                                      <div className="max-w-xs truncate">
                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                      </div>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No sample data available
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <PieChartIcon className="mr-2 h-5 w-5 text-purple-500" />
                    Collection Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collectionStats.map((collection, index) => {
                      const percentage = (collection.documentCount / collectionStats.reduce((sum, c) => sum + c.documentCount, 0) * 100).toFixed(1)
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{collection.name}</span>
                            <span className="text-muted-foreground">{percentage}%</span>
                          </div>
                          <div className="w-full bg-muted/50 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUpIcon className="mr-2 h-5 w-5 text-green-500" />
                    Growth Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10">
                      <span className="text-sm font-medium">New Users (7d)</span>
                      <span className="text-green-600 dark:text-green-400 font-bold">+1,234</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10">
                      <span className="text-sm font-medium">Orders (7d)</span>
                      <span className="text-blue-500 font-bold">+892</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10">
                      <span className="text-sm font-medium">Sessions (7d)</span>
                      <span className="text-purple-500 font-bold">+5,621</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )

  function getCollectionIcon(name: string) {
    switch (name) {
      case 'users': return UserIcon
      case 'orders': return ShoppingCartIcon
      case 'products': return PackageIcon
      case 'sessions': return ActivityIcon
      default: return TableIcon
    }
  }
}