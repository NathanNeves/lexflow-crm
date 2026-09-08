import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Construction } from "lucide-react"

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="law-heading text-2xl font-bold capitalize">reports</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Módulo em implementação — em breve disponível
        </p>
      </div>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
          <Construction size={48} className="text-muted-foreground/40" />
          <CardTitle className="text-lg text-muted-foreground">Em Construção</CardTitle>
          <CardDescription>
            Este módulo está sendo desenvolvido e ficará disponível nos próximos sprints.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
