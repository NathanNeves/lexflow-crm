import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function formatCliente(row: Record<string, unknown>) {
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
    tags: JSON.parse((row.tags as string) || "[]"),
    totalProcessos: row.totalProcessos,
    processosAtivos: row.processosAtivos,
    valorTotalCausas: row.valorTotalCausas,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const row = db
      .prepare("SELECT * FROM cliente WHERE id = ?")
      .get(id) as Record<string, unknown> | undefined;

    if (!row) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(formatCliente(row));
  } catch (error) {
    console.error("GET /api/clientes/[id] error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cliente" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    const exists = db
      .prepare("SELECT id FROM cliente WHERE id = ?")
      .get(id) as { id: string } | undefined;

    if (!exists) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    const {
      nome,
      cpfCnpj,
      tipo,
      contato = {},
      endereco = {},
      status,
      segmento,
      origem,
      profissao,
      observacoes,
      tags,
    } = body;

    const updateFields: string[] = [];
    const updateParams: unknown[] = [];

    if (nome !== undefined) {
      updateFields.push("nome = ?");
      updateParams.push(nome);
    }
    if (cpfCnpj !== undefined) {
      updateFields.push("cpfCnpj = ?");
      updateParams.push(cpfCnpj);
    }
    if (tipo !== undefined) {
      updateFields.push("tipo = ?");
      updateParams.push(tipo);
    }
    if (contato.email !== undefined) {
      updateFields.push("email = ?");
      updateParams.push(contato.email);
    }
    if (contato.telefone !== undefined) {
      updateFields.push("telefone = ?");
      updateParams.push(contato.telefone);
    }
    if (contato.celular !== undefined) {
      updateFields.push("celular = ?");
      updateParams.push(contato.celular);
    }
    if (endereco.logradouro !== undefined) {
      updateFields.push("logradouro = ?");
      updateParams.push(endereco.logradouro);
    }
    if (endereco.numero !== undefined) {
      updateFields.push("numero = ?");
      updateParams.push(endereco.numero);
    }
    if (endereco.complemento !== undefined) {
      updateFields.push("complemento = ?");
      updateParams.push(endereco.complemento);
    }
    if (endereco.bairro !== undefined) {
      updateFields.push("bairro = ?");
      updateParams.push(endereco.bairro);
    }
    if (endereco.cidade !== undefined) {
      updateFields.push("cidade = ?");
      updateParams.push(endereco.cidade);
    }
    if (endereco.estado !== undefined) {
      updateFields.push("estado = ?");
      updateParams.push(endereco.estado);
    }
    if (endereco.cep !== undefined) {
      updateFields.push("cep = ?");
      updateParams.push(endereco.cep);
    }
    if (status !== undefined) {
      updateFields.push("status = ?");
      updateParams.push(status);
    }
    if (segmento !== undefined) {
      updateFields.push("segmento = ?");
      updateParams.push(segmento);
    }
    if (origem !== undefined) {
      updateFields.push("origem = ?");
      updateParams.push(origem);
    }
    if (profissao !== undefined) {
      updateFields.push("profissao = ?");
      updateParams.push(profissao);
    }
    if (observacoes !== undefined) {
      updateFields.push("observacoes = ?");
      updateParams.push(observacoes);
    }
    if (tags !== undefined) {
      updateFields.push("tags = ?");
      updateParams.push(JSON.stringify(tags));
    }

    if (updateFields.length > 0) {
      updateFields.push("updatedAt = datetime('now')");
      updateParams.push(id);

      db.prepare(
        `UPDATE cliente SET ${updateFields.join(", ")} WHERE id = ?`
      ).run(...updateParams);
    }

    const updated = db
      .prepare("SELECT * FROM cliente WHERE id = ?")
      .get(id) as Record<string, unknown>;

    return NextResponse.json(formatCliente(updated));
  } catch (error) {
    console.error("PUT /api/clientes/[id] error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cliente" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const exists = db
      .prepare("SELECT id FROM cliente WHERE id = ?")
      .get(id) as { id: string } | undefined;

    if (!exists) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    db.prepare("DELETE FROM cliente WHERE id = ?").run(id);

    return NextResponse.json({ message: "Cliente removido com sucesso" });
  } catch (error) {
    console.error("DELETE /api/clientes/[id] error:", error);
    return NextResponse.json(
      { error: "Erro ao remover cliente" },
      { status: 500 }
    );
  }
}
