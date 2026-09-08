import Database from 'better-sqlite3';

const db = new Database('./lexflow.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const processos = [
  { id: 'PROC-001', clienteId: 'CLT-001', numero: '1012345-67.2026.8.26.0100', tipo: 'Indenizat\u00f3ria', area: 'C\u00edvel', tribunal: 'TJSP', vara: '2\u00aa Vara C\u00edvel', dataDistribuicao: '2026-02-15', ultimaMovimentacao: '2026-08-28', status: 'ativo', valorCausa: 350000, parteContraria: 'Hospital S\u00e3o Lucas S.A.', advogadoResponsavel: 'Dr. Carlos Andrade' },
  { id: 'PROC-002', clienteId: 'CLT-001', numero: '1015678-90.2026.8.26.0100', tipo: 'Erro M\u00e9dico', area: 'C\u00edvel', tribunal: 'TJSP', vara: '5\u00aa Vara C\u00edvel', dataDistribuicao: '2026-05-20', ultimaMovimentacao: '2026-09-01', status: 'ativo', valorCausa: 500000, parteContraria: 'Unimed Paulista', advogadoResponsavel: 'Dr. Carlos Andrade' },
  { id: 'PROC-003', clienteId: 'CLT-002', numero: '2012345-67.2026.8.19.0001', tipo: 'Cobran\u00e7a', area: 'Empresarial', tribunal: 'TJRJ', vara: '3\u00aa Vara Empresarial', dataDistribuicao: '2026-03-10', ultimaMovimentacao: '2026-09-02', status: 'ativo', valorCausa: 850000, parteContraria: 'Construtora Rocha Ltda', advogadoResponsavel: 'Dra. Mariana Costa' },
  { id: 'PROC-004', clienteId: 'CLT-002', numero: '2016789-01.2025.8.19.0001', tipo: 'Revis\u00e3o Contratual', area: 'Empresarial', tribunal: 'TJRJ', vara: '1\u00aa Vara Empresarial', dataDistribuicao: '2025-11-05', ultimaMovimentacao: '2026-08-20', status: 'ativo', valorCausa: 1200000, parteContraria: 'Banco do Brasil S.A.', advogadoResponsavel: 'Dr. Paulo Mendes' },
  { id: 'PROC-005', clienteId: 'CLT-003', numero: '3012345-67.2026.8.13.0001', tipo: 'Aposentadoria', area: 'Previdenci\u00e1rio', tribunal: 'JFMG', vara: '2\u00aa Vara Previdenci\u00e1ria', dataDistribuicao: '2026-06-01', ultimaMovimentacao: '2026-08-25', status: 'ativo', valorCausa: 95000, parteContraria: 'INSS', advogadoResponsavel: 'Dra. Juliana Almeida' },
  { id: 'PROC-006', clienteId: 'CLT-004', numero: '4012345-67.2026.8.16.0001', tipo: 'Dissolu\u00e7\u00e3o Parcial', area: 'Societ\u00e1rio', tribunal: 'TJPR', vara: '4\u00aa Vara Empresarial', dataDistribuicao: '2026-06-15', ultimaMovimentacao: '2026-08-30', status: 'ativo', valorCausa: 380000, parteContraria: 'TechSystem Ltda', advogadoResponsavel: 'Dra. Mariana Costa' },
  { id: 'PROC-007', clienteId: 'CLT-005', numero: '5012345-67.2025.8.07.0001', tipo: 'Planejamento Sucess\u00f3rio', area: 'Patrimonial', tribunal: 'TJDF', vara: '1\u00aa Vara de Fam\u00edlia', dataDistribuicao: '2025-09-01', ultimaMovimentacao: '2026-07-15', status: 'ativo', valorCausa: 1200000, parteContraria: 'Esp\u00f3lio Familiar', advogadoResponsavel: 'Dr. Paulo Mendes' },
  { id: 'PROC-008', clienteId: 'CLT-007', numero: '6012345-67.2024.8.21.0001', tipo: 'Recupera\u00e7\u00e3o Judicial', area: 'Empresarial', tribunal: 'TJRS', vara: '1\u00aa Vara de Fal\u00eancias', dataDistribuicao: '2024-05-20', ultimaMovimentacao: '2026-08-10', status: 'arquivado', valorCausa: 4500000, parteContraria: 'Credores Diversos', advogadoResponsavel: 'Dr. Ricardo Torres' },
  { id: 'PROC-009', clienteId: 'CLT-008', numero: '7012345-67.2026.8.17.0001', tipo: 'Revisional de Alimentos', area: 'Fam\u00edlia', tribunal: 'TJPE', vara: '3\u00aa Vara de Fam\u00edlia', dataDistribuicao: '2026-07-01', ultimaMovimentacao: '2026-08-28', status: 'ativo', valorCausa: 48000, parteContraria: 'Jo\u00e3o Pedro Nunes Silva', advogadoResponsavel: 'Dra. Juliana Almeida' },
  { id: 'PROC-010', clienteId: 'CLT-009', numero: '8012345-67.2026.8.12.0001', tipo: 'Usucapi\u00e3o', area: 'Imobili\u00e1rio', tribunal: 'TJMS', vara: '2\u00aa Vara C\u00edvel', dataDistribuicao: '2026-07-10', ultimaMovimentacao: '2026-09-01', status: 'ativo', valorCausa: 180000, parteContraria: 'Esp\u00f3lio de Jos\u00e9 Antunes', advogadoResponsavel: 'Dr. Carlos Andrade' },
  { id: 'PROC-011', clienteId: 'CLT-010', numero: '9012345-67.2026.8.06.0001', tipo: 'Indeniza\u00e7\u00e3o Dano Moral', area: 'C\u00edvel', tribunal: 'TJCE', vara: '1\u00aa Vara C\u00edvel', dataDistribuicao: '2026-08-01', ultimaMovimentacao: '2026-08-25', status: 'recurso', valorCausa: 120000, parteContraria: 'Operadora Telef\u00f4nica XYZ', advogadoResponsavel: 'Dra. Mariana Costa' },
  { id: 'PROC-012', clienteId: 'CLT-011', numero: '0012345-67.2026.8.09.0001', tipo: 'Restitui\u00e7\u00e3o de Valores', area: 'Consumidor', tribunal: 'TJGO', vara: '4\u00aa Vara C\u00edvel', dataDistribuicao: '2026-08-05', ultimaMovimentacao: '2026-09-02', status: 'ativo', valorCausa: 25000, parteContraria: 'Vale do Rio Doce S.A.', advogadoResponsavel: 'Dra. Juliana Almeida' },
  { id: 'PROC-013', clienteId: 'CLT-012', numero: '1012345-67.2026.8.26.0200', tipo: 'Defesa do Consumidor', area: 'Consumidor', tribunal: 'TJSP', vara: '6\u00aa Vara C\u00edvel', dataDistribuicao: '2026-08-15', ultimaMovimentacao: '2026-08-28', status: 'recurso', valorCausa: 28000, parteContraria: 'Banco Ita\u00fa S.A.', advogadoResponsavel: 'Dr. Carlos Andrade' },
];

const insert = db.prepare('INSERT OR REPLACE INTO processo (id, clienteId, numero, tipo, area, tribunal, vara, dataDistribuicao, ultimaMovimentacao, status, valorCausa, parteContraria, advogadoResponsavel) VALUES (@id, @clienteId, @numero, @tipo, @area, @tribunal, @vara, @dataDistribuicao, @ultimaMovimentacao, @status, @valorCausa, @parteContraria, @advogadoResponsavel)');

const insertMany = db.transaction((items) => {
  for (const item of items) insert.run(item);
});

insertMany(processos);
console.log('Seeded ' + processos.length + ' processos');

db.exec(`UPDATE cliente SET totalProcessos = (SELECT COUNT(*) FROM processo WHERE processo.clienteId = cliente.id), processosAtivos = (SELECT COUNT(*) FROM processo WHERE processo.clienteId = cliente.id AND processo.status = 'ativo')`);
console.log('Client process counts updated');

db.close();
