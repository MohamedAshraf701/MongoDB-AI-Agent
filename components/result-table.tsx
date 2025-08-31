import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TableIcon, DownloadIcon } from "lucide-react"
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
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center">
              <TableIcon className="mr-2 h-5 w-5 text-blue-400" />
              Query Results
            </CardTitle>
            <CardDescription className="text-gray-300">
              {rows.length ? `${rows.length} row(s) returned` : "No results yet - ask a question to see data"}
            </CardDescription>
          </div>
          {rows.length > 0 && (
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!rows.length ? (
          <div className="text-center py-12">
            <TableIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <div className="text-gray-400">Ask a question to see results here</div>
          </div>
        ) : (
          <div className="w-full overflow-auto bg-black/20 rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  {columns.map((c) => (
                    <th key={c} className="py-3 px-4 font-medium bg-white/5">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flat.map((r, i) => (
                  <tr key={i} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                    {columns.map((c) => (
                      <td key={c} className="py-3 px-4 align-top text-gray-300 font-mono text-xs">
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
