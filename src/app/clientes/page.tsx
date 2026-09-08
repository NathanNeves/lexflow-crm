'use client'

import { useState, useMemo } from 'react'

import { mockClientes } from '@/data/mock-clientes'
import type { ResumoClientes } from '@/lib/types'

import { ClienteCard } from './components/cliente-card'
import { ClienteFiltros, type FiltrosCliente } from './components/cliente-filters'
import { ClienteResumo } from './components/cliente-resumo'

const filtrosPadrao: FiltrosCliente = {
  busca: '',
  status: 'todos',
  segmento: 'todos',
  origem: 'todos',
  ordem: 'recentes',
}

export default function ClientesPage() {
  const [filtros, setFiltros] = useState<FiltrosCliente>(filtrosPadrao)

  const clientesFiltrados = useMemo(() => {
    let lista = [...mockClientes]

    if (filtros.busca.trim()) {
      const termo = filtros.busca.toLowerCase()
      lista = lista.filter(
        (c) =>
          c.nome.toLowerCase().includes(termo) ||
          c.cpfCnpj.includes(termo) ||
          c.contato.email.toLowerCase().includes(termo) ||
          c.contato.celular.includes(termo)
      )
    }

    if (filtros.status !== 'todos') {
      lista = lista.filter((c) => c.status === filtros.status)
    }

    if (filtros.segmento !== 'todos') {
      lista = lista.filter((c) => c.segmento === filtros.segmento)
    }

    if (filtros.origem !== 'todos') {
      lista = lista.filter((c) => c.origem === filtros.origem)
    }

    switch (filtros.ordem) {
      case 'recentes':
        lista.sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime())
        break
      case 'antigos':
        lista.sort((a, b) => new Date(a.dataCadastro).getTime() - new Date(b.dataCadastro).getTime())
        break
      case 'nome':
        lista.sort((a, b) => a.nome.localeCompare(b.nome))
        break
      case 'nome-desc':
        lista.sort((a, b) => b.nome.localeCompare(a.nome))
        break
      case 'processos':
        lista.sort((a, b) => b.totalProcessos - a.totalProcessos)
        break
      case 'valor':
        lista.sort((a, b) => b.valorTotalCausas - a.valorTotalCausas)
        break
    }

    return lista
  }, [filtros])

  const resumo: ResumoClientes = useMemo(() => ({
    total: mockClientes.length,
    ativos: mockClientes.filter((c) => c.status === 'ativo').length,
    inativos: mockClientes.filter((c) => c.status === 'inativo').length,
    prospects: mockClientes.filter((c) => c.status === 'prospect').length,
    premium: mockClientes.filter((c) => c.segmento === 'premium').length,
  }), [])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie sua base de clientes, visualize perfis e acompanhe processos.
        </p>
      </div>

      <ClienteResumo resumo={resumo} />

      <ClienteFiltros
        filtros={filtros}
        onChange={setFiltros}
        resultadoBusca={clientesFiltrados.length}
        total={mockClientes.length}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clientesFiltrados.map((cliente) => (
          <ClienteCard key={cliente.id} cliente={cliente} />
        ))}
      </div>

      {clientesFiltrados.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Nenhum cliente encontrado com esses filtros.</p>
        </div>
      )}
    </div>
  )
}
