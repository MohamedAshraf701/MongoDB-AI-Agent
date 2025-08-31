"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  DatabaseIcon, 
  ArrowLeftIcon, 
  CheckCircleIcon, 
  AlertCircleIcon,
  BrainIcon,
  ShieldIcon,
  ZapIcon
} from "lucide-react"

type ConnectResponse = {
  ok: boolean
  schema?: {
    dbName: string
    collections: { name: string; fields: string[] }[]
  }
  error?: string
}

export function ConnectPage() {
  const router = useRouter()
  const [uri, setUri] = useState("")
  const [llmUrl, setLlmUrl] = useState("http://localhost:1234/v1")
  const [llmModel, setLlmModel] = useState("openai/gpt-oss-20b")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

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
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      }
    } catch (err: any) {
      setError(err?.message ?? "Connection failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <DatabaseIcon className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold text-white">MongoDB AI Agent</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className={`w-full max-w-4xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Connect Your Database
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Securely connect to your MongoDB instance to start querying with AI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Connection Form */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DatabaseIcon className="mr-2 h-5 w-5 text-purple-400" />
                  Database Connection
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Enter your MongoDB connection details to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleConnect} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="uri" className="text-white">MongoDB URI</Label>
                    <Input
                      id="uri"
                      value={uri}
                      onChange={(e) => setUri(e.target.value)}
                      placeholder="mongodb+srv://user:pass@cluster.mongodb.net/dbname"
                      required
                      type="password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="llmUrl" className="text-white">LLM API URL</Label>
                      <Input
                        id="llmUrl"
                        value={llmUrl}
                        onChange={(e) => setLlmUrl(e.target.value)}
                        placeholder="http://localhost:1234/v1"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="llmModel" className="text-white">LLM Model</Label>
                      <Input
                        id="llmModel"
                        value={llmModel}
                        onChange={(e) => setLlmModel(e.target.value)}
                        placeholder="openai/gpt-oss-20b"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert className="bg-red-500/10 border-red-500/20">
                      <AlertCircleIcon className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-300">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-500/10 border-green-500/20">
                      <CheckCircleIcon className="h-4 w-4 text-green-400" />
                      <AlertDescription className="text-green-300">
                        Connected successfully! Redirecting to dashboard...
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    disabled={loading || success}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                  >
                    {loading ? "Connecting..." : success ? "Connected!" : "Connect Database"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Features Preview */}
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BrainIcon className="mr-2 h-5 w-5 text-purple-400" />
                    AI-Powered Queries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <div className="text-gray-400 mb-2">// Natural language input:</div>
                    <div className="text-green-400">"Show me users who signed up last week"</div>
                    <div className="text-gray-400 mt-4 mb-2">// Generated MongoDB query:</div>
                    <div className="text-blue-400">
                      {`db.users.find({
  createdAt: {
    $gte: new Date('2025-01-06'),
    $lt: new Date('2025-01-13')
  }
})`}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <ShieldIcon className="mr-2 h-5 w-5 text-green-400" />
                    Security First
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                      Read-only operations by default
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                      Query validation & sanitization
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                      No data storage or logging
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <ZapIcon className="mr-2 h-5 w-5 text-yellow-400" />
                    Instant Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Get formatted results in milliseconds with intelligent data visualization 
                    and export capabilities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}