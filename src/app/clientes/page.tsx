'use client'

import { useState, useEffect, useCallback } from 'react'

import type { Cliente, ResumoClientes } from '@/lib/types'

import { ClienteCard } from './components/cliente-card'
import { ClienteFiltros, type FiltrosCliente } from './components/cliente-filters'
import { ClienteResumo } from './components/cliente-resumo'
import { ClienteSegmentacao } from './components/cliente-segmentacao'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const filtrosPadrao: FiltrosCliente = {
  busca: '',
  status: 'todos',
  segmento: 'todos',
  origem: 'todos',
  ordem: 'recentes',
}

export default function ClientesPage() {
  const [filtros, setFiltros] = useState<FiltrosCliente>(filtrosPadrao)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [resumo, setResumo] = useState<ResumoClientes>({ total: 0, ativos: 0, inativos: 0, prospects: 0, premium: 0 })
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [abaAtiva, setAbaAtiva] = useState('lista')

  const buscarClientes = useCallback(async () => {
    setCarregando(true)
    setErro('')

    try {
      const params = new URLSearchParams()
      if (filtros.busca.trim()) params.set('busca', filtros.busca.trim())
      if (filtros.status !== 'todos') params.set('status', filtros.status)
      if (filtros.segmento !== 'todos') params.set('segmento', filtros.segmento)
      if (filtros.origem !== 'todos') params.set('origem', filtros.origem)
      if (filtros.ordem !== 'recentes') params.set('ordem', filtros.ordem)

      const response = await fetch(`/api/clientes?${params.toString()}`)
      if (!response.ok) throw new Error('Erro ao carregar clientes')

      const data = await response.json()
      setClientes(data.clientes || [])
      setResumo(data.resumo || { total: 0, ativos: 0, inativos: 0, prospects: 0, premium: 0 })
    } catch (err) {
      console.error('Erro ao buscar clientes:', err)
      setErro('Não foi possível carregar a lista de clientes.')
    } finally {
      setCarregando(false)
    }
  }, [filtros])

  useEffect(() => {
    if (abaAtiva === 'lista') {
      buscarClientes()
    }
  }, [buscarClientes, abaAtiva])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie sua base de clientes, visualize perfis e acompanhe processos.
        </p>
      </div>

      <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
        <TabsList>
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="segmentacao">Segmentação</TabsTrigger>
        </TabsList>

        <TabsContent value="lista">
          <div className="space-y-6">
            <ClienteResumo resumo={resumo} />

            <ClienteFiltros
              filtros={filtros}
              onChange={setFiltros}
              resultadoBusca={clientes.length}
              total={resumo.total}
            />

            {carregando && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Carregando clientes…</p>
                </div>
              </div>
            )}

            {erro && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-red-700">{erro}</p>
                <button
                  onClick={buscarClientes}
                  className="mt-2 text-sm font-medium text-red-600 underline hover:text-red-800"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!carregando && !erro && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {clientes.map((cliente) => (
                  <ClienteCard key={cliente.id} cliente={cliente} />
                ))}
              </div>
            )}

            {!carregando && !erro && clientes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Nenhum cliente encontrado com esses filtros.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="segmentacao">
          <ClienteSegmentacao />
        </TabsContent>
      </Tabs>
    </div>
  )
}
