"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import { BrainIcon, SendIcon, SparklesIcon } from "lucide-react"

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

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault()
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    try {
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

      // Check if this is a write operation that needs confirmation
      if (plan.action === "update" || plan.action === "delete") {
        setPendingPlan(plan)
        setShowConfirmation(true)
        setLoading(false)
        return
      }

      // For read operations, execute immediately
      await executePlan(plan)
    } catch (err: any) {
      setError(err?.message ?? "Query failed")
      setLoading(false)
    }
  }

  async function executePlan(plan: Plan) {
    setLoading(true)
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
      onResult(data)
    } catch (err: any) {
      setError(err?.message ?? "Query failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <BrainIcon className="mr-2 h-5 w-5 text-purple-400" />
          AI Query Assistant
        </CardTitle>
        <CardDescription className="text-gray-300">
          Ask questions in natural language. Write operations require confirmation for safety.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAsk} className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <SparklesIcon className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              Safe Mode
            </Badge>
          </div>
          <Textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g., How many users signed up last week? Or: Update all inactive users to active status"
            disabled={disabled || loading}
            rows={3}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
          />
          {error ? <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md p-3">{error}</div> : null}
          <div className="flex items-center gap-2">
            <Button 
              type="submit" 
              disabled={disabled || loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <SendIcon className="mr-2 h-4 w-4" />
              {loading ? "Thinking..." : "Ask"}
            </Button>
            {disabled ? <span className="text-sm text-gray-400">Connect to a database first.</span> : null}
          </div>
        </form>
      </CardContent>

      {/* Confirmation Dialog for Write Operations */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="bg-slate-900 border-white/20 text-white">
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
            }} className="border-white/20 text-white hover:bg-white/10">
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
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {pendingPlan?.action === "update" ? "Update" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
