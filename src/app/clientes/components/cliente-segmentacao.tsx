'use client'

import { useState, useEffect } from 'react'
import type { SegmentacaoData } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SEGMENT_COLORS: Record<string, string> = {
  premium: 'bg-amber-500',
  standard: 'bg-blue-500',
  basico: 'bg-gray-400',
}

const SEGMENT_BG_LIGHT: Record<string, string> = {
  premium: 'bg-amber-50 border-amber-200',
  standard: 'bg-blue-50 border-blue-200',
  basico: 'bg-gray-50 border-gray-200',
}

const SEGMENT_TEXT: Record<string, string> = {
  premium: 'text-amber-800',
  standard: 'text-blue-800',
  basico: 'text-gray-600',
}

const STATUS_COLORS: Record<string, string> = {
  ativo: 'bg-emerald-500',
  inativo: 'bg-red-400',
  prospect: 'bg-violet-400',
}

export function ClienteSegmentacao() {
  const [data, setData] = useState<SegmentacaoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/clientes/segmentacao')
        if (!res.ok) throw new Error('Erro ao carregar segmentação')
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('Erro ao buscar segmentação:', err)
        setError('Não foi possível carregar os dados de segmentação.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando segmentação…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-red-700">{error || 'Dados indisponíveis'}</p>
      </div>
    )
  }

  const maxTotal = Math.max(...data.porSegmento.map((s) => s.total), 1)
  const maxValor = Math.max(...data.porSegmento.map((s) => s.valorTotal), 1)

  // Build origem × segmento pivot
  const origens = ['indicacao', 'google', 'redes_sociais', 'site', 'escritorio', 'evento', 'outro']
  const segmentos = ['premium', 'standard', 'basico']
  const origemPivot: Record<string, Record<string, number>> = {}
  for (const o of origens) {
    origemPivot[o] = {}
    for (const s of segmentos) {
      origemPivot[o][s] = 0
    }
  }
  for (const row of data.porOrigem) {
    if (origemPivot[row.origem] !== undefined && origemPivot[row.origem][row.segmento] !== undefined) {
      origemPivot[row.origem][row.segmento] = row.total
    }
  }

  // Status per segment
  const statusPorSegmento: Record<string, Record<string, number>> = {}
  for (const s of segmentos) {
    statusPorSegmento[s] = { ativo: 0, inativo: 0, prospect: 0 }
  }
  for (const row of data.porStatus) {
    if (statusPorSegmento[row.segmento] !== undefined) {
      statusPorSegmento[row.segmento][row.status] = row.total
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalGeral}</p>
          </CardContent>
        </Card>
        {data.porSegmento.map((seg) => (
          <Card key={seg.segmento} className={`rounded-xl border shadow-sm ${SEGMENT_BG_LIGHT[seg.segmento]}`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${SEGMENT_TEXT[seg.segmento]}`}>
                {seg.label} {seg.segmento === 'premium' ? '⭐' : seg.segmento === 'standard' ? '✓' : ''}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${SEGMENT_TEXT[seg.segmento]}`}>
                {seg.total}
              </p>
              <p className={`text-xs ${SEGMENT_TEXT[seg.segmento]} mt-1`}>
                {formatCurrency(seg.valorTotal)} em causas
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Client count by segment */}
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Clientes por Segmento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.porSegmento.map((seg) => (
                <div key={seg.segmento}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{seg.label}</span>
                    <span className="text-muted-foreground">{seg.total} clientes</span>
                  </div>
                  <div className="h-8 w-full rounded-md bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-md transition-all duration-500 ${SEGMENT_COLORS[seg.segmento]}`}
                      style={{ width: `${(seg.total / maxTotal) * 100}%` }}
                    />
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="text-emerald-600">{seg.ativos} ativos</span>
                    <span className="text-red-500">{seg.inativos} inativos</span>
                    <span className="text-violet-500">{seg.prospects} prospects</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by segment */}
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Valor Total de Causas por Segmento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.porSegmento.map((seg) => (
                <div key={seg.segmento}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{seg.label}</span>
                    <span className="text-muted-foreground">{formatCurrency(seg.valorTotal)}</span>
                  </div>
                  <div className="h-8 w-full rounded-md bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-md transition-all duration-500 ${SEGMENT_COLORS[seg.segmento]}`}
                      style={{ width: `${maxValor > 0 ? (seg.valorTotal / maxValor) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{seg.processosTotal} processos</span>
                    <span>{seg.processosAtivos} ativos</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Origem × Segmento table */}
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Origem × Segmento</CardTitle>
          <p className="text-xs text-muted-foreground">Distribuição de clientes por canal de aquisição e segmento</p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium text-muted-foreground">Origem</th>
                {segmentos.map((s) => (
                  <th key={s} className="text-center py-2 font-medium text-muted-foreground">
                    {data.labels.segmentos[s]}
                  </th>
                ))}
                <th className="text-center py-2 font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {origens.map((origem) => {
                const rowTotal = segmentos.reduce((sum, s) => sum + (origemPivot[origem]?.[s] || 0), 0)
                if (rowTotal === 0) return null
                return (
                  <tr key={origem} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-2 font-medium">{data.labels.origens[origem]}</td>
                    {segmentos.map((s) => (
                      <td key={s} className="text-center py-2">
                        {origemPivot[origem]?.[s] ? (
                          <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${SEGMENT_COLORS[s]} text-white`}>
                            {origemPivot[origem][s]}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    ))}
                    <td className="text-center py-2 font-semibold">{rowTotal}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Status × Segment breakdown */}
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Status por Segmento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-3">
            {segmentos.map((seg) => {
              const stat = statusPorSegmento[seg]
              const segTotal = stat.ativo + stat.inativo + stat.prospect
              return (
                <div key={seg} className={`rounded-lg border p-4 ${SEGMENT_BG_LIGHT[seg]}`}>
                  <h4 className={`font-semibold mb-3 ${SEGMENT_TEXT[seg]}`}>{data.labels.segmentos[seg]}</h4>
                  <div className="space-y-2">
                    {(['ativo', 'inativo', 'prospect'] as const).map((st) => {
                      const pct = segTotal > 0 ? (stat[st] / segTotal) * 100 : 0
                      return (
                        <div key={st}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span>{data.labels.status[st]}</span>
                            <span className="text-muted-foreground">{stat[st]}</span>
                          </div>
                          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${STATUS_COLORS[st]}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
