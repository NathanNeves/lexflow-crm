"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { 
  Search, Bell, Sun, Moon, Menu 
} from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground">
        <Menu size={20} />
      </Button>

      <div className={cn("flex-1 max-w-md ml-4 lg:ml-0", !searchOpen && "hidden sm:block")}>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Buscar clientes, processos, documentos..." 
            className="pl-9 h-9 bg-muted/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-law-gold" />
        </Button>
      </div>
    </header>
  )
}
