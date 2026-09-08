import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface ProcessoRow {
  id: string;
  clienteId: string;
  numero: string;
  tipo: string;
  area: string;
  tribunal: string;
  vara: string;
  dataDistribuicao: string | null;
  ultimaMovimentacao: string | null;
  status: string;
  valorCausa: number;
  parteContraria: string;
  advogadoResponsavel: string;
  createdAt: string;
  updatedAt: string;
  clienteNome?: string;
}

function rowToProcesso(row: ProcessoRow) {
  return {
    id: row.id,
    clienteId: row.clienteId,
    clienteNome: row.clienteNome || "",
    numero: row.numero,
    tipo: row.tipo,
    area: row.area,
    tribunal: row.tribunal,
    vara: row.vara,
    dataDistribuicao: row.dataDistribuicao,
    ultimaMovimentacao: row.ultimaMovimentacao,
    status: row.status,
    valorCausa: row.valorCausa,
    parteContraria: row.parteContraria,
    advogadoResponsavel: row.advogadoResponsavel,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const db = getDb();

    let sql = `SELECT p.*, c.nome as clienteNome
               FROM processo p
               LEFT JOIN cliente c ON p.clienteId = c.id
               WHERE 1=1`;
    const params: unknown[] = [];

    const busca = searchParams.get("busca");
    if (busca && busca.trim()) {
      sql += " AND (p.numero LIKE ? OR p.tipo LIKE ? OR p.area LIKE ? OR p.parteContraria LIKE ? OR c.nome LIKE ?)";
      const term = `%${busca.trim()}%`;
      params.push(term, term, term, term, term);
    }

    const status = searchParams.get("status");
    if (status && status !== "todos") {
      sql += " AND p.status = ?";
      params.push(status);
    }

    const area = searchParams.get("area");
    if (area && area !== "todas") {
      sql += " AND p.area = ?";
      params.push(area);
    }

    const clienteId = searchParams.get("clienteId");
    if (clienteId) {
      sql += " AND p.clienteId = ?";
      params.push(clienteId);
    }

    const ordem = searchParams.get("ordem") || "recentes";
    switch (ordem) {
      case "antigos":
        sql += " ORDER BY p.dataDistribuicao ASC";
        break;
      case "valor-maior":
        sql += " ORDER BY p.valorCausa DESC";
        break;
      case "valor-menor":
        sql += " ORDER BY p.valorCausa ASC";
        break;
      case "recentes":
      default:
        sql += " ORDER BY p.createdAt DESC";
        break;
    }

    const rows = db.prepare(sql).all(...params) as ProcessoRow[];
    const processos = rows.map(rowToProcesso);

    const total = processos.length;
    const ativos = processos.filter((p) => p.status === "ativo").length;
    const suspensos = processos.filter((p) => p.status === "suspenso").length;
    const arquivados = processos.filter((p) => p.status === "arquivado").length;
    const emRecurso = processos.filter((p) => p.status === "recurso").length;
    const valorTotal = processos.reduce((acc, p) => acc + p.valorCausa, 0);

    return NextResponse.json({
      processos,
      resumo: { total, ativos, suspensos, arquivados, emRecurso, valorTotal },
    });
  } catch (error) {
    console.error("GET /api/processos error:", error);
    return NextResponse.json(
      { error: "Erro ao listar processos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const {
      clienteId,
      numero,
      tipo = "",
      area = "",
      tribunal = "",
      vara = "",
      dataDistribuicao = "",
      status = "ativo",
      valorCausa = 0,
      parteContraria = "",
      advogadoResponsavel = "",
    } = body;

    if (!clienteId || !numero) {
      return NextResponse.json(
        { error: "Cliente e número do processo são obrigatórios" },
        { status: 400 }
      );
    }

    // Verify client exists
    const cliente = db.prepare("SELECT id, nome FROM cliente WHERE id = ?").get(clienteId) as { id: string; nome: string } | undefined;
    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 400 }
      );
    }

    const count = db.prepare("SELECT COUNT(*) as cnt FROM processo").get() as { cnt: number };
    const id = `PRO-${String(count.cnt + 1).padStart(4, "0")}`;
    const now = new Date().toISOString().replace("T", " ").slice(0, 19);

    db.prepare(
      `INSERT INTO processo (
        id, clienteId, numero, tipo, area, tribunal, vara,
        dataDistribuicao, ultimaMovimentacao, status, valorCausa,
        parteContraria, advogadoResponsavel, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id, clienteId, numero, tipo, area, tribunal, vara,
      dataDistribuicao || null, now, status, valorCausa,
      parteContraria, advogadoResponsavel, now, now
    );

    // Update cliente counters
    db.prepare(
      "UPDATE cliente SET totalProcessos = totalProcessos + 1, processosAtivos = processosAtivos + 1, valorTotalCausas = valorTotalCausas + ?, updatedAt = datetime('now') WHERE id = ?"
    ).run(valorCausa, clienteId);

    // Read back with JOIN
    const row = db.prepare(
      `SELECT p.*, c.nome as clienteNome FROM processo p LEFT JOIN cliente c ON p.clienteId = c.id WHERE p.id = ?`
    ).get(id) as ProcessoRow;

    return NextResponse.json(rowToProcesso(row), { status: 201 });
  } catch (error) {
    console.error("POST /api/processos error:", error);
    return NextResponse.json(
      { error: "Erro ao criar processo" },
      { status: 500 }
    );
  }
}
