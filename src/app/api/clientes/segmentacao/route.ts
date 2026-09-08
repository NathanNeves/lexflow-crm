import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface SegmentoRow {
  segmento: string;
  total: number;
  ativos: number;
  inativos: number;
  prospects: number;
  valorTotal: number;
  processosAtivos: number;
  processosTotal: number;
}

interface OrigemRow {
  origem: string;
  segmento: string;
  total: number;
}

interface StatusSegmentoRow {
  status: string;
  segmento: string;
  total: number;
}

const SEGMENTO_LABELS: Record<string, string> = {
  premium: "Premium",
  standard: "Standard",
  basico: "Básico",
};

const ORIGEM_LABELS: Record<string, string> = {
  indicacao: "Indicação",
  google: "Google",
  redes_sociais: "Redes Sociais",
  site: "Site",
  escritorio: "Escritório",
  evento: "Evento",
  outro: "Outro",
};

const STATUS_LABELS: Record<string, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  prospect: "Prospect",
};

export async function GET() {
  try {
    const db = getDb();

    // Por segmento — counts + financials
    const porSegmento = db
      .prepare(
        `SELECT
          segmento,
          COUNT(*) as total,
          SUM(CASE WHEN status = 'ativo' THEN 1 ELSE 0 END) as ativos,
          SUM(CASE WHEN status = 'inativo' THEN 1 ELSE 0 END) as inativos,
          SUM(CASE WHEN status = 'prospect' THEN 1 ELSE 0 END) as prospects,
          COALESCE(SUM(valorTotalCausas), 0) as valorTotal,
          COALESCE(SUM(processosAtivos), 0) as processosAtivos,
          COALESCE(SUM(totalProcessos), 0) as processosTotal
        FROM cliente
        GROUP BY segmento
        ORDER BY
          CASE segmento
            WHEN 'premium' THEN 1
            WHEN 'standard' THEN 2
            WHEN 'basico' THEN 3
          END`
      )
      .all() as SegmentoRow[];

    // Por origem × segmento
    const porOrigemSegmento = db
      .prepare(
        `SELECT
          origem,
          segmento,
          COUNT(*) as total
        FROM cliente
        GROUP BY origem, segmento
        ORDER BY origem, segmento`
      )
      .all() as OrigemRow[];

    // Por status × segmento
    const porStatusSegmento = db
      .prepare(
        `SELECT
          status,
          segmento,
          COUNT(*) as total
        FROM cliente
        GROUP BY status, segmento
        ORDER BY status, segmento`
      )
      .all() as StatusSegmentoRow[];

    // Aggregate totals
    const totalGeral = porSegmento.reduce((acc, s) => acc + s.total, 0);
    const valorTotalGeral = porSegmento.reduce((acc, s) => acc + s.valorTotal, 0);

    return NextResponse.json({
      totalGeral,
      valorTotalGeral,
      porSegmento: porSegmento.map((s) => ({
        ...s,
        label: SEGMENTO_LABELS[s.segmento] || s.segmento,
      })),
      porOrigem: porOrigemSegmento.map((o) => ({
        ...o,
        label: ORIGEM_LABELS[o.origem] || o.origem,
        segmentoLabel: SEGMENTO_LABELS[o.segmento] || o.segmento,
      })),
      porStatus: porStatusSegmento.map((s) => ({
        ...s,
        label: STATUS_LABELS[s.status] || s.status,
        segmentoLabel: SEGMENTO_LABELS[s.segmento] || s.segmento,
      })),
      labels: {
        segmentos: SEGMENTO_LABELS,
        origens: ORIGEM_LABELS,
        status: STATUS_LABELS,
      },
    });
  } catch (error) {
    console.error("GET /api/clientes/segmentacao error:", error);
    return NextResponse.json(
      { error: "Erro ao carregar dados de segmentação" },
      { status: 500 }
    );
  }
}
