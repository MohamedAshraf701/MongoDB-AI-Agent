"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DatabaseIcon, 
  BrainIcon, 
  ShieldCheckIcon, 
  ZapIcon, 
  CodeIcon, 
  ArrowRightIcon,
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  ChevronRightIcon,
  SparklesIcon,
  TerminalIcon,
  SearchIcon
} from "lucide-react"

export function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <DatabaseIcon className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold text-white">MongoDB AI Agent</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
              <a href="#security" className="text-gray-300 hover:text-white transition-colors">Security</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            </div>
            <Link href="/connect">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Get Started
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-pink-800/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <SparklesIcon className="w-4 h-4 mr-2" />
              AI-Powered Database Queries
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Query MongoDB with
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Natural Language</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your database interactions with AI. Ask questions in plain English and get instant, 
              secure MongoDB queries with intelligent results visualization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/connect">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
                  <TerminalIcon className="mr-2 h-5 w-5" />
                  Start Querying
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg">
                <SearchIcon className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Powerful Features for Developers
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to interact with MongoDB databases using natural language
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BrainIcon,
                title: "AI-Powered Queries",
                description: "Convert natural language questions into optimized MongoDB queries automatically",
                color: "text-purple-400"
              },
              {
                icon: ShieldCheckIcon,
                title: "Enterprise Security",
                description: "Built-in safety checks prevent dangerous operations and protect your data",
                color: "text-green-400"
              },
              {
                icon: ZapIcon,
                title: "Lightning Fast",
                description: "Get instant results with optimized query execution and smart caching",
                color: "text-yellow-400"
              },
              {
                icon: CodeIcon,
                title: "Developer Friendly",
                description: "Clean APIs, comprehensive docs, and seamless integration with your workflow",
                color: "text-blue-400"
              },
              {
                icon: DatabaseIcon,
                title: "Schema Discovery",
                description: "Automatically analyze your database structure for intelligent query suggestions",
                color: "text-pink-400"
              },
              {
                icon: TerminalIcon,
                title: "Real-time Results",
                description: "Interactive result tables with export capabilities and data visualization",
                color: "text-cyan-400"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <CardHeader>
                  <feature.icon className={`h-12 w-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Three simple steps to start querying your MongoDB database with AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Database",
                description: "Securely connect to your MongoDB instance with your connection string",
                icon: DatabaseIcon
              },
              {
                step: "02", 
                title: "Ask Questions",
                description: "Type your questions in natural language - no MongoDB syntax required",
                icon: BrainIcon
              },
              {
                step: "03",
                title: "Get Results",
                description: "Receive formatted results with the option to see the generated query",
                icon: ZapIcon
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6">
                    {step.step}
                  </div>
                  <step.icon className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.description}</p>
                </div>
                {index < 2 && (
                  <ChevronRightIcon className="hidden md:block absolute top-8 -right-4 h-8 w-8 text-purple-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Enterprise-Grade Security
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Your data security is our top priority. We've built comprehensive safeguards 
                to ensure your database remains protected while providing powerful AI capabilities.
              </p>
              <div className="space-y-4">
                {[
                  "Read-only operations by default",
                  "Query validation and sanitization", 
                  "Rate limiting and abuse prevention",
                  "No data storage or logging",
                  "Encrypted connections only"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <ShieldCheckIcon className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-lg p-8 backdrop-blur-sm border border-white/10">
                <pre className="text-green-400 text-sm font-mono">
{`// Query validation example
const plan = await validateQuery({
  question: "Show me all users",
  schema: dbSchema,
  safety: "strict"
});

// ✅ Safe operations allowed
// ❌ Dangerous operations blocked
// 🔒 Data always protected`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Perfect for Every Developer
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Whether you're debugging, analyzing data, or building features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Data Analysis",
                description: "Quickly explore your data without writing complex aggregation pipelines",
                examples: ["Find top performing products", "Analyze user behavior patterns", "Generate usage reports"]
              },
              {
                title: "Debugging & Monitoring", 
                description: "Investigate issues and monitor your application's data in real-time",
                examples: ["Check error rates by region", "Find problematic user sessions", "Monitor data quality"]
              },
              {
                title: "Business Intelligence",
                description: "Get insights from your data without complex BI tools",
                examples: ["Revenue trends analysis", "Customer segmentation", "Performance metrics"]
              },
              {
                title: "Development & Testing",
                description: "Speed up development with instant data exploration capabilities",
                examples: ["Validate data migrations", "Test query performance", "Explore new features"]
              }
            ].map((useCase, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-xl">{useCase.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-base">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {useCase.examples.map((example, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <ChevronRightIcon className="h-4 w-4 text-purple-400 mr-2" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Start free, scale as you grow
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for getting started",
                features: ["100 queries/month", "Basic schema discovery", "Community support", "Standard security"],
                cta: "Start Free",
                popular: false
              },
              {
                name: "Pro",
                price: "$29",
                description: "For professional developers",
                features: ["10,000 queries/month", "Advanced analytics", "Priority support", "Custom LLM models", "Team collaboration"],
                cta: "Start Pro Trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations",
                features: ["Unlimited queries", "On-premise deployment", "24/7 support", "Custom integrations", "SLA guarantee"],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 ${plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-white">
                    {plan.price}
                    {plan.price !== "Custom" && <span className="text-lg text-gray-400">/month</span>}
                  </div>
                  <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <ChevronRightIcon className="h-4 w-4 text-purple-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white/10 hover:bg-white/20'} text-white`}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Database Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers who are already using AI to query their databases more efficiently.
          </p>
          <Link href="/connect">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 text-lg">
              Get Started Now
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <DatabaseIcon className="h-8 w-8 text-purple-400" />
                <span className="text-xl font-bold text-white">MongoDB AI Agent</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                The most intuitive way to interact with your MongoDB databases using natural language and AI.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <GithubIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <TwitterIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <LinkedinIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Documentation", "API Reference"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 MongoDB AI Agent. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}