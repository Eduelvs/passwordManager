"use client";

import { Eye, EyeOff, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Leva } from "leva";
import { GL } from "@/components/gl";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import {
  readVault,
  replaceVaultPassword,
  type VaultEntry,
} from "@/lib/vault-mock";

const fieldClass =
  "w-full h-12 pl-11 pr-4 rounded-lg bg-white/[0.06] border border-border font-mono text-sm text-foreground placeholder:text-foreground/35 outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25";

function maskPassword(value: string) {
  return "•".repeat(Math.min(value.length, 12));
}

export default function PasswordConsultPage() {
  const [items, setItems] = useState<VaultEntry[]>([]);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [panelActive, setPanelActive] = useState(false);
  const [tableHot, setTableHot] = useState(false);
  const hovering = panelActive || tableHot;

  const handlePanelBlurCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    setPanelActive(false);
  };

  useEffect(() => {
    setItems(readVault());
    setMounted(true);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (e) =>
        e.platform.toLowerCase().includes(q) ||
        e.login.toLowerCase().includes(q)
    );
  }, [items, query]);

  const toggleEye = (id: string) => {
    setVisible((v) => ({ ...v, [id]: !v[id] }));
  };

  const handleReset = (id: string) => {
    const next = replaceVaultPassword(id);
    setItems(next);
    setVisible((v) => ({ ...v, [id]: true }));
  };

  return (
    <>
      <Leva hidden />
      <div className="relative min-h-svh text-foreground">
        <GL hovering={hovering} />

        <div className="relative z-10 flex min-h-svh flex-col">
          <header className="border-b border-border/50 bg-black/40 backdrop-blur-xl">
            <div className="container flex h-16 items-center justify-between gap-4">
              <Link href="/" aria-label="Início">
                <Logo className="w-[80px]" />
              </Link>
              <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-foreground/50">
                <Link
                  href="/password/create"
                  className="transition-colors hover:text-foreground"
                >
                  Nova
                </Link>
                <span className="text-primary">Consultar</span>
              </nav>
            </div>
          </header>

          <main className="container max-w-4xl flex-1 py-10 md:py-14">
            <div
              className={cn(
                "rounded-2xl border border-border/70 bg-black/50 p-6 shadow-[0_0_0_1px_rgba(255,199,0,0.05)] backdrop-blur-md transition-[box-shadow,background-color] duration-500 md:p-10",
                panelActive &&
                  "bg-black/55 shadow-[0_0_50px_-16px_rgba(255,199,0,0.12)]"
              )}
              onFocusCapture={() => setPanelActive(true)}
              onBlurCapture={handlePanelBlurCapture}
            >
              <h1 className="font-sentient text-3xl tracking-tight">
                Suas senhas
              </h1>
              <p className="mt-2 font-mono text-sm text-foreground/50">
                Busque por plataforma ou login. Olho revela a senha (mock).
              </p>

              <div className="relative mt-8">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-foreground/35"
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={fieldClass}
                  placeholder="Buscar…"
                  aria-label="Buscar senhas"
                />
              </div>

              <div
                className="mt-6 overflow-x-auto rounded-lg border border-border/60 bg-black/20"
                onMouseEnter={() => setTableHot(true)}
                onMouseLeave={() => setTableHot(false)}
              >
                <table className="w-full min-w-[640px] border-collapse text-left font-mono text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-white/[0.03] text-xs uppercase tracking-widest text-foreground/45">
                <th className="px-4 py-3 font-medium">Plataforma</th>
                <th className="px-4 py-3 font-medium">Login</th>
                <th className="px-4 py-3 font-medium">Senha</th>
                <th className="w-14 px-2 py-3 font-medium">
                  <span className="sr-only">Revelar</span>
                </th>
                <th className="w-[120px] px-4 py-3 font-medium">Ação</th>
              </tr>
            </thead>
            <tbody>
              {!mounted ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-foreground/40"
                  >
                    Carregando…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-foreground/40"
                  >
                    Nenhum resultado.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/50 last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 text-foreground/90">
                      {row.platform}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-foreground/70">
                      {row.login}
                    </td>
                    <td className="px-4 py-3 text-foreground/80 tabular-nums tracking-wider">
                      {visible[row.id]
                        ? row.password
                        : maskPassword(row.password)}
                    </td>
                    <td className="px-2 py-3">
                      <button
                        type="button"
                        onClick={() => toggleEye(row.id)}
                        className={cn(
                          "inline-flex size-10 items-center justify-center rounded-md text-foreground/50 transition-colors",
                          "hover:bg-white/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                        )}
                        aria-label={
                          visible[row.id] ? "Ocultar senha" : "Mostrar senha"
                        }
                      >
                        {visible[row.id] ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleReset(row.id)}
                        className="font-mono text-xs uppercase tracking-wide text-primary/90 underline-offset-4 transition-colors hover:text-primary hover:underline"
                      >
                        Redefinir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
