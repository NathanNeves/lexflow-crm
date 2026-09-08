"use client"

import { useState } from "react"
import { Users2, UserPlus, Mail, MessageSquare, Clock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Membro {
  id: string; nome: string; email: string; funcao: string; status: "online" | "ausente" | "offline"; processos: number
}

const MEMBROS: Membro[] = [
  { id: "1", nome: "Dr. André Oliveira", email: "andre@lexflow.adv.br", funcao: "Sócio - Direito Trabalhista", status: "online", processos: 8 },
  { id: "2", nome: "Dra. Carla Mendes", email: "carla@lexflow.adv.br", funcao: "Advogada - Direito Civil", status: "online", processos: 6 },
  { id: "3", nome: "Dr. Ricardo Faria", email: "ricardo@lexflow.adv.br", funcao: "Advogado - Empresarial", status: "ausente", processos: 4 },
  { id: "4", nome: "Juliana Torres", email: "juliana@lexflow.adv.br", funcao: "Estagiária", status: "online", processos: 3 },
  { id: "5", nome: "Dr. Marcos Santos", email: "marcos@lexflow.adv.br", funcao: "Advogado - Família", status: "offline", processos: 5 },
]

export default function ColaboracaoPage() {
  const [membros] = useState(MEMBROS)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-law-navy dark:text-white font-serif">Colaboração</h1>
          <p className="text-law-slate dark:text-white/60 text-sm mt-1">Equipe do escritório</p>
        </div>
        <Button className="bg-law-navy hover:bg-law-navy/90 text-white gap-2"><UserPlus className="w-4 h-4" />Convidar</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Membros</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif">{membros.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Online</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif text-green-600">{membros.filter((m) => m.status === "online").length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-law-slate">Processos Ativos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold font-serif">{membros.reduce((a, m) => a + m.processos, 0)}</p></CardContent></Card>
      </div>
      <div className="space-y-3">
        {membros.map((m) => (
          <Card key={m.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar><AvatarFallback className="bg-law-navy text-white text-sm">{m.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${m.status === "online" ? "bg-green-500" : m.status === "ausente" ? "bg-yellow-500" : "bg-gray-400"}`} />
                  </div>
                  <div>
                    <p className="font-medium">{m.nome}</p>
                    <p className="text-sm text-law-slate">{m.funcao}</p>
                    <p className="text-xs text-law-slate">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">{m.processos} processos</Badge>
                  <Button variant="ghost" size="icon"><Mail className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon"><MessageSquare className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
