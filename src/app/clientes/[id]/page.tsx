"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatCurrency, formatDate, initials } from "@/lib/utils";

type Cliente = {
  id: string;
  nome: string;
  cpfCnpj: string;
  tipo: string;
  contato: { email: string; telefone: string; celular: string };
  endereco: { logradouro: string; numero: string; complemento?: string; bairro: string; cidade: string; estado: string; cep: string };
  dataCadastro: string;
  ultimoContato: string;
  status: string;
  segmento: string;
  origem: string;
  profissao?: string;
  observacoes?: string;
  tags: string[];
  totalProcessos: number;
  processosAtivos: number;
  valorTotalCausas: number;
  processos?: { id: string; numero: string; tipo: string; area: string; tribunal: string; vara: string; dataDistribuicao: string; ultimaMovimentacao: string; status: string; valorCausa: number; parteContraria: string; advogadoResponsavel: string }[];
};

export default function PerfilCliente() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/clientes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Cliente não encontrado");
        return res.json();
      })
      .then((data) => {
        setCliente(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-law-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-law-slate">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-law-mahogany font-medium text-lg">{error || "Cliente não encontrado"}</p>
        <Link href="/clientes" className="text-law-gold hover:underline text-sm">
          ← Voltar para lista de clientes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Link href="/clientes" className="text-sm text-law-slate hover:text-law-navy transition-colors inline-flex items-center gap-1 mb-4">
        ← Voltar para Clientes
      </Link>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-law-navy text-white flex items-center justify-center text-xl font-bold">
            {initials(cliente.nome)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-law-navy">{cliente.nome}</h1>
            <p className="text-sm text-law-slate">{cliente.cpfCnpj}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <p className="text-xs text-law-slate uppercase">Total Processos</p>
          <p className="text-2xl font-bold text-law-navy">{cliente.totalProcessos}</p>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <p className="text-xs text-law-slate uppercase">Processos Ativos</p>
          <p className="text-2xl font-bold text-emerald-700">{cliente.processosAtivos}</p>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <p className="text-xs text-law-slate uppercase">Valor Total</p>
          <p className="text-2xl font-bold text-law-gold">{formatCurrency(cliente.valorTotalCausas)}</p>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <p className="text-xs text-law-slate uppercase">Último Contato</p>
          <p className="text-lg font-bold text-law-navy">{cliente.ultimoContato ? formatDate(cliente.ultimoContato) : "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-law-navy mb-4">Informações do cliente</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><dt className="text-law-slate">Tipo</dt><dd className="font-medium text-law-navy">{cliente.tipo}</dd></div>
            <div><dt className="text-law-slate">Profissão</dt><dd className="font-medium text-law-navy">{cliente.profissao || "—"}</dd></div>
            <div><dt className="text-law-slate">Segmento</dt><dd className="font-medium text-law-navy">{cliente.segmento}</dd></div>
            <div><dt className="text-law-slate">Origem</dt><dd className="font-medium text-law-navy">{cliente.origem.replaceAll("_", " ")}</dd></div>
            <div className="sm:col-span-2"><dt className="text-law-slate">Contato</dt><dd className="font-medium text-law-navy">{cliente.contato.email} · {cliente.contato.telefone || cliente.contato.celular || "—"}</dd></div>
            <div className="sm:col-span-2"><dt className="text-law-slate">Endereço</dt><dd className="font-medium text-law-navy">{cliente.endereco.logradouro}, {cliente.endereco.numero} — {cliente.endereco.bairro}, {cliente.endereco.cidade}/{cliente.endereco.estado}</dd></div>
          </dl>
        </section>

        <section className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-law-navy mb-4">Processos vinculados</h2>
          {(cliente.processos || []).length === 0 ? (
            <p className="text-sm text-law-slate">Nenhum processo vinculado a este cliente.</p>
          ) : (
            <div className="space-y-4">
              {cliente.processos?.map((processo) => (
                <div key={processo.id} className="border-l-2 border-law-gold pl-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-law-navy">{processo.numero}</p>
                    <span className="text-xs rounded-full bg-emerald-50 text-emerald-700 px-2 py-1">{processo.status}</span>
                  </div>
                  <p className="text-sm text-law-slate">{processo.tipo} · {processo.area} · {processo.tribunal}</p>
                  <p className="text-xs text-law-slate mt-1">Última movimentação: {formatDate(processo.ultimaMovimentacao)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {cliente.tags?.length > 0 && (
        <section className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-law-navy mb-3">Tags e observações</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {cliente.tags.map((tag) => <span key={tag} className="text-xs rounded-full bg-law-parchment text-law-navy px-3 py-1">{tag}</span>)}
          </div>
          {cliente.observacoes && <p className="text-sm text-law-slate whitespace-pre-wrap">{cliente.observacoes}</p>}
        </section>
      )}
    </div>
  );
}
