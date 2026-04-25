"use client";

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { EduelvsMark } from "@/components/eduelvs-mark";
import { GL } from "@/components/gl";
import { useRedirectOn401 } from "@/hooks/use-redirect-on-401";
import { getStoredJwtSub } from "@/lib/jwt-sub";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/services/mutations/auth";
import { useDeletePasswordMutation } from "@/services/mutations/password";
import { usePasswordsQuery } from "@/services/queries/password";
import { Leva } from "leva";
import { Copy, Eye, EyeOff, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const fieldClass =
  "w-full h-12 pl-11 pr-4 rounded-lg bg-white/[0.06] border border-border font-mono text-sm text-foreground placeholder:text-foreground/35 outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25";

function maskPassword(value: string) {
  return "•".repeat(Math.min(value.length, 12));
}

export default function PasswordConsultPage() {
  const router = useRouter();
  const { data: items = [], isPending, error, isError } = usePasswordsQuery();
  useRedirectOn401(error);

  useEffect(() => {
    if (!getStoredJwtSub()) {
      router.replace("/sign-in");
    }
  }, [router]);

  const logout = useLogoutMutation();
  const removePassword = useDeletePasswordMutation();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [panelActive, setPanelActive] = useState(false);
  const [tableHot, setTableHot] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const hovering = panelActive || tableHot;

  const handlePanelBlurCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    setPanelActive(false);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.username?.toLowerCase().includes(q) ?? false) ||
        (e.notes?.toLowerCase().includes(q) ?? false),
    );
  }, [items, query]);

  const toggleEye = (id: string) => {
    setVisible((v) => ({ ...v, [id]: !v[id] }));
  };

  const copyPassword = (id: string) => {
    navigator.clipboard.writeText(filtered.find((e) => e.id === id)?.secret ?? "");
    toast.success("Senha copiada para área de transferência");
  };

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast.success("Sessão encerrada");
        router.push("/sign-in");
        router.refresh();
      },
      onError: () => toast.error("Não foi possível sair"),
    });
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
                <EduelvsMark variant="header" />
              </Link>
              <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-foreground/50">
                <div className="flex items-center gap-6 bg-white/90 rounded-full p-2 hover:scale-105 transition-all duration-300">
                  <Link
                    href="/password/create"
                    className="transition-colors hover:text-black/85 text-black"
                  >
                    Adicionar uma nova senha
                  </Link>
                </div>
                <span className="text-primary">Consultar</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className="transition-colors hover:text-foreground disabled:opacity-50"
                >
                  Sair
                </button>
              </nav>
            </div>
          </header>

          <main className="container max-w-7xl flex-1 py-10 md:py-14">
            <div
              className={cn(
                "rounded-2xl border border-border/70 bg-black/50 p-6 shadow-[0_0_0_1px_rgba(255,199,0,0.05)] backdrop-blur-md transition-[box-shadow,background-color] duration-500 md:p-10",
                panelActive &&
                  "bg-black/55 shadow-[0_0_50px_-16px_rgba(255,199,0,0.12)]",
              )}
              onFocusCapture={() => setPanelActive(true)}
              onBlurCapture={handlePanelBlurCapture}
            >
              <h1 className="font-sentient text-3xl tracking-tight">
                Suas senhas
              </h1>
              <p className="mt-2 font-mono text-sm text-foreground/50">
                Busque por plataforma, login ou notas. O ícone revela a senha.
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
                <table className="w-full min-w-[880px] border-collapse text-left font-mono text-sm">
                  <thead>
                    <tr className="border-b border-border/80 bg-white/[0.03] text-xs uppercase tracking-widest text-foreground/45">
                      <th className="px-4 py-3 font-medium">Plataforma</th>
                      <th className="px-4 py-3 font-medium">Login</th>
                      <th className="max-w-[160px] px-4 py-3 font-medium">
                        Notas
                      </th>
                      <th className="px-4 py-3 font-medium">Senha</th>
                      <th className="w-14 px-2 py-3 font-medium">
                        <span className="sr-only">Revelar</span>
                      </th>
                      <th className="min-w-[140px] px-4 py-3 font-medium">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isPending ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-10 text-center text-foreground/40"
                        >
                          Carregando…
                        </td>
                      </tr>
                    ) : isError ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-10 text-center text-foreground/40"
                        >
                          Não foi possível carregar. Verifique se está
                          autenticado.
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
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
                            {row.title}
                          </td>
                          <td className="max-w-[200px] truncate px-4 py-3 text-foreground/70">
                            {row.username ?? "—"}
                          </td>
                          <td
                            className="max-w-[160px] truncate px-4 py-3 text-foreground/55"
                            title={row.notes ?? undefined}
                          >
                            {row.notes?.trim() ? row.notes : "—"}
                          </td>
                          <td className="px-4 py-3 text-foreground/80 tabular-nums tracking-wider">
                            {visible[row.id]
                              ? row.secret
                              : maskPassword(row.secret)}
                          </td>

                                                    
                          <td className="px-2 py-3">
                            <button
                              type="button"
                              onClick={() => copyPassword(row.id)}
                              className={cn(
                                "inline-flex size-10 items-center justify-center rounded-md text-foreground/50 transition-colors",
                                "hover:bg-white/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                              )}
                              aria-label={
                                visible[row.id]
                                  ? "Copiar senha"
                                  : "Copiar senha para área de transferência"
                              }
                            >
                              {visible[row.id] ? (
                                <Copy className="size-4" />
                              ) : (
                                <Copy className="size-4" />
                              )}
                            </button>
                          </td>

                          <td className="px-2 py-3">
                            <button
                              type="button"
                              onClick={() => toggleEye(row.id)}
                              className={cn(
                                "inline-flex size-10 items-center justify-center rounded-md text-foreground/50 transition-colors",
                                "hover:bg-white/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                              )}
                              aria-label={
                                visible[row.id]
                                  ? "Ocultar senha"
                                  : "Mostrar senha"
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
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              <Link
                                href={`/password/${row.id}/edit`}
                                className="font-mono text-xs uppercase tracking-wide text-primary/90 underline-offset-4 transition-colors hover:text-primary hover:underline"
                              >
                                Editar
                              </Link>
                              <button
                                type="button"
                                disabled={removePassword.isPending}
                                onClick={() =>
                                  setDeleteTarget({
                                    id: row.id,
                                    title: row.title,
                                  })
                                }
                                className="font-mono text-xs uppercase tracking-wide text-red-400/90 underline-offset-4 transition-colors hover:text-red-300 hover:underline disabled:opacity-50"
                              >
                                Apagar
                              </button>
                            </div>
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

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Apagar este registo?"
        description={
          deleteTarget
            ? `O registo «${deleteTarget.title}» será eliminado permanentemente. Esta ação não pode ser desfeita.`
            : ""
        }
        isPending={removePassword.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          removePassword.mutate(deleteTarget.id, {
            onSuccess: () => {
              toast.success("Registo apagado");
              setDeleteTarget(null);
            },
            onError: () => toast.error("Não foi possível apagar"),
          });
        }}
      />
    </>
  );
}
