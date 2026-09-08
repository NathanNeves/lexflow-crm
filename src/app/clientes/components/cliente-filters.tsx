import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type FiltrosCliente = {
  busca: string
  status: string
  segmento: string
  origem: string
  ordem: string
}

interface Props {
  filtros: FiltrosCliente
  onChange: (filtros: FiltrosCliente) => void
  resultadoBusca: number
  total: number
}

export function ClienteFiltros({ filtros, onChange, resultadoBusca, total }: Props) {
  const atualizar = (chave: keyof FiltrosCliente, valor: string) => {
    onChange({ ...filtros, [chave]: valor })
  }

  const limpar = () => {
    onChange({ busca: '', status: 'todos', segmento: 'todos', origem: 'todos', ordem: 'recentes' })
  }

  const temFiltro = filtros.busca || filtros.status !== 'todos' || filtros.segmento !== 'todos' || filtros.origem !== 'todos'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Buscar por nome, CPF ou e-mail…"
            value={filtros.busca}
            onChange={(e) => atualizar('busca', e.target.value)}
          />
        </div>

        <Select value={filtros.status} onValueChange={(v) => atualizar('status', v)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filtros.segmento} onValueChange={(v) => atualizar('segmento', v)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Segmento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="basico">Básico</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filtros.origem} onValueChange={(v) => atualizar('origem', v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="indicacao">Indicação</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="redes_sociais">Redes Sociais</SelectItem>
            <SelectItem value="site">Site</SelectItem>
            <SelectItem value="evento">Evento</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filtros.ordem} onValueChange={(v) => atualizar('ordem', v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recentes">Mais recentes</SelectItem>
            <SelectItem value="antigos">Mais antigos</SelectItem>
            <SelectItem value="nome">Nome A-Z</SelectItem>
            <SelectItem value="nome-desc">Nome Z-A</SelectItem>
            <SelectItem value="processos">Mais processos</SelectItem>
            <SelectItem value="valor">Maior valor</SelectItem>
          </SelectContent>
        </Select>

        {temFiltro && (
          <Button variant="ghost" size="sm" onClick={limpar}>
            Limpar filtros
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Mostrando {resultadoBusca} de {total} clientes
      </p>
    </div>
  )
}
