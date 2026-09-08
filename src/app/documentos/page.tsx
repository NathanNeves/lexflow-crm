"use client"

import { useState } from "react"
import { Plus, Search, FileText, FolderOpen, Download, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Documento {
  id: string; nome: string; tipo: string; cliente: string; processo: string; tamanho: string; data: string
}

const MOCK: Documento[] = [
  { id: "1", nome: "Petição Inicial - Reclamação Trabalhista.docx", tipo: "Petição", cliente: "Carlos Alberto Silva", processo: "0001234-56.2026", tamanho: "245 KB", data: "15/03/2026" },
  { id: "2", nome: "Procuração - Tech Solutions.pdf", tipo: "Procuração", cliente: "Tech Solutions Ltda", processo: "0005678-90.2025", tamanho: "1.2 MB", data: "02/11/2025" },
  { id: "3", nome: "Contrato Social - Nova Era.pdf", tipo: "Contrato", cliente: "Construtora Nova Era S.A.", processo: "0007890-12.2026", tamanho: "3.4 MB", data: "18/02/2026" },
  { id: "4", nome: "Sentença - Ação Indenizatória.pdf", tipo: "Sentença", cliente: "Roberto Mendes Dias", processo: "0003456-78.2025", tamanho: "890 KB", data: "30/01/2026" },
  { id: "5", nome: "Ata de Mediação.docx", tipo: "Ata", cliente: "Mariana Costa Oliveira", processo: "0009012-34.2026", tamanho: "156 KB", data: "20/02/2026" },
]

export default function DocumentosPage() {
  const [docs] = useState(MOCK)
  const [search, setSearch] = useState("")

  const filtered = docs.filter((d) => !search.trim() || d.nome.toLowerCase().includes(search.toLowerCase()) || d.cliente.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-law-navy dark:text-white font-serif">Documentos</h1>
          <p className="text-law-slate dark:text-white/60 text-sm mt-1">Gerencie os documentos e arquivos do escritório</p>
        </div>
        <Button className="bg-law-navy hover:bg-law-navy/90 text-white gap-2"><Plus className="w-4 h-4" />Upload</Button>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-law-slate" />
        <Input placeholder="Buscar documentos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><FolderOpen className="w-8 h-8 text-law-gold" /><div><p className="text-2xl font-bold font-serif">{docs.length}</p><p className="text-sm text-law-slate">Total de Documentos</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><FileText className="w-8 h-8 text-blue-500" /><div><p className="text-2xl font-bold font-serif">{docs.filter((d) => d.tipo === "Petição").length}</p><p className="text-sm text-law-slate">Petições</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><Download className="w-8 h-8 text-green-500" /><div><p className="text-2xl font-bold font-serif">5.9 MB</p><p className="text-sm text-law-slate">Armazenamento</p></div></div></CardContent></Card>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Nome</TableHead><TableHead className="hidden md:table-cell">Tipo</TableHead><TableHead className="hidden md:table-cell">Cliente</TableHead><TableHead className="hidden lg:table-cell">Tamanho</TableHead><TableHead className="hidden lg:table-cell">Data</TableHead><TableHead className="w-[60px]"></TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((d) => (
              <TableRow key={d.id}>
                <TableCell><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-law-slate shrink-0" /><span className="font-medium">{d.nome}</span></div></TableCell>
                <TableCell className="hidden md:table-cell"><Badge variant="outline">{d.tipo}</Badge></TableCell>
                <TableCell className="hidden md:table-cell">{d.cliente}</TableCell>
                <TableCell className="hidden lg:table-cell text-law-slate">{d.tamanho}</TableCell>
                <TableCell className="hidden lg:table-cell">{d.data}</TableCell>
                <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem><Download className="w-4 h-4 mr-2" />Download</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-red-500"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
