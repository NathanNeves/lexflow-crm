"use client"

import { useState } from "react"
import { Search, MessageSquare, Mail, Phone, Send, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Mensagem {
  id: string; assunto: string; de: string; para: string; data: string; tipo: "email" | "whatsapp" | "telefone"; status: "lida" | "nao_lida"
}

const MOCK: Mensagem[] = [
  { id: "1", assunto: "Atualização sobre processo trabalhista", de: "Carlos Alberto Silva", para: "Dr. André", data: "10/05/2026", tipo: "email", status: "nao_lida" },
  { id: "2", assunto: "Documentação para contrato social", de: "Tech Solutions Ltda", para: "Dr. André", data: "08/05/2026", tipo: "email", status: "lida" },
  { id: "3", assunto: "Confirmação de audiência", de: "Dr. André", para: "Mariana Costa Oliveira", data: "05/05/2026", tipo: "whatsapp", status: "lida" },
]

export default function ComunicacaoPage() {
  const [msgs] = useState(MOCK)
  const [search, setSearch] = useState("")
  const filtered = msgs.filter((m) => !search.trim() || m.assunto.toLowerCase().includes(search.toLowerCase()) || m.de.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-law-navy dark:text-white font-serif">Comunicação</h1>
        <p className="text-law-slate dark:text-white/60 text-sm mt-1">Central de comunicações com clientes</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">E-mails</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif">{msgs.filter((m) => m.tipo === "email").length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">WhatsApp</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif">{msgs.filter((m) => m.tipo === "whatsapp").length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Não Lidas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-amber-600">{msgs.filter((m) => m.status === "nao_lida").length}</p></CardContent></Card>
      </div>
      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-law-slate" /><Input placeholder="Buscar mensagens..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div>
      <Tabs defaultValue="todas"><TabsList><TabsTrigger value="todas">Todas</TabsTrigger><TabsTrigger value="email">E-mail</TabsTrigger><TabsTrigger value="whatsapp">WhatsApp</TabsTrigger></TabsList>
        <TabsContent value="todas" className="space-y-3 mt-4">
          {filtered.map((m) => (
            <Card key={m.id} className={m.status === "nao_lida" ? "border-l-4 border-l-law-gold" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {m.tipo === "email" ? <Mail className="w-5 h-5 text-law-slate mt-0.5" /> : <MessageSquare className="w-5 h-5 text-green-500 mt-0.5" />}
                    <div>
                      <p className="font-medium">{m.assunto}</p>
                      <p className="text-sm text-law-slate">{m.de} → {m.para}</p>
                      <p className="text-xs text-law-slate mt-1">{m.data}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{m.tipo === "email" ? "E-mail" : m.tipo === "whatsapp" ? "WhatsApp" : "Telefone"}</Badge>
                    {m.status === "nao_lida" && <div className="w-2 h-2 rounded-full bg-law-gold" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
