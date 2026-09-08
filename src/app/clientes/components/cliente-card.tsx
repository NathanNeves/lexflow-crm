import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import type { Cliente } from '@/lib/types'
import { getInitials, formatCurrency, formatDate } from '@/lib/utils'

const statusVariant: Record<string, string> = {
  ativo: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
  inativo: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  prospect: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
}

const segmentoVariant: Record<string, string> = {
  premium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  standard: 'bg-blue-100 text-blue-800 border-blue-300',
  basico: 'bg-slate-100 text-slate-800 border-slate-300',
}

interface Props {
  cliente: Cliente
}

export function ClienteCard({ cliente }: Props) {
  return (
    <Card className="group transition-shadow hover:shadow-lg border-l-4 border-l-amber-600">
      <CardHeader className="flex-row items-start gap-4 space-y-0 pb-3">
        <Avatar className="h-12 w-12 bg-amber-600">
          <AvatarFallback className="text-white font-semibold">
            {getInitials(cliente.nome)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{cliente.nome}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {cliente.cpfCnpj} · {cliente.contato.email}
          </p>
        </div>

        <Badge className={statusVariant[cliente.status] ?? ''} variant="secondary">
          {cliente.status === 'ativo' ? 'Ativo' : cliente.status === 'inativo' ? 'Inativo' : 'Prospect'}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Info rápida */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Processos </span>
            <strong>{cliente.processosAtivos}/{cliente.totalProcessos}</strong>
          </div>
          <div>
            <span className="text-muted-foreground">Causas </span>
            <strong>{formatCurrency(cliente.valorTotalCausas)}</strong>
          </div>
          <div>
            <span className="text-muted-foreground">Cadastro </span>
            <span>{formatDate(cliente.dataCadastro)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Origem </span>
            <span className="capitalize">{cliente.origem.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Tags e segmento */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="outline" className={segmentoVariant[cliente.segmento] ?? ''}>
            {cliente.segmento === 'premium' ? 'Premium' : cliente.segmento === 'standard' ? 'Standard' : 'Básico'}
          </Badge>
          {cliente.profissao && (
            <Badge variant="outline" className="border-gray-300 text-gray-700">
              {cliente.profissao}
            </Badge>
          )}
          {cliente.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
              {tag}
            </Badge>
          ))}
          {cliente.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">+{cliente.tags.length - 3}</span>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          <Button variant="default" size="sm" className="bg-amber-600 hover:bg-amber-700">
            Perfil
          </Button>
          <Button variant="outline" size="sm">
            Processos
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto">
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
