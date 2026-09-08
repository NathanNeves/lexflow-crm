"use client"

import { BarChart3, LineChart, PieChart, Download, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const relatorios = [
  { icon: BarChart3, titulo: "Desempenho Financeiro", desc: "Receitas, despesas e inadimplência do período", cor: "text-green-500" },
  { icon: LineChart, titulo: "Andamento de Processos", desc: "Distribuição por status e área de atuação", cor: "text-blue-500" },
  { icon: PieChart, titulo: "Carteira de Clientes", desc: "Distribuição por tipo, segmento e ticket médio", cor: "text-law-gold" },
  { icon: BarChart3, titulo: "Produtividade da Equipe", desc: "Processos por advogado e cumprimento de prazos", cor: "text-purple-500" },
  { icon: LineChart, titulo: "Prazos e Vencimentos", desc: "Calendário de prazos e taxas de cumprimento", cor: "text-red-500" },
]

export default function RelatoriosPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-law-navy dark:text-white font-serif">Relatórios</h1>
          <p className="text-law-slate dark:text-white/60 text-sm mt-1">Relatórios gerenciais do escritório</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="2026">
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="trimestre">
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="trimestre">Último Trimestre</SelectItem>
              <SelectItem value="semestre">Último Semestre</SelectItem>
              <SelectItem value="ano">Último Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Exportar</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatorios.map((r) => (
          <Card key={r.titulo} className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-law-navy/10 dark:bg-law-gold/20">
                  <r.icon className={`w-5 h-5 ${r.cor}`} />
                </div>
                <CardTitle className="text-base font-serif">{r.titulo}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{r.desc}</CardDescription>
              <div className="flex items-center gap-1 text-sm text-law-navy dark:text-law-gold font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                Visualizar <ChevronRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
