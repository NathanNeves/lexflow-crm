import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface ClienteRow {
  id: string;
  nome: string;
  cpfCnpj: string;
  tipo: string;
  email: string;
  telefone: string;
  celular: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  dataCadastro: string;
  ultimoContato: string | null;
  status: string;
  segmento: string;
  origem: string;
  profissao: string;
  observacoes: string;
  tags: string;
  totalProcessos: number;
  processosAtivos: number;
  valorTotalCausas: number;
  createdAt: string;
  updatedAt: string;
}

function rowToCliente(row: ClienteRow) {
  return {
    id: row.id,
    nome: row.nome,
    cpfCnpj: row.cpfCnpj,
    tipo: row.tipo,
    contato: {
      email: row.email,
      telefone: row.telefone,
      celular: row.celular,
    },
    endereco: {
      logradouro: row.logradouro,
      numero: row.numero,
      complemento: row.complemento,
      bairro: row.bairro,
      cidade: row.cidade,
      estado: row.estado,
      cep: row.cep,
    },
    dataCadastro: row.dataCadastro,
    ultimoContato: row.ultimoContato,
    status: row.status,
    segmento: row.segmento,
    origem: row.origem,
    profissao: row.profissao,
    observacoes: row.observacoes,
    tags: JSON.parse(row.tags || "[]"),
    totalProcessos: row.totalProcessos,
    processosAtivos: row.processosAtivos,
    valorTotalCausas: row.valorTotalCausas,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const db = getDb();

    let sql = "SELECT * FROM cliente WHERE 1=1";
    const params: unknown[] = [];

    const busca = searchParams.get("busca");
    if (busca && busca.trim()) {
      sql += " AND (nome LIKE ? OR cpfCnpj LIKE ? OR email LIKE ?)";
      const term = `%${busca.trim()}%`;
      params.push(term, term, term);
    }

    const status = searchParams.get("status");
    if (status && status !== "todos") {
      sql += " AND status = ?";
      params.push(status);
    }

    const segmento = searchParams.get("segmento");
    if (segmento && segmento !== "todos") {
      sql += " AND segmento = ?";
      params.push(segmento);
    }

    const origem = searchParams.get("origem");
    if (origem && origem !== "todos") {
      sql += " AND origem = ?";
      params.push(origem);
    }

    const ordem = searchParams.get("ordem") || "recentes";
    switch (ordem) {
      case "antigos":
        sql += " ORDER BY dataCadastro ASC";
        break;
      case "nome-az":
        sql += " ORDER BY nome ASC";
        break;
      case "nome-za":
        sql += " ORDER BY nome DESC";
        break;
      case "processos":
        sql += " ORDER BY totalProcessos DESC";
        break;
      case "valor":
        sql += " ORDER BY valorTotalCausas DESC";
        break;
      case "recentes":
      default:
        sql += " ORDER BY dataCadastro DESC";
        break;
    }

    const rows = db.prepare(sql).all(...params) as ClienteRow[];
    const clientes = rows.map(rowToCliente);

    const total = clientes.length;
    const ativos = clientes.filter((c) => c.status === "ativo").length;
    const inativos = clientes.filter((c) => c.status === "inativo").length;
    const prospects = clientes.filter((c) => c.status === "prospect").length;
    const premium = clientes.filter((c) => c.segmento === "premium").length;

    return NextResponse.json({
      clientes,
      resumo: { total, ativos, inativos, prospects, premium },
    });
  } catch (error) {
    console.error("GET /api/clientes error:", error);
    return NextResponse.json(
      { error: "Erro ao listar clientes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const {
      nome,
      cpfCnpj,
      tipo = "PF",
      contato = {},
      endereco = {},
      status = "ativo",
      segmento = "standard",
      origem = "escritorio",
      profissao = "",
      observacoes = "",
      tags = [],
    } = body;

    if (!nome || !cpfCnpj) {
      return NextResponse.json(
        { error: "Nome e CPF/CNPJ são obrigatórios" },
        { status: 400 }
      );
    }

    const count = db.prepare("SELECT COUNT(*) as cnt FROM cliente").get() as {
      cnt: number;
    };
    const id = `CLT-${String(count.cnt + 1).padStart(3, "0")}`;
    const dataCadastro = new Date().toISOString().split("T")[0];

    db.prepare(
      `INSERT INTO cliente (
        id, nome, cpfCnpj, tipo,
        email, telefone, celular,
        logradouro, numero, complemento, bairro, cidade, estado, cep,
        dataCadastro, ultimoContato,
        status, segmento, origem,
        profissao, observacoes, tags,
        totalProcessos, processosAtivos, valorTotalCausas
      ) VALUES (
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        0, 0, 0
      )`
    ).run(
      id,
      nome,
      cpfCnpj,
      tipo,
      contato.email || "",
      contato.telefone || "",
      contato.celular || "",
      endereco.logradouro || "",
      endereco.numero || "",
      endereco.complemento || "",
      endereco.bairro || "",
      endereco.cidade || "",
      endereco.estado || "",
      endereco.cep || "",
      dataCadastro,
      dataCadastro,
      status,
      segmento,
      origem,
      profissao,
      observacoes,
      JSON.stringify(tags)
    );

    return NextResponse.json({ id, dataCadastro }, { status: 201 });
  } catch (error) {
    console.error("POST /api/clientes error:", error);
    return NextResponse.json(
      { error: "Erro ao criar cliente" },
      { status: 500 }
    );
  }
}
