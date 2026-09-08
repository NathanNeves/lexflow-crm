export interface Endereco {
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}

export interface Contato {
  email: string
  telefone: string
  celular: string
}

export type TipoCliente = "PF" | "PJ"
export type StatusCliente = "ativo" | "inativo" | "prospect"
export type SegmentoCliente = "premium" | "standard" | "basico"
export type OrigemCliente = "indicacao" | "google" | "redes_sociais" | "site" | "escritorio" | "evento" | "outro"

export interface Cliente {
  id: string
  nome: string
  cpfCnpj: string
  tipo: TipoCliente
  contato: Contato
  endereco: Endereco
  dataCadastro: string
  ultimoContato: string
  status: StatusCliente
  segmento: SegmentoCliente
  origem: OrigemCliente
  profissao?: string
  observacoes?: string
  tags: string[]
  totalProcessos: number
  processosAtivos: number
  valorTotalCausas: number
}

export type StatusProcesso = "ativo" | "arquivado" | "suspenso" | "recurso"

export interface Processo {
  id: string
  clienteId: string
  numero: string
  tipo: string
  area: string
  tribunal: string
  vara: string
  dataDistribuicao: string
  ultimaMovimentacao: string
  status: StatusProcesso
  valorCausa: number
  parteContraria: string
  advogadoResponsavel: string
}

export interface ResumoClientes {
  total: number
  ativos: number
  inativos: number
  prospects: number
  premium: number
}
