"use client"

import { useState } from "react"
import { Plus, Search, Clock, AlertTriangle, CheckCircle2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Prazo {
  id: string; descricao: string; processo: string; cliente: string; dataVencimento: string; prioridade: "alta" | "media" | "baixa"; status: "aberto" | "vencido" | "cumprido"
}

const MOCK: Prazo[] = [
  { id: "1", descricao: "Contestação - Prazo Final", processo: "0001234-56.2026", cliente: "Carlos Alberto Silva", dataVencimento: "20/09/2026", prioridade: "alta", status: "aberto" },
  { id: "2", descricao: "Apresentação de Documentos", processo: "0005678-90.2025", cliente: "Tech Solutions Ltda", dataVencimento: "10/07/2026", prioridade: "media", status: "aberto" },
  { id: "3", descricao: "Recurso - 2ª Instância", processo: "0009012-34.2026", cliente: "Mariana Costa Oliveira", dataVencimento: "15/08/2026", prioridade: "alta", status: "aberto" },
  { id: "4", descricao: "Audiência de Conciliação", processo: "0001112-13.2025", cliente: "Ana Paula dos Santos", dataVencimento: "15/06/2026", prioridade: "alta", status: "vencido" },
  { id: "5", descricao: "Protocolo de Petição", processo: "0003456-78.2025", cliente: "Roberto Mendes Dias", dataVencimento: "30/01/2026", prioridade: "baixa", status: "cumprido" },
]

export default function PrazosPage() {
  const [prazos] = useState(MOCK)
  const [search, setSearch] = useState("")

  const filtered = prazos.filter((p) => !search.trim() || p.descricao.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-law-navy dark:text-white font-serif">Prazos</h1>
          <p className="text-law-slate dark:text-white/60 text-sm mt-1">Acompanhe os prazos processuais</p>
        </div>
        <Button className="bg-law-navy hover:bg-law-navy/90 text-white gap-2"><Plus className="w-4 h-4" />Novo Prazo</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Abertos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif">{prazos.filter((p) => p.status === "aberto").length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Vencidos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-red-500">{prazos.filter((p) => p.status === "vencido").length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Cumpridos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-green-600">{prazos.filter((p) => p.status === "cumprido").length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Urgentes</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-amber-600">{prazos.filter((p) => p.prioridade === "alta" && p.status === "aberto").length}</p></CardContent></Card>
      </div>
      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-law-slate" /><Input placeholder="Buscar prazos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Descrição</TableHead><TableHead className="hidden md:table-cell">Processo</TableHead><TableHead className="hidden md:table-cell">Vencimento</TableHead><TableHead>Prioridade</TableHead><TableHead>Status</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell><div className="flex items-center gap-2">{p.prioridade === "alta" ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <Clock className="w-4 h-4 text-law-slate" />}<span className="font-medium">{p.descricao}</span></div></TableCell>
                <TableCell className="hidden md:table-cell font-mono text-xs">{p.processo}</TableCell>
                <TableCell className="hidden md:table-cell">{p.dataVencimento}</TableCell>
                <TableCell><Badge className={p.prioridade === "alta" ? "bg-red-100 text-red-700" : p.prioridade === "media" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}>{p.prioridade === "alta" ? "Alta" : p.prioridade === "media" ? "Média" : "Baixa"}</Badge></TableCell>
                <TableCell><Badge className={p.status === "aberto" ? "bg-blue-100 text-blue-700" : p.status === "vencido" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}>{p.status === "aberto" ? "Aberto" : p.status === "vencido" ? "Vencido" : "Cumprido"}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
