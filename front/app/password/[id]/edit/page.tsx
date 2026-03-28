"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Leva } from "leva";
import { GL } from "@/components/gl";
import { EduelvsMark } from "@/components/eduelvs-mark";
import { useRedirectOn401 } from "@/hooks/use-redirect-on-401";
import { cn } from "@/lib/utils";
import { getStoredJwtSub } from "@/lib/jwt-sub";
import { ApiError } from "@/services/api/api";
import {
  useDeletePasswordMutation,
  useUpdatePasswordMutation,
} from "@/services/mutations/password";
import { usePasswordQuery } from "@/services/queries/password";
import { toast } from "sonner";

const fieldClass =
  "w-full h-12 px-4 rounded-lg bg-white/[0.06] border border-border font-mono text-sm text-foreground placeholder:text-foreground/35 outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25";

const textareaClass =
  "w-full min-h-[88px] px-4 py-3 rounded-lg bg-white/[0.06] border border-border font-mono text-sm text-foreground placeholder:text-foreground/35 outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 resize-y";

export default function PasswordEditPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : undefined;
  const router = useRouter();
  const { data, isPending, error, isError } = usePasswordQuery(id);
  useRedirectOn401(error);

  const update = useUpdatePasswordMutation();
  const remove = useDeletePasswordMutation();
  const [formActive, setFormActive] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const hovering = formActive || btnHover;

  const handleFormBlurCapture = (e: React.FocusEvent<HTMLFormElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    setFormActive(false);
  };

  useEffect(() => {
    if (!getStoredJwtSub()) {
      router.replace("/sign-in");
    }
  }, [router]);

  useEffect(() => {
    if (!isPending && isError && error instanceof ApiError && error.status === 404) {
      toast.error("Registo não encontrado");
      router.replace("/password/consult");
    }
  }, [isPending, isError, error, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("platform") ?? "").trim();
    const username = String(fd.get("login") ?? "").trim();
    const secret = String(fd.get("password") ?? "").trim();
    const notesRaw = String(fd.get("notes") ?? "").trim();
    if (!title) return;

    update.mutate(
      {
        id,
        body: {
          title,
          username,
          ...(secret ? { secret } : {}),
          notes: notesRaw,
        },
      },
      {
        onSuccess: () => {
          toast.success("Alterações guardadas");
          router.push("/password/consult");
        },
        onError: (err) => {
          const msg =
            err instanceof ApiError
              ? err.message
              : "Não foi possível guardar.";
          toast.error(msg);
        },
      },
    );
  };

  if (!id) {
    return null;
  }

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
                <Link
                  href="/password/create"
                  className="transition-colors hover:text-foreground"
                >
                  Nova
                </Link>
                <Link
                  href="/password/consult"
                  className="transition-colors hover:text-foreground"
                >
                  Consultar
                </Link>
              </nav>
            </div>
          </header>

          <main className="container flex flex-1 max-w-md flex-col py-12 md:py-20">
            <div
              className={cn(
                "rounded-2xl border border-border/70 bg-black/50 p-8 shadow-[0_0_0_1px_rgba(255,199,0,0.05)] backdrop-blur-md transition-[box-shadow,background-color] duration-500 md:p-10",
                formActive &&
                  "bg-black/55 shadow-[0_0_50px_-16px_rgba(255,199,0,0.12)]",
              )}
            >
              <h1 className="font-sentient text-3xl tracking-tight">
                Editar senha
              </h1>
              <p className="mt-2 font-mono text-sm text-foreground/50">
                Atualize os campos e guarde.
              </p>

              {isPending && !data ? (
                <p className="mt-10 font-mono text-sm text-foreground/45">
                  A carregar…
                </p>
              ) : data ? (
                <form
                  key={data.id}
                  onSubmit={handleSubmit}
                  className="mt-10 space-y-6"
                  onFocusCapture={() => setFormActive(true)}
                  onBlurCapture={handleFormBlurCapture}
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="platform"
                      className="font-mono text-xs uppercase tracking-widest text-foreground/45"
                    >
                      Plataforma
                    </label>
                    <input
                      id="platform"
                      name="platform"
                      className={fieldClass}
                      placeholder="ex. GitHub"
                      autoComplete="off"
                      required
                      defaultValue={data.title}
                      disabled={update.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="login"
                      className="font-mono text-xs uppercase tracking-widest text-foreground/45"
                    >
                      Login
                    </label>
                    <input
                      id="login"
                      name="login"
                      className={fieldClass}
                      placeholder="e-mail ou usuário"
                      autoComplete="username"
                      defaultValue={data.username ?? ""}
                      disabled={update.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="font-mono text-xs uppercase tracking-widest text-foreground/45"
                    >
                      Senha do site
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className={fieldClass}
                      placeholder="Nova senha (vazio = manter a actual)"
                      autoComplete="new-password"
                      disabled={update.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="notes"
                      className="font-mono text-xs uppercase tracking-widest text-foreground/45"
                    >
                      Notas
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      className={textareaClass}
                      placeholder="Opcional"
                      rows={3}
                      defaultValue={data.notes ?? ""}
                      disabled={update.isPending}
                    />
                  </div>

                  <button
                    type="submit"
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                    disabled={update.isPending || remove.isPending}
                    className={cn(
                      "w-full rounded-lg border border-primary bg-primary/10 py-3 font-mono text-sm uppercase tracking-wider text-primary transition-colors",
                      "hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50",
                    )}
                  >
                    {update.isPending ? "A guardar…" : "Guardar alterações"}
                  </button>

                  <button
                    type="button"
                    disabled={update.isPending || remove.isPending}
                    onClick={() => {
                      if (
                        !confirm(
                          "Apagar este registo permanentemente? Esta ação não pode ser desfeita.",
                        )
                      ) {
                        return;
                      }
                      if (!id) return;
                      remove.mutate(id, {
                        onSuccess: () => {
                          toast.success("Registo apagado");
                          router.push("/password/consult");
                        },
                        onError: () =>
                          toast.error("Não foi possível apagar"),
                      });
                    }}
                    className="w-full rounded-lg border border-red-500/40 bg-red-500/10 py-3 font-mono text-sm uppercase tracking-wider text-red-400 transition-colors hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30 disabled:opacity-50"
                  >
                    {remove.isPending ? "A apagar…" : "Apagar registo"}
                  </button>
                </form>
              ) : null}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
