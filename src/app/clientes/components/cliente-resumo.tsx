import { ResumoClientes } from '@/lib/types'

interface Props {
  resumo: ResumoClientes
}

export function ClienteResumo({ resumo }: Props) {
  const cards = [
    { label: 'Total', valor: resumo.total, cor: 'bg-amber-600', texto: 'text-white' },
    { label: 'Ativos', valor: resumo.ativos, cor: 'bg-emerald-500', texto: 'text-white' },
    { label: 'Inativos', valor: resumo.inativos, cor: 'bg-gray-400', texto: 'text-white' },
    { label: 'Prospects', valor: resumo.prospects, cor: 'bg-amber-200', texto: 'text-amber-800' },
    { label: 'Premium', valor: resumo.premium, cor: 'bg-yellow-400', texto: 'text-yellow-900' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.cor} ${card.texto} rounded-lg p-4 text-center transition-transform hover:scale-105`}
        >
          <p className="text-2xl font-bold">{card.valor}</p>
          <p className="text-sm font-medium opacity-90">{card.label}</p>
        </div>
      ))}
    </div>
  )
}
