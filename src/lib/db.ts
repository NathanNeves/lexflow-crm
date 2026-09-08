import Database from "better-sqlite3";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database("./lexflow.db");
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cliente (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      cpfCnpj TEXT NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('PF','PJ')),
      email TEXT NOT NULL,
      telefone TEXT NOT NULL DEFAULT '',
      celular TEXT NOT NULL DEFAULT '',
      logradouro TEXT NOT NULL DEFAULT '',
      numero TEXT NOT NULL DEFAULT '',
      complemento TEXT DEFAULT '',
      bairro TEXT NOT NULL DEFAULT '',
      cidade TEXT NOT NULL DEFAULT '',
      estado TEXT NOT NULL DEFAULT '',
      cep TEXT NOT NULL DEFAULT '',
      dataCadastro TEXT NOT NULL,
      ultimoContato TEXT,
      status TEXT NOT NULL DEFAULT 'ativo' CHECK(status IN ('ativo','inativo','prospect')),
      segmento TEXT NOT NULL DEFAULT 'standard' CHECK(segmento IN ('premium','standard','basico')),
      origem TEXT NOT NULL DEFAULT 'escritorio' CHECK(origem IN ('indicacao','google','redes_sociais','site','escritorio','evento','outro')),
      profissao TEXT DEFAULT '',
      observacoes TEXT DEFAULT '',
      tags TEXT DEFAULT '[]',
      totalProcessos INTEGER NOT NULL DEFAULT 0,
      processosAtivos INTEGER NOT NULL DEFAULT 0,
      valorTotalCausas REAL NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS processo (
      id TEXT PRIMARY KEY,
      clienteId TEXT NOT NULL REFERENCES cliente(id) ON DELETE CASCADE,
      numero TEXT NOT NULL,
      tipo TEXT NOT NULL DEFAULT '',
      area TEXT NOT NULL DEFAULT '',
      tribunal TEXT NOT NULL DEFAULT '',
      vara TEXT NOT NULL DEFAULT '',
      dataDistribuicao TEXT,
      ultimaMovimentacao TEXT,
      status TEXT NOT NULL DEFAULT 'ativo' CHECK(status IN ('ativo','arquivado','suspenso','recurso')),
      valorCausa REAL NOT NULL DEFAULT 0,
      parteContraria TEXT NOT NULL DEFAULT '',
      advogadoResponsavel TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_cliente_status ON cliente(status);
    CREATE INDEX IF NOT EXISTS idx_cliente_segmento ON cliente(segmento);
    CREATE INDEX IF NOT EXISTS idx_cliente_nome ON cliente(nome);
    CREATE INDEX IF NOT EXISTS idx_processo_cliente ON processo(clienteId);
    CREATE INDEX IF NOT EXISTS idx_processo_status ON processo(status);
  `);
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
