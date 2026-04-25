"use client";

import { EduelvsMark } from "@/components/eduelvs-mark";
import { GL } from "@/components/gl";
import { getStoredJwtSub } from "@/lib/jwt-sub";
import { cn } from "@/lib/utils";
import { ApiError } from "@/services/api/api";
import { useCreatePasswordMutation } from "@/services/mutations/password";
import { Leva } from "leva";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { toast } from "sonner";

const fieldClass =
  "w-full h-12 px-4 rounded-lg bg-white/[0.06] border border-border font-mono text-sm text-foreground placeholder:text-foreground/35 outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25";

const textareaClass =
  "w-full min-h-[88px] px-4 py-3 rounded-lg bg-white/[0.06] border border-border font-mono text-sm text-foreground placeholder:text-foreground/35 outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 resize-y";

export default function PasswordCreatePage() {
  const router = useRouter();
  const create = useCreatePasswordMutation();

  useEffect(() => {
    if (!getStoredJwtSub()) {
      router.replace("/sign-in");
    }
  }, [router]);
  const [formActive, setFormActive] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const hovering = formActive || btnHover;

  const handleFormBlurCapture = (e: React.FocusEvent<HTMLFormElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    setFormActive(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get("platform") ?? "").trim();
    const username = String(fd.get("login") ?? "").trim();
    const secret = String(fd.get("password") ?? "");
    const notesRaw = String(fd.get("notes") ?? "").trim();
    if (!title || !secret) return;

    try {
      await create.mutateAsync({
        title,
        secret,
        ...(username ? { username } : {}),
        ...(notesRaw ? { notes: notesRaw } : {}),
      });
      toast.success("Senha guardada");
      form.reset();
      startTransition(() => {
        router.push("/password/consult");
        router.refresh();
      });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Não foi possível guardar.";
      toast.error(msg);
    }
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
                <Link
                  href="/password/consult"
                  className="transition-colors hover:text-foreground"
                >
                  Consultar
                </Link>
              </nav>
            </div>
          </header>

          <main className="container flex flex-1 max-w-xl flex-col py-12 md:py-20">
            <div
              className={cn(
                "rounded-2xl border border-border/70 bg-black/50 p-8 shadow-[0_0_0_1px_rgba(255,199,0,0.05)] backdrop-blur-md transition-[box-shadow,background-color] duration-500 md:p-10",
                formActive &&
                  "bg-black/55 shadow-[0_0_50px_-16px_rgba(255,199,0,0.12)]",
              )}
            >
              <h1 className="font-sentient text-3xl tracking-tight">
                Nova senha
              </h1>
              <p className="mt-2 font-mono text-sm text-foreground/50">
                Os dados são guardados na sua conta.
              </p>

              <form
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
                    disabled={create.isPending}
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
                    placeholder="e-mail ou usuário (opcional)"
                    autoComplete="username"
                    disabled={create.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="font-mono text-xs uppercase tracking-widest text-foreground/45"
                  >
                    Senha
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={fieldClass}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    disabled={create.isPending}
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
                    disabled={create.isPending}
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  disabled={create.isPending}
                  className={cn(
                    "w-full rounded-lg border border-primary bg-primary/10 py-3 font-mono text-sm uppercase tracking-wider text-primary transition-colors",
                    "hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50",
                  )}
                >
                  {create.isPending ? "A guardar…" : "Salvar"}
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
