"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ask a question</CardTitle>
        <CardDescription>We'll generate a safe plan and run it. Write operations require confirmation.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAsk} className="space-y-3">
          <Textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g., How many users signed up last week? Or: Update all inactive users to active status"
            disabled={disabled || loading}
            rows={3}
          />
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={disabled || loading}>
              {loading ? "Thinking..." : "Ask"}
            </Button>
            {disabled ? <span className="text-sm text-muted-foreground">Connect to a database first.</span> : null}
          </div>
        </form>
      </CardContent>

      {/* Confirmation Dialog for Write Operations */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
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
            }}>
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
              className="bg-red-600 hover:bg-red-700"
            >
              {pendingPlan?.action === "update" ? "Update" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
