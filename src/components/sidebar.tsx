"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  LayoutDashboard, Users, Scale, DollarSign, 
  FileText, Clock, MessageSquare, 
  BarChart3, Users2, Settings, Search,
  Bell, ChevronDown, Menu, X
} from "lucide-react"
import { useState } from "react"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  module: string
}

const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, module: "M1" },
  { label: "Clientes", href: "/clientes", icon: Users, module: "M1" },
  { label: "Processos", href: "/processos", icon: Scale, module: "M2" },
  { label: "Financeiro", href: "/financeiro", icon: DollarSign, module: "M3" },
  { label: "Documentos", href: "/documentos", icon: FileText, module: "M4" },
  { label: "Prazos", href: "/prazos", icon: Clock, module: "M4" },
  { label: "Comunicação", href: "/comunicacao", icon: MessageSquare, module: "M5" },
  { label: "Relatórios", href: "/relatorios", icon: BarChart3, module: "M6" },
  { label: "Colaboração", href: "/colaboracao", icon: Users2, module: "M7" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setCollapsed(true)} />

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full bg-law-navy dark:bg-law-ink border-r border-white/10 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-law-gold text-white font-serif font-bold text-sm shrink-0">
            L
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-white font-serif font-semibold text-base leading-tight">LexFlow</h1>
              <p className="text-white/50 text-[10px] leading-tight">CRM Jurídico</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-white/60 hover:text-white shrink-0 hidden lg:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </Button>
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 py-2">
          <nav className="px-2 space-y-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10 h-10",
                      isActive && "bg-white/15 text-white",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <item.icon size={20} className="shrink-0" />
                    {!collapsed && <span className="text-sm">{item.label}</span>}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        <Separator className="bg-white/10" />

        {/* User footer */}
        <div className="p-3">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-law-gold text-white text-xs">DR</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">Dr. Ricardo Silva</p>
                <p className="text-white/50 text-xs truncate">Sócio Administrador</p>
              </div>
            )}
            {!collapsed && (
              <Link href="/configuracoes">
                <Button variant="ghost" size="icon" className="text-white/50 hover:text-white shrink-0">
                  <Settings size={16} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
