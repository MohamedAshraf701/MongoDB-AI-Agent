"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BrainIcon, SendIcon, SparklesIcon, ZapIcon, ShieldIcon, LoaderIcon } from "lucide-react"

type QueryResult = {
  rows: any[]
  meta?: { executedAt?: string; type?: string }
}

type Plan = {
  action: string
  collection: string
  [key: string]: any
}

export function ChatPanel({
  disabled,
  onResult,
}: {
  disabled?: boolean
  onResult: (res: QueryResult) => void
}) {
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [progress, setProgress] = useState(0)

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault()
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    setProgress(0)
    try {
      setProgress(25)
      // First get the plan
      const planRes = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      })
      if (!planRes.ok) {
        const err = await planRes.json().catch(() => ({}))
        throw new Error(err?.error ?? "Failed to get query plan")
      }
      const planData = await planRes.json()
      const plan = planData.plan as Plan

      setProgress(50)

      // Check if this is a write operation that needs confirmation
      if (plan.action === "update" || plan.action === "delete") {
        setPendingPlan(plan)
        setShowConfirmation(true)
        setLoading(false)
        return
      }

      // For read operations, execute immediately
      setProgress(75)
      await executePlan(plan)
    } catch (err: any) {
      setError(err?.message ?? "Query failed")
      setLoading(false)
    }
  }

  async function executePlan(plan: Plan) {
    setLoading(true)
    setProgress(75)
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, plan }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error ?? "Query failed")
      }
      const data = (await res.json()) as QueryResult
      setProgress(100)
      onResult(data)
    } catch (err: any) {
      setError(err?.message ?? "Query failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass border-primary/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <BrainIcon className="mr-2 h-6 w-6 text-primary" />
          AI Query Assistant
        </CardTitle>
        <CardDescription className="text-base">
          Ask questions in natural language. Write operations require confirmation for safety.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAsk} className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse-glow">
              <SparklesIcon className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
            <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
              <ShieldIcon className="w-3 h-3 mr-1" />
              Safe Mode
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">
              <ZapIcon className="w-3 h-3 mr-1" />
              Real-time
            </Badge>
          </div>
          
          {loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing query...</span>
                <span className="text-primary font-mono">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <Textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g., How many users signed up last week? Or: Update all inactive users to active status"
            disabled={disabled || loading}
            rows={3}
            className="resize-none text-base transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
          {error ? (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3 animate-in slide-in-from-top-2">
              {error}
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <Button 
              type="submit" 
              disabled={disabled || loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SendIcon className="mr-2 h-4 w-4" />
              )}
              {loading ? "Processing..." : "Ask AI"}
            </Button>
            {disabled ? <span className="text-sm text-muted-foreground">Connect to a database first.</span> : null}
          </div>
        </form>
      </CardContent>

      {/* Confirmation Dialog for Write Operations */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="glass border-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm {pendingPlan?.action === "update" ? "Update" : "Delete"} Operation
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to {pendingPlan?.action === "update" ? "update" : "delete"} documents in the{" "}
              <strong>{pendingPlan?.collection}</strong> collection.
              {pendingPlan?.action === "update" && (
                <>
                  <br />
                  <strong>Filter:</strong> {JSON.stringify(pendingPlan?.filter || {}, null, 2)}
                  <br />
                  <strong>Update:</strong> {JSON.stringify(pendingPlan?.update || {}, null, 2)}
                </>
              )}
              {pendingPlan?.action === "delete" && (
                <>
                  <br />
                  <strong>Filter:</strong> {JSON.stringify(pendingPlan?.filter || {}, null, 2)}
                  <br />
                  <strong>Limit:</strong> {pendingPlan?.limit || 1} document(s)
                </>
              )}
              <br />
              <br />
              This action cannot be undone. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowConfirmation(false)
              setPendingPlan(null)
            }} className="border-border hover:bg-muted/50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (pendingPlan) {
                  await executePlan(pendingPlan)
                  setShowConfirmation(false)
                  setPendingPlan(null)
                }
              }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {pendingPlan?.action === "update" ? "Update" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
