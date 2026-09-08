export interface MockProcesso {
  id: string;
  clienteId: string;
  numero: string;
  tipo: string;
  area: string;
  tribunal: string;
  vara: string;
  dataDistribuicao: string;
  ultimaMovimentacao: string;
  status: 'ativo' | 'arquivado' | 'suspenso' | 'recurso';
  valorCausa: number;
  parteContraria: string;
  advogadoResponsavel: string;
}

export const mockProcessos: MockProcesso[] = [
  {
    id: 'PROC-001', clienteId: 'CLT-001',
    numero: '1012345-67.2026.8.26.0100', tipo: 'Indenizatória', area: 'Cível',
    tribunal: 'TJSP', vara: '2ª Vara Cível', dataDistribuicao: '2026-02-15',
    ultimaMovimentacao: '2026-08-28', status: 'ativo', valorCausa: 350000,
    parteContraria: 'Hospital São Lucas S.A.', advogadoResponsavel: 'Dr. Carlos Andrade'
  },
  {
    id: 'PROC-002', clienteId: 'CLT-001',
    numero: '1015678-90.2026.8.26.0100', tipo: 'Erro Médico', area: 'Cível',
    tribunal: 'TJSP', vara: '5ª Vara Cível', dataDistribuicao: '2026-05-20',
    ultimaMovimentacao: '2026-09-01', status: 'ativo', valorCausa: 500000,
    parteContraria: 'Unimed Paulista', advogadoResponsavel: 'Dr. Carlos Andrade'
  },
  {
    id: 'PROC-003', clienteId: 'CLT-002',
    numero: '2012345-67.2026.8.19.0001', tipo: 'Cobrança', area: 'Empresarial',
    tribunal: 'TJRJ', vara: '3ª Vara Empresarial', dataDistribuicao: '2026-03-10',
    ultimaMovimentacao: '2026-09-02', status: 'ativo', valorCausa: 850000,
    parteContraria: 'Construtora Rocha Ltda', advogadoResponsavel: 'Dra. Mariana Costa'
  },
  {
    id: 'PROC-004', clienteId: 'CLT-002',
    numero: '2016789-01.2025.8.19.0001', tipo: 'Revisão Contratual', area: 'Empresarial',
    tribunal: 'TJRJ', vara: '1ª Vara Empresarial', dataDistribuicao: '2025-11-05',
    ultimaMovimentacao: '2026-08-20', status: 'ativo', valorCausa: 1200000,
    parteContraria: 'Banco do Brasil S.A.', advogadoResponsavel: 'Dr. Paulo Mendes'
  },
  {
    id: 'PROC-005', clienteId: 'CLT-003',
    numero: '3012345-67.2026.8.13.0001', tipo: 'Aposentadoria', area: 'Previdenciário',
    tribunal: 'JFMG', vara: '2ª Vara Previdenciária', dataDistribuicao: '2026-06-01',
    ultimaMovimentacao: '2026-08-25', status: 'ativo', valorCausa: 95000,
    parteContraria: 'INSS', advogadoResponsavel: 'Dra. Juliana Almeida'
  },
  {
    id: 'PROC-006', clienteId: 'CLT-004',
    numero: '4012345-67.2026.8.16.0001', tipo: 'Dissolução Parcial', area: 'Societário',
    tribunal: 'TJPR', vara: '4ª Vara Empresarial', dataDistribuicao: '2026-06-15',
    ultimaMovimentacao: '2026-08-30', status: 'ativo', valorCausa: 380000,
    parteContraria: 'TechSystem Ltda', advogadoResponsavel: 'Dra. Mariana Costa'
  },
  {
    id: 'PROC-007', clienteId: 'CLT-005',
    numero: '5012345-67.2025.8.07.0001', tipo: 'Planejamento Sucessório', area: 'Patrimonial',
    tribunal: 'TJDF', vara: '1ª Vara de Família', dataDistribuicao: '2025-09-01',
    ultimaMovimentacao: '2026-07-15', status: 'ativo', valorCausa: 1200000,
    parteContraria: 'Espólio Familiar', advogadoResponsavel: 'Dr. Paulo Mendes'
  },
  {
    id: 'PROC-008', clienteId: 'CLT-007',
    numero: '6012345-67.2024.8.21.0001', tipo: 'Recuperação Judicial', area: 'Empresarial',
    tribunal: 'TJRS', vara: '1ª Vara de Falências', dataDistribuicao: '2024-05-20',
    ultimaMovimentacao: '2026-08-10', status: 'arquivado', valorCausa: 4500000,
    parteContraria: 'Credores Diversos', advogadoResponsavel: 'Dr. Ricardo Torres'
  },
  {
    id: 'PROC-009', clienteId: 'CLT-008',
    numero: '7012345-67.2026.8.17.0001', tipo: 'Revisional de Alimentos', area: 'Família',
    tribunal: 'TJPE', vara: '3ª Vara de Família', dataDistribuicao: '2026-07-01',
    ultimaMovimentacao: '2026-08-28', status: 'ativo', valorCausa: 48000,
    parteContraria: 'João Pedro Nunes Silva', advogadoResponsavel: 'Dra. Juliana Almeida'
  },
  {
    id: 'PROC-010', clienteId: 'CLT-009',
    numero: '8012345-67.2026.8.12.0001', tipo: 'Usucapião', area: 'Imobiliário',
    tribunal: 'TJMS', vara: '2ª Vara Cível', dataDistribuicao: '2026-07-10',
    ultimaMovimentacao: '2026-09-01', status: 'ativo', valorCausa: 180000,
    parteContraria: 'Espólio de José Antunes', advogadoResponsavel: 'Dr. Carlos Andrade'
  },
  {
    id: 'PROC-011', clienteId: 'CLT-010',
    numero: '9012345-67.2026.8.06.0001', tipo: 'Indenização Dano Moral', area: 'Cível',
    tribunal: 'TJCE', vara: '1ª Vara Cível', dataDistribuicao: '2026-08-01',
    ultimaMovimentacao: '2026-08-25', status: 'recurso', valorCausa: 120000,
    parteContraria: 'Operadora Telefônica XYZ', advogadoResponsavel: 'Dra. Mariana Costa'
  },
  {
    id: 'PROC-012', clienteId: 'CLT-011',
    numero: '0012345-67.2026.8.09.0001', tipo: 'Restituição de Valores', area: 'Consumidor',
    tribunal: 'TJGO', vara: '4ª Vara Cível', dataDistribuicao: '2026-08-05',
    ultimaMovimentacao: '2026-09-02', status: 'ativo', valorCausa: 25000,
    parteContraria: 'Vale do Rio Doce S.A.', advogadoResponsavel: 'Dra. Juliana Almeida'
  },
  {
    id: 'PROC-013', clienteId: 'CLT-012',
    numero: '1012345-67.2026.8.26.0200', tipo: 'Defesa do Consumidor', area: 'Consumidor',
    tribunal: 'TJSP', vara: '6ª Vara Cível', dataDistribuicao: '2026-08-15',
    ultimaMovimentacao: '2026-08-28', status: 'recurso', valorCausa: 28000,
    parteContraria: 'Banco Itaú S.A.', advogadoResponsavel: 'Dr. Carlos Andrade'
  }
];
