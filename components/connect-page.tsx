"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  DatabaseIcon, 
  ArrowLeftIcon, 
  CheckCircleIcon, 
  AlertCircleIcon,
  BrainIcon,
  ShieldIcon,
  ZapIcon,
  ServerIcon,
  KeyIcon,
  PlayIcon
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
  const [step, setStep] = useState(1)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setStep(2)
    
    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uri, llmUrl, llmModel }),
      })
      const data: ConnectResponse = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to connect")
        setStep(1)
      } else {
        setSuccess(true)
        setStep(3)
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    } catch (err: any) {
      setError(err?.message ?? "Connection failed")
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <DatabaseIcon className="h-8 w-8 text-primary animate-pulse-glow" />
              <span className="text-xl font-bold gradient-text">MongoDB AI Agent</span>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className={`w-full max-w-6xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Connect Your Database
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Securely connect to your MongoDB instance to start querying with AI
            </p>
            
            {/* Progress Steps */}
            <div className="flex justify-center mt-8 mb-8">
              <div className="flex items-center space-x-4">
                {[
                  { num: 1, label: "Configure", icon: KeyIcon },
                  { num: 2, label: "Connect", icon: ServerIcon },
                  { num: 3, label: "Ready", icon: PlayIcon }
                ].map((s, i) => (
                  <div key={i} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ${
                      step >= s.num 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : 'border-border text-muted-foreground'
                    }`}>
                      {step > s.num ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : (
                        <s.icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className={`ml-2 text-sm font-medium transition-colors duration-300 ${
                      step >= s.num ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {s.label}
                    </span>
                    {i < 2 && (
                      <div className={`w-8 h-0.5 mx-4 transition-colors duration-500 ${
                        step > s.num ? 'bg-primary' : 'bg-border'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Connection Form */}
            <Card className="glass border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <DatabaseIcon className="mr-2 h-6 w-6 text-primary" />
                  Database Connection
                </CardTitle>
                <CardDescription className="text-base">
                  Enter your MongoDB connection details to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleConnect} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="uri" className="text-base font-medium">MongoDB URI</Label>
                    <Input
                      id="uri"
                      value={uri}
                      onChange={(e) => setUri(e.target.value)}
                      placeholder="mongodb+srv://user:pass@cluster.mongodb.net/dbname"
                      required
                      type="password"
                      className="h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="llmUrl" className="text-base font-medium">LLM API URL</Label>
                      <Input
                        id="llmUrl"
                        value={llmUrl}
                        onChange={(e) => setLlmUrl(e.target.value)}
                        placeholder="http://localhost:1234/v1"
                        className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="llmModel" className="text-base font-medium">LLM Model</Label>
                      <Input
                        id="llmModel"
                        value={llmModel}
                        onChange={(e) => setLlmModel(e.target.value)}
                        placeholder="openai/gpt-oss-20b"
                        className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert className="bg-destructive/10 border-destructive/20 animate-in slide-in-from-top-2">
                      <AlertCircleIcon className="h-4 w-4 text-destructive" />
                      <AlertDescription className="text-destructive">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-500/10 border-green-500/20 animate-in slide-in-from-top-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-600 dark:text-green-400">
                        Connected successfully! Redirecting to dashboard...
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    disabled={loading || success}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        Connecting...
                      </div>
                    ) : success ? (
                      "Connected!"
                    ) : (
                      "Connect Database"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Features Preview */}
            <div className="space-y-6">
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BrainIcon className="mr-2 h-5 w-5 text-primary" />
                    AI-Powered Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="code-block">
                    <div className="text-gray-400 mb-2">// Natural language input:</div>
                    <div className="text-green-400 mb-4">"Show me users who signed up last week"</div>
                    <div className="text-gray-400 mb-2">// Generated MongoDB query:</div>
                    <div className="text-blue-400">
                      {`db.users.find({
  createdAt: {
    $gte: new Date('2025-01-06'),
    $lt: new Date('2025-01-13')
  }
}).sort({ createdAt: -1 })`}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <ShieldIcon className="mr-2 h-5 w-5 text-green-500" />
                    Security First
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Read-only operations by default",
                      "Query validation & sanitization",
                      "No data storage or logging",
                      "Encrypted connections only"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center group">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-3" />
                        <span className="group-hover:text-primary transition-colors duration-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <ZapIcon className="mr-2 h-5 w-5 text-yellow-500" />
                    Instant Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Get formatted results in milliseconds with intelligent data visualization, 
                    export capabilities, and real-time performance monitoring.
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