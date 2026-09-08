"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await signUp.email({ email, password, name });
      } else {
        await signIn.email({ email, password });
      }
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || err?.error?.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-law-navy via-law-navy/95 to-slate-900">
      <Card className="w-full max-w-md border-law-gold/20 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-2">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-law-gold to-amber-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-law-navy">LF</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-law-navy">
            {isRegister ? "Criar Conta" : "Entrar no LexFlow"}
          </CardTitle>
          <CardDescription>
            {isRegister
              ? "Preencha os dados para criar sua conta"
              : "Acesse sua conta para continuar"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full bg-law-gold hover:bg-amber-500 text-law-navy font-semibold" disabled={loading}>
              {loading ? "Aguarde..." : isRegister ? "Criar Conta" : "Entrar"}
            </Button>
            <p className="text-sm text-slate-500">
              {isRegister ? "Já tem conta?" : "Não tem conta?"}{" "}
              <button
                type="button"
                className="text-law-gold hover:text-amber-500 font-medium underline underline-offset-2"
                onClick={() => { setIsRegister(!isRegister); setError(""); }}
              >
                {isRegister ? "Fazer login" : "Cadastre-se"}
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
