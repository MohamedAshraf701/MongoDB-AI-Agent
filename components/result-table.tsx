import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Results</CardTitle>
        <CardDescription>{rows.length ? `${rows.length} row(s)` : "No results yet"}</CardDescription>
      </CardHeader>
      <CardContent>
        {!rows.length ? (
          <div className="text-sm text-muted-foreground">Ask a question to see results here.</div>
        ) : (
          <div className="w-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  {columns.map((c) => (
                    <th key={c} className="py-2 pr-4 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flat.map((r, i) => (
                  <tr key={i} className="border-t">
                    {columns.map((c) => (
                      <td key={c} className="py-2 pr-4 align-top">
                        {(r as any)[c] ?? ""}
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
