import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TableIcon, DownloadIcon, DatabaseIcon, FileTextIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

function normalizeRows(rows: any[]): any[] {
  return rows.map((r) => {
    if (r == null || typeof r !== "object") return { value: r }
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(r)) {
      if (v != null && typeof v === "object") {
        try {
          out[k] = JSON.stringify(v)
        } catch {
          out[k] = String(v)
        }
      } else {
        out[k] = v as any
      }
    }
    return out
  })
}

export function ResultTable({ rows }: { rows: any[] }) {
  const flat = normalizeRows(rows)
  const columns = Array.from(
    flat.reduce((set, r) => {
      Object.keys(r).forEach((k) => set.add(k))
      return set
    }, new Set<string>()),
  )

  return (
    <Card className="glass border-primary/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-xl">
              <TableIcon className="mr-2 h-6 w-6 text-primary" />
              Query Results
            </CardTitle>
            <CardDescription className="text-base">
              {rows.length ? (
                <div className="flex items-center space-x-2">
                  <FileTextIcon className="h-4 w-4 text-primary" />
                  <span>{rows.length} row(s) returned</span>
                </div>
              ) : (
                "No results yet - ask a question to see data"
              )}
            </CardDescription>
          </div>
          {rows.length > 0 && (
            <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!rows.length ? (
          <div className="text-center py-12">
            <div className="relative">
              <DatabaseIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-float" />
              <div className="absolute inset-0 h-12 w-12 text-muted-foreground/30 animate-ping mx-auto" />
            </div>
            <div className="text-muted-foreground">Ask a question to see results here</div>
          </div>
        ) : (
          <div className="w-full overflow-auto glass rounded-lg border border-primary/20">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border/50">
                  {columns.map((c) => (
                    <th key={c} className="py-3 px-4 font-medium bg-muted/30">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flat.map((r, i) => (
                  <tr key={i} className="border-t border-border/30 hover:bg-muted/30 transition-colors duration-200">
                    {columns.map((c) => (
                      <td key={c} className="py-3 px-4 align-top font-mono text-xs">
                        <div className="max-w-xs truncate">
                          {(r as any)[c] ?? ""}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
