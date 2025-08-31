"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
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
  SearchIcon,
  ServerIcon,
  LayersIcon,
  TrendingUpIcon,
  UsersIcon,
  BarChart3Icon,
  LockIcon,
  RocketIcon,
  CheckCircleIcon
} from "lucide-react"

export function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: BrainIcon,
      title: "AI-Powered Queries",
      description: "Convert natural language questions into optimized MongoDB queries automatically with advanced AI understanding",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: ShieldCheckIcon,
      title: "Enterprise Security",
      description: "Built-in safety checks prevent dangerous operations and protect your data with military-grade security",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: ZapIcon,
      title: "Lightning Fast",
      description: "Get instant results with optimized query execution, smart caching, and real-time performance monitoring",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: CodeIcon,
      title: "Developer Friendly",
      description: "Clean APIs, comprehensive documentation, and seamless integration with your existing development workflow",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: DatabaseIcon,
      title: "Schema Discovery",
      description: "Automatically analyze your database structure for intelligent query suggestions and data insights",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: TerminalIcon,
      title: "Real-time Results",
      description: "Interactive result tables with export capabilities, data visualization, and collaborative sharing",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <DatabaseIcon className="h-8 w-8 text-primary animate-pulse-glow" />
                <div className="absolute inset-0 h-8 w-8 text-primary/30 animate-ping" />
              </div>
              <span className="text-xl font-bold gradient-text">MongoDB AI Agent</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors duration-300">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors duration-300">How it Works</a>
              <a href="#security" className="text-muted-foreground hover:text-primary transition-colors duration-300">Security</a>
              <a href="#use-cases" className="text-muted-foreground hover:text-primary transition-colors duration-300">Use Cases</a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors duration-300">Pricing</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors duration-300">Reviews</a>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/connect">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-green-500/10 animate-gradient" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 animate-float">
              <SparklesIcon className="w-4 h-4 mr-2" />
              AI-Powered Database Queries
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Query MongoDB with
              <span className="gradient-text block mt-2"> Natural Language</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your database interactions with AI. Ask questions in plain English and get instant, 
              secure MongoDB queries with intelligent results visualization and real-time analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/connect">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow">
                  <TerminalIcon className="mr-2 h-5 w-5" />
                  Start Querying Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-4 text-lg transition-all duration-300">
                <SearchIcon className="mr-2 h-5 w-5" />
                View Live Demo
              </Button>
            </div>
            
            {/* Code Preview */}
            <div className="max-w-4xl mx-auto">
              <div className="glass rounded-xl p-6 text-left">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Live Example
                  </Badge>
                </div>
                <div className="code-block">
                  <div className="text-gray-400 mb-2">// Natural language input:</div>
                  <div className="text-green-400 mb-4">"Show me users who signed up last week and are still active"</div>
                  <div className="text-gray-400 mb-2">// Generated MongoDB query:</div>
                  <div className="text-blue-400 overflow-hidden">
                    <div className="animate-code-typing">
{`db.users.find({
  createdAt: {
    $gte: new Date('2025-01-06'),
    $lt: new Date('2025-01-13')
  },
  status: "active"
}).sort({ createdAt: -1 })`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powerful Features for Modern Developers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to interact with MongoDB databases using natural language and AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`glass hover:bg-card/80 transition-all duration-500 group cursor-pointer transform hover:scale-105 ${
                  activeFeature === index ? 'ring-2 ring-primary shadow-xl' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardHeader>
                  <div className={`h-12 w-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start querying your MongoDB database with AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Database",
                description: "Securely connect to your MongoDB instance with your connection string. We automatically discover your schema and collections.",
                icon: DatabaseIcon,
                color: "text-primary"
              },
              {
                step: "02", 
                title: "Ask Questions",
                description: "Type your questions in natural language - no MongoDB syntax required. Our AI understands complex queries and relationships.",
                icon: BrainIcon,
                color: "text-green-500"
              },
              {
                step: "03",
                title: "Get Results",
                description: "Receive formatted results with the option to see the generated query, export data, and visualize insights.",
                icon: ZapIcon,
                color: "text-yellow-500"
              }
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 animate-pulse-glow">
                    {step.step}
                  </div>
                  <div className={`h-12 w-12 ${step.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {index < 2 && (
                  <ChevronRightIcon className="hidden md:block absolute top-8 -right-4 h-8 w-8 text-primary/50 group-hover:text-primary transition-colors duration-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Enterprise-Grade Security
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Your data security is our top priority. We've built comprehensive safeguards 
                to ensure your database remains protected while providing powerful AI capabilities.
              </p>
              <div className="space-y-4">
                {[
                  "Read-only operations by default",
                  "Advanced query validation and sanitization", 
                  "Rate limiting and abuse prevention",
                  "Zero data storage or logging policy",
                  "End-to-end encrypted connections",
                  "SOC 2 Type II compliance ready"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="bg-green-500/20 p-1 rounded-full group-hover:bg-green-500/30 transition-colors duration-300">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="group-hover:text-primary transition-colors duration-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-xl p-8 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    <LockIcon className="w-3 h-3 mr-1" />
                    Secure
                  </Badge>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Real-time Validation
                  </Badge>
                </div>
                <pre className="text-green-400 text-sm font-mono">
{`// Query validation pipeline
const plan = await validateQuery({
  question: "Show me all users",
  schema: dbSchema,
  safety: "enterprise",
  permissions: userRoles
});

// ✅ Safe operations allowed
// ❌ Dangerous operations blocked  
// 🔒 Data always protected
// 📊 Audit trail maintained`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Perfect for Every Developer
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're debugging, analyzing data, or building features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Data Analysis & Insights",
                description: "Quickly explore your data without writing complex aggregation pipelines or learning MongoDB syntax",
                examples: ["Find top performing products by region", "Analyze user behavior patterns over time", "Generate comprehensive usage reports"],
                icon: BarChart3Icon,
                color: "text-blue-500"
              },
              {
                title: "Debugging & Monitoring", 
                description: "Investigate issues and monitor your application's data in real-time with intelligent error detection",
                examples: ["Check error rates by geographic region", "Find problematic user sessions quickly", "Monitor data quality and consistency"],
                icon: ServerIcon,
                color: "text-red-500"
              },
              {
                title: "Business Intelligence",
                description: "Get actionable insights from your data without complex BI tools or expensive analytics platforms",
                examples: ["Revenue trends and forecasting", "Customer segmentation analysis", "Performance metrics dashboard"],
                icon: TrendingUpIcon,
                color: "text-green-500"
              },
              {
                title: "Development & Testing",
                description: "Speed up development with instant data exploration capabilities and automated testing support",
                examples: ["Validate data migrations safely", "Test query performance optimization", "Explore new features and schemas"],
                icon: RocketIcon,
                color: "text-purple-500"
              }
            ].map((useCase, index) => (
              <Card key={index} className="glass hover:bg-card/80 transition-all duration-500 group">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`h-10 w-10 bg-${useCase.color.split('-')[1]}-500/20 rounded-lg flex items-center justify-center`}>
                      <useCase.icon className={`h-5 w-5 ${useCase.color}`} />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{useCase.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {useCase.examples.map((example, i) => (
                      <li key={i} className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        <ChevronRightIcon className="h-4 w-4 text-primary mr-2" />
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
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees, no surprises.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Developer",
                price: "$0",
                description: "Perfect for getting started",
                features: ["100 queries/month", "Basic schema discovery", "Community support", "Standard security", "Export to CSV/JSON"],
                cta: "Start Free",
                popular: false,
                color: "border-border"
              },
              {
                name: "Professional",
                price: "$29",
                description: "For professional developers",
                features: ["10,000 queries/month", "Advanced analytics dashboard", "Priority support", "Custom LLM models", "Team collaboration", "API access"],
                cta: "Start Pro Trial",
                popular: true,
                color: "border-primary ring-2 ring-primary/20"
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations",
                features: ["Unlimited queries", "On-premise deployment", "24/7 dedicated support", "Custom integrations", "SLA guarantee", "Advanced security"],
                cta: "Contact Sales",
                popular: false,
                color: "border-border"
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative glass hover:bg-card/80 transition-all duration-500 group ${plan.color} ${plan.popular ? 'scale-105 shadow-xl' : 'hover:scale-105'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground animate-pulse-glow">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold">
                    {plan.price}
                    {plan.price !== "Custom" && <span className="text-lg text-muted-foreground">/month</span>}
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center group-hover:text-foreground transition-colors duration-300">
                        <CheckCircleIcon className="h-4 w-4 text-primary mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'} transition-all duration-300`}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by Developers Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what developers are saying about MongoDB AI Agent
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Senior Backend Developer",
                company: "TechCorp",
                content: "This tool has revolutionized how we interact with our MongoDB databases. What used to take hours of writing complex queries now takes seconds.",
                avatar: "SC"
              },
              {
                name: "Marcus Rodriguez",
                role: "Data Engineer",
                company: "DataFlow Inc",
                content: "The AI understands context incredibly well. It's like having a MongoDB expert on the team 24/7. The security features give us peace of mind.",
                avatar: "MR"
              },
              {
                name: "Emily Watson",
                role: "Full Stack Developer",
                company: "StartupXYZ",
                content: "Game changer for our startup. We can now analyze our data without hiring a dedicated data analyst. The natural language interface is intuitive.",
                avatar: "EW"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="glass hover:bg-card/80 transition-all duration-500 group">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold group-hover:text-primary transition-colors duration-300">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-green-500/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your Database Workflow?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of developers who are already using AI to query their databases more efficiently and securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/connect">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow">
                Get Started Now
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 px-12 py-4 text-lg transition-all duration-300">
              Schedule Demo
              <UsersIcon className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <DatabaseIcon className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold gradient-text">MongoDB AI Agent</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
                The most intuitive way to interact with your MongoDB databases using natural language and AI. 
                Built by developers, for developers.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  <GithubIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  <TwitterIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  <LinkedinIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Documentation", "API Reference", "Changelog", "Roadmap"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Contact", "Privacy", "Terms"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2025 MongoDB AI Agent. All rights reserved. Built with ❤️ for the developer community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}