export interface Cliente {
  id: string
  tipo: "PF" | "PJ"
  nome: string
  documento: string
  email: string
  telefone: string
  endereco: string
  tags: string[]
  status: "ativo" | "inativo"
  dataCadastro: string
  observacoes?: string
}
