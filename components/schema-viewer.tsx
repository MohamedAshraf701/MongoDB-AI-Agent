import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type SchemaSummary = {
  dbName: string
  collections: { name: string; fields: string[] }[]
} | null

export function SchemaViewer({ schema }: { schema: SchemaSummary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Schema</CardTitle>
        <CardDescription>Collections and sampled fields</CardDescription>
      </CardHeader>
      <CardContent>
        {!schema ? (
          <div className="text-sm text-muted-foreground">No schema yet. Connect to a database to load schema.</div>
        ) : schema.collections.length === 0 ? (
          <div className="text-sm text-muted-foreground">No collections found.</div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {schema.collections.map((c) => (
              <AccordionItem key={c.name} value={c.name}>
                <AccordionTrigger className="text-left">{c.name}</AccordionTrigger>
                <AccordionContent>
                  <ul className="text-sm grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                    {c.fields.map((f) => (
                      <li key={f} className="text-muted-foreground">
                        {f}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}
