import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { Separator } from "@/components/ui/separator"
import { 
  Users, Scale, DollarSign, FileText, Clock,
  ArrowUpRight, TrendingUp, AlertCircle, CheckCircle2
} from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="law-heading text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Visão geral do escritório – Dados atualizados em tempo real
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Clientes Ativos"
          value="247"
          change="+12 este mês"
          icon={Users}
          trend="up"
        />
        <KpiCard
          label="Processos Ativos"
          value="183"
          change="98 em andamento"
          icon={Scale}
          trend="up"
        />
        <KpiCard
          label="Faturamento (Més)"
          value="R$ 87.450"
          change="+18% vs. mês anterior"
          icon={DollarSign}
          trend="up"
        />
        <KpiCard
          label="Prazos Próximos"
          value="14"
          change="Próximos 7 dias"
          icon={Clock}
          trend="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg law-heading">Atividade Recente</CardTitle>
            <CardDescription>Últimas ações no escritório</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-law-gold/20 text-law-gold text-xs">
                    {item.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
                <Badge variant={item.badgeVariant as any} className="shrink-0 text-[10px]">
                  {item.badge}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg law-heading">Prazos Urgentes</CardTitle>
            <CardDescription>Vencem nos próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((d, i) => (
                <div key={i} className="flex items-start gap-2">
                  {d.urgent ? (
                    <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                  ) : (
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <Button variant="outline" size="sm" className="w-full text-xs">
              Ver todos os prazos
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="gold">
          <Users size={14} className="mr-2" /> Novo Cliente
        </Button>
        <Button size="sm" variant="outline">
          <Scale size={14} className="mr-2" /> Novo Processo
        </Button>
        <Button size="sm" variant="outline">
          <FileText size={14} className="mr-2" /> Novo Documento
        </Button>
        <Button size="sm" variant="outline">
          <DollarSign size={14} className="mr-2" /> Registrar Pagamento
        </Button>
      </div>
    </div>
  )
}

function KpiCard({ label, value, change, icon: Icon, trend }: {
  label: string
  value: string
  change: string
  icon: React.ElementType
  trend: "up" | "down" | "warning"
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <Icon size={20} className="text-law-gold" />
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <div className="flex items-center gap-1 mt-1">
          {trend === "up" && <TrendingUp size={12} className="text-emerald-500" />}
          {trend === "warning" && <AlertCircle size={12} className="text-amber-500" />}
          <p className={cn(
            "text-xs",
            trend === "up" && "text-emerald-600",
            trend === "warning" && "text-amber-600",
          )}>{change}</p>
        </div>
      </CardContent>
    </Card>
  )
}

import { cn } from "@/lib/utils"

const recentActivity = [
  {
    initials: "AM",
    action: "Ana Martins abriu um novo processo — Silva vs. Construtora XYZ",
    time: "Ç 15 minutos",
    badge: "Processo",
    badgeVariant: "default",
  },
  {
    initials: "RC",
    action: "Dr. Ricardo Costa agendou audiência para 15/10/2026",
    time: " 32 minutos",
    badge: "Audiêoncia",
    badgeVariant: "warning",
  },
  {
    initials: "LB",
    action: "Luciana Borges registrou pagamento de R$ 5.000,00 de honorários",
    time: "Ç 1 hora",
    badge: "Financeiro",
    badgeVariant: "success",
  },
  {
    initials: "MF",
    action: "Marcos Felipe anexou petição inicial ao processo #2026/0452",
    time: "Ç 2 horas",
    badge: "Documento",
    badgeVariant: "secondary",
  },
]

const upcomingDeadlines = [
  { title: "Recurso de Apelação — Proc. #2026/0381", date: "Amanhã — 14:00", urgent: true },
  { title: "Contestação — proc. #2026/0447", date: "12/10/2026", urgent: true },
  { title: "Prazo para impugnaãão — proc. #2026/0521", date: "15/10/2026", urgent: false },
  { title: "Entrega de documentos — Cliente Souza", date: "18/10/2026", urgent: false },
]
