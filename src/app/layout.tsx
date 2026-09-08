import type { Metadata } from "next"
import "@/styles/globals.css"
import { Providers } from "@/components/providers"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "LexFlow CRM — Gestão Jurídica Inteligente",
  description: "CRM completo para escritórios de advocacia. Gerencie clientes, processos, finanças, documentos, prazos e comunicação em um só lugar.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-64">
              <Header />
              <main className="flex-1 p-4 lg:p-6 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
