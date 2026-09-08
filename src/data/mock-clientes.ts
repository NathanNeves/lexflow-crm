import { Cliente } from '@/lib/types'

export const mockClientes: Cliente[] = [
  {
    id: 'CLT-001',
    nome: 'Dr. Ricardo Albuquerque Mendes',
    cpfCnpj: '123.456.789-01',
    tipo: 'PF',
    contato: { email: 'ricardo.mendes@email.com', telefone: '(11) 3333-0101', celular: '(11) 98888-0101' },
    endereco: { logradouro: 'Av. Paulista', numero: '1000', complemento: 'Apt 1501', bairro: 'Bela Vista', cidade: 'São Paulo', estado: 'SP', cep: '01310-100' },
    dataCadastro: '2025-09-15', ultimoContato: '2026-08-28', status: 'ativo', segmento: 'premium', origem: 'indicacao',
    profissao: 'Médico Cardiologista', observacoes: 'Cliente de alta renda. Prefere contato por WhatsApp.', tags: ['alta-renda', 'indicacao-parceiro', 'WhatsApp'],
    totalProcessos: 3, processosAtivos: 2, valorTotalCausas: 850000
  },
  {
    id: 'CLT-002',
    nome: 'Construtora Nova Era Ltda',
    cpfCnpj: '45.678.901/0001-23', tipo: 'PJ',
    contato: { email: 'financeiro@novaera.com', telefone: '(21) 3444-0202', celular: '(21) 97777-0202' },
    endereco: { logradouro: 'Rua do Mercado', numero: '500', bairro: 'Centro', cidade: 'Rio de Janeiro', estado: 'RJ', cep: '20010-120' },
    dataCadastro: '2026-01-10', ultimoContato: '2026-09-01', status: 'ativo', segmento: 'premium', origem: 'google',
    observacoes: 'Contrato de consultoria preventiva. 3 obras em andamento.', tags: ['contrato-anual', 'consultoria'],
    totalProcessos: 5, processosAtivos: 3, valorTotalCausas: 2200000
  },
  {
    id: 'CLT-003',
    nome: 'Sra. Maria Aparecida da Silva',
    cpfCnpj: '987.654.321-00', tipo: 'PF',
    contato: { email: 'maria.silva@email.com', telefone: '(31) 3222-0303', celular: '(31) 99999-0303' },
    endereco: { logradouro: 'Rua das Flores', numero: '300', bairro: 'Funcionários', cidade: 'Belo Horizonte', estado: 'MG', cep: '30140-000' },
    dataCadastro: '2026-03-20', ultimoContato: '2026-08-15', status: 'ativo', segmento: 'standard', origem: 'indicacao',
    profissao: 'Professora Aposentada', tags: ['previdenciario', 'baixa-renda'],
    totalProcessos: 1, processosAtivos: 1, valorTotalCausas: 95000
  },
  {
    id: 'CLT-004',
    nome: 'TechSolucões Software S.A.',
    cpfCnpj: '12.345.678/0001-90', tipo: 'PJ',
    contato: { email: 'juridico@techsol.com.br', telefone: '(41) 3333-0404', celular: '(41) 98888-0404' },
    endereco: { logradouro: 'Av. das Nações', numero: '2000', complemento: 'Sala 502', bairro: 'Água Verde', cidade: 'Curitiba', estado: 'PR', cep: '80240-210' },
    dataCadastro: '2026-04-05', ultimoContato: '2026-08-30', status: 'ativo', segmento: 'standard', origem: 'site',
    observacoes: 'Contrato de litigation societário. Startup em série B.', tags: ['startup', 'societario'],
    totalProcessos: 2, processosAtivos: 2, valorTotalCausas: 580000
  },
  {
    id: 'CLT-005',
    nome: 'Dr. João Pedro Oliveira Santos',
    cpfCnpj: '456.789.123-00', tipo: 'PF',
    contato: { email: 'jpoliveira@email.com', telefone: '(61) 3222-0505', celular: '(61) 97777-0505' },
    endereco: { logradouro: 'SHS Quadra 6', numero: '100', complemento: 'Bloco A', bairro: 'Asa Sul', cidade: 'Brasília', estado: 'DF', cep: '70322-000' },
    dataCadastro: '2026-05-12', ultimoContato: '2026-08-25', status: 'ativo', segmento: 'premium', origem: 'indicacao',
    profissao: 'Advogado Sócio', observacoes: 'Indicação do Dr. Carlos. Assessoria para planejamento patrimonial.', tags: ['alta-renda', 'planejamento-patrimonial'],
    totalProcessos: 4, processosAtivos: 1, valorTotalCausas: 1200000
  },
  {
    id: 'CLT-006',
    nome: 'Dona Rosa Maria de Jesus',
    cpfCnpj: '789.123.456-00', tipo: 'PF',
    contato: { email: 'rosinha@email.com', telefone: '(71) 3333-0606', celular: '(71) 99999-0606' },
    endereco: { logradouro: 'Rua do Pelourinho', numero: '50', bairro: 'Centro Histórico', cidade: 'Salvador', estado: 'BA', cep: '40020-000' },
    dataCadastro: '2026-06-01', ultimoContato: '2026-09-02', status: 'prospect', segmento: 'basico', origem: 'site',
    profissao: 'Comerciante', observacoes: 'Prospect captado pelo site. Interesse em direito imobiliário.', tags: ['prospect', 'captacao-site'],
    totalProcessos: 0, processosAtivos: 0, valorTotalCausas: 0
  },
  {
    id: 'CLT-007',
    nome: 'Indústrias MetalMec Ltda',
    cpfCnpj: '98.765.432/0001-10', tipo: 'PJ',
    contato: { email: 'adm@metalmec.com.br', telefone: '(51) 3444-0707', celular: '(51) 98888-0707' },
    endereco: { logradouro: 'RS-122', numero: 'km 45', complemento: 'Galpão 3', bairro: 'Zona Industrial', cidade: 'Caxias do Sul', estado: 'RS', cep: '95010-000' },
    dataCadastro: '2025-08-20', ultimoContato: '2026-08-20', status: 'inativo', segmento: 'standard', origem: 'escritorio',
    observacoes: 'Cliente antigo. Processo de recuperação judicial encerrado em 2026. Aguardando novas demandas.', tags: ['recuperacao-judicial', 'pausado'],
    totalProcessos: 7, processosAtivos: 0, valorTotalCausas: 4500000
  },
  {
    id: 'CLT-008',
    nome: 'Carla Beatriz Oliveira Nunes',
    cpfCnpj: '321.654.987-00', tipo: 'PF',
    contato: { email: 'carla.nunes@email.com', telefone: '(81) 3222-0808', celular: '(81) 97777-0808' },
    endereco: { logradouro: 'Rua da Aurora', numero: '789', bairro: 'Boa Vista', cidade: 'Recife', estado: 'PE', cep: '50050-000' },
    dataCadastro: '2026-02-14', ultimoContato: '2026-09-01', status: 'ativo', segmento: 'standard', origem: 'redes_sociais',
    profissao: 'Arquiteta', tags: ['consumidor', 'redes-sociais'],
    totalProcessos: 1, processosAtivos: 1, valorTotalCausas: 45000
  },
  {
    id: 'CLT-009',
    nome: 'Supermercados BomPreço S.A.',
    cpfCnpj: '56.789.012/0001-34', tipo: 'PJ',
    contato: { email: 'diretoria@bompreco.com.br', telefone: '(11) 3555-0909', celular: '(11) 99999-0909' },
    endereco: { logradouro: 'Rua Augusta', numero: '1500', bairro: 'Consolação', cidade: 'São Paulo', estado: 'SP', cep: '01305-100' },
    dataCadastro: '2026-07-01', ultimoContato: '2026-08-10', status: 'prospect', segmento: 'standard', origem: 'evento',
    observacoes: 'Contato feito no evento ABRAS. Interesse em direito trabalhista preventivo.', tags: ['prospect', 'evento', 'trabalhista'],
    totalProcessos: 0, processosAtivos: 0, valorTotalCausas: 0
  },
  {
    id: 'CLT-010',
    nome: 'Dr. Fernando Costa Lima',
    cpfCnpj: '654.321.987-00', tipo: 'PF',
    contato: { email: 'fclima@email.com', telefone: '(85) 3333-1010', celular: '(85) 98888-1010' },
    endereco: { logradouro: 'Av. Beira Mar', numero: '2000', complemento: 'Cobertura', bairro: 'Meireles', cidade: 'Fortaleza', estado: 'CE', cep: '60165-110' },
    dataCadastro: '2025-11-10', ultimoContato: '2026-08-05', status: 'ativo', segmento: 'premium', origem: 'indicacao',
    profissao: 'Empresário', observacoes: 'Grupo empresarial com 4 empresas. Planejamento sucessório.', tags: ['alta-renda', 'sucessorio', 'grupo-empresarial'],
    totalProcessos: 6, processosAtivos: 3, valorTotalCausas: 3500000
  },
  {
    id: 'CLT-011',
    nome: 'Ana Clara Ferreira Martins',
    cpfCnpj: '147.258.369-00', tipo: 'PF',
    contato: { email: 'ana.martins@email.com', telefone: '(62) 3222-1111', celular: '(62) 99999-1111' },
    endereco: { logradouro: 'Rua 14', numero: '320', bairro: 'Setor Oeste', cidade: 'Goiânia', estado: 'GO', cep: '74110-080' },
    dataCadastro: '2026-08-01', ultimoContato: '2026-09-03', status: 'prospect', segmento: 'basico', origem: 'google',
    profissao: 'Fisioterapeuta', observacoes: 'Captada por campanha Google Ads. Interesse em direito de família.', tags: ['prospect', 'google-ads'],
    totalProcessos: 0, processosAtivos: 0, valorTotalCausas: 0
  },
  {
    id: 'CLT-012',
    nome: 'Transportadora RápidoCargo Ltda',
    cpfCnpj: '34.567.890/0001-12', tipo: 'PJ',
    contato: { email: 'juridico@rapidocargo.com.br', telefone: '(11) 3666-1212', celular: '(11) 97777-1212' },
    endereco: { logradouro: 'Rod. Fernão Dias', numero: 'km 90', complemento: 'Frota 2', bairro: 'Zona Industrial', cidade: 'Guarulhos', estado: 'SP', cep: '07110-000' },
    dataCadastro: '2026-06-15', ultimoContato: '2026-09-04', status: 'ativo', segmento: 'standard', origem: 'indicacao',
    observacoes: 'Frota de 120 caminhões. Contrato de assessoria trabalhista recorrente.', tags: ['trabalhista', 'recorrente'],
    totalProcessos: 8, processosAtivos: 5, valorTotalCausas: 780000
  }
]
