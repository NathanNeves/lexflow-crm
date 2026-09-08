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

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = getDb();

    const row = db
      .prepare(
        `SELECT p.*, c.nome as clienteNome FROM processo p LEFT JOIN cliente c ON p.clienteId = c.id WHERE p.id = ?`
      )
      .get(id) as ProcessoRow | undefined;

    if (!row) {
      return NextResponse.json(
        { error: "Processo não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(rowToProcesso(row));
  } catch (error) {
    console.error("GET /api/processos/[id] error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar processo" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const db = getDb();

    const existing = db
      .prepare("SELECT * FROM processo WHERE id = ?")
      .get(id) as ProcessoRow | undefined;

    if (!existing) {
      return NextResponse.json(
        { error: "Processo não encontrado" },
        { status: 404 }
      );
    }

    const {
      clienteId,
      numero,
      tipo,
      area,
      tribunal,
      vara,
      dataDistribuicao,
      status,
      valorCausa,
      parteContraria,
      advogadoResponsavel,
    } = body;

    const updateFields: string[] = [];
    const updateParams: unknown[] = [];

    if (clienteId !== undefined) { updateFields.push("clienteId = ?"); updateParams.push(clienteId); }
    if (numero !== undefined) { updateFields.push("numero = ?"); updateParams.push(numero); }
    if (tipo !== undefined) { updateFields.push("tipo = ?"); updateParams.push(tipo); }
    if (area !== undefined) { updateFields.push("area = ?"); updateParams.push(area); }
    if (tribunal !== undefined) { updateFields.push("tribunal = ?"); updateParams.push(tribunal); }
    if (vara !== undefined) { updateFields.push("vara = ?"); updateParams.push(vara); }
    if (dataDistribuicao !== undefined) { updateFields.push("dataDistribuicao = ?"); updateParams.push(dataDistribuicao || null); }
    if (status !== undefined) { updateFields.push("status = ?"); updateParams.push(status); }
    if (valorCausa !== undefined) { updateFields.push("valorCausa = ?"); updateParams.push(valorCausa); }
    if (parteContraria !== undefined) { updateFields.push("parteContraria = ?"); updateParams.push(parteContraria); }
    if (advogadoResponsavel !== undefined) { updateFields.push("advogadoResponsavel = ?"); updateParams.push(advogadoResponsavel); }

    if (updateFields.length > 0) {
      updateFields.push("updatedAt = datetime('now')");
      updateParams.push(id);
      db.prepare(`UPDATE processo SET ${updateFields.join(", ")} WHERE id = ?`).run(...updateParams);
    }

    // Recalculate cliente counters
    if (status !== undefined || valorCausa !== undefined || clienteId !== undefined) {
      const cid = clienteId !== undefined ? clienteId : existing.clienteId;
      const counts = db
        .prepare(
          `SELECT COUNT(*) as total, SUM(CASE WHEN status IN ('ativo','recurso') THEN 1 ELSE 0 END) as ativos, SUM(valorCausa) as valorTotal FROM processo WHERE clienteId = ?`
        )
        .get(cid) as { total: number; ativos: number; valorTotal: number };
      db.prepare(
        "UPDATE cliente SET totalProcessos = ?, processosAtivos = ?, valorTotalCausas = ?, updatedAt = datetime('now') WHERE id = ?"
      ).run(counts.total, counts.ativos, counts.valorTotal || 0, cid);
    }

    const updated = db
      .prepare(
        `SELECT p.*, c.nome as clienteNome FROM processo p LEFT JOIN cliente c ON p.clienteId = c.id WHERE p.id = ?`
      )
      .get(id) as ProcessoRow;

    return NextResponse.json(rowToProcesso(updated));
  } catch (error) {
    console.error("PUT /api/processos/[id] error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar processo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = getDb();

    const existing = db
      .prepare("SELECT * FROM processo WHERE id = ?")
      .get(id) as ProcessoRow | undefined;

    if (!existing) {
      return NextResponse.json(
        { error: "Processo não encontrado" },
        { status: 404 }
      );
    }

    const clienteId = existing.clienteId;
    const valorCausa = existing.valorCausa;
    const wasActive = existing.status === "ativo" || existing.status === "recurso";

    db.prepare("DELETE FROM processo WHERE id = ?").run(id);

    // Update cliente counters
    if (wasActive) {
      db.prepare(
        "UPDATE cliente SET totalProcessos = totalProcessos - 1, processosAtivos = processosAtivos - 1, valorTotalCausas = valorTotalCausas - ?, updatedAt = datetime('now') WHERE id = ?"
      ).run(valorCausa, clienteId);
    } else {
      db.prepare(
        "UPDATE cliente SET totalProcessos = totalProcessos - 1, valorTotalCausas = valorTotalCausas - ?, updatedAt = datetime('now') WHERE id = ?"
      ).run(valorCausa, clienteId);
    }

    return NextResponse.json({ message: "Processo removido com sucesso" });
  } catch (error) {
    console.error("DELETE /api/processos/[id] error:", error);
    return NextResponse.json(
      { error: "Erro ao remover processo" },
      { status: 500 }
    );
  }
}
