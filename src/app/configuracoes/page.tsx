import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Settings, User, Bell, Shield, Palette, Database } from "lucide-react"

const configSections = [
  { icon: User, label: "Perfil", desc: "Informações pessoais e preferências" },
  { icon: Bell, label: "Notificações", desc: "Alertas e lembretes do sistema" },
  { icon: Shield, label: "Segurança", desc: "Permissões e controle de acesso" },
  { icon: Palette, label: "Aparência", desc: "Tema e personalização visual" },
  { icon: Database, label: "Integrações", desc: "APIs e conexões externas" },
]

export default function ConfiguracoesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-law-navy dark:text-white font-serif">Configurações</h1>
        <p className="text-law-slate dark:text-white/60 text-sm mt-1">Gerencie as preferências do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configSections.map((section) => (
          <Card key={section.label} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-law-navy/10 dark:bg-law-gold/20">
                  <section.icon className="w-5 h-5 text-law-navy dark:text-law-gold" />
                </div>
                <CardTitle className="text-base font-serif">{section.label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{section.desc}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Informações do Escritório</CardTitle>
          <CardDescription>Dados cadastrais do escritório</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Escritório</Label>
              <Input id="nome" defaultValue="LexFlow - Advocacia & Consultoria" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input id="cnpj" defaultValue="00.000.000/0001-00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" defaultValue="contato@lexflow.adv.br" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" defaultValue="(11) 9999-9999" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-law-navy hover:bg-law-navy/90 text-white">Salvar Alterações</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
