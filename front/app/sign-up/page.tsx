"use client";

import { EduelvsMark } from "@/components/eduelvs-mark";
import { GL } from "@/components/gl";
import { cn } from "@/lib/utils";
import { ApiError } from "@/services/api/api";
import { useRegisterMutation } from "@/services/mutations/auth";
import { Leva } from "leva";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const fieldClass =
  "w-full h-14 px-4 rounded-lg bg-white/[0.06] border border-border font-mono text-sm text-foreground placeholder:text-foreground/35 outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25";

export default function SignUp() {
  const router = useRouter();
  const register = useRegisterMutation();
  const [formActive, setFormActive] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const hovering = formActive || buttonHover;

  const handleFormBlurCapture = (e: React.FocusEvent<HTMLFormElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    setFormActive(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    if (!email || !password) return;

    register.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Conta criada");
          router.push("/password/consult");
          router.refresh();
        },
        onError: (err) => {
          const msg =
            err instanceof ApiError
              ? err.message
              : "Não foi possível cadastrar. Tente novamente.";
          toast.error(msg);
        },
      },
    );
  };

  return (
    <>
      <Leva hidden />
      <div className="relative min-h-svh flex flex-col items-center justify-center px-4 py-24 md:py-16">
        <GL hovering={hovering} />

        <Link
          href="/"
          className="fixed top-8 left-0 right-0 z-20 container flex justify-start opacity-90 transition-opacity hover:opacity-100"
          aria-label="Voltar ao início"
        >
          <EduelvsMark variant="hero" />
        </Link>

        <div className="relative z-10 w-full max-w-[440px]">
          <div
            className={cn(
              "auth-glass-panel rounded-2xl p-8 sm:p-10 transition-[background-color,border-color,box-shadow] duration-500",
              formActive && "auth-glass-panel--focus",
            )}
          >
            <div className="mb-8 text-center">
              <h1 className="font-sentient text-3xl sm:text-4xl tracking-tight">
                Criar conta
              </h1>
              <p className="mt-3 font-mono text-sm text-foreground/55 text-balance">
                Cadastre-se para guardar as suas senhas com segurança.
              </p>
            </div>

            <form
              className="space-y-5"
              onFocusCapture={() => setFormActive(true)}
              onBlurCapture={handleFormBlurCapture}
              onSubmit={handleSubmit}
            >
              <div className="space-y-2">
                <label
                  htmlFor="signup-email"
                  className="block font-mono text-xs uppercase tracking-widest text-foreground/45"
                >
                  E-mail
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  className={fieldClass}
                  required
                  disabled={register.isPending}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signup-password"
                  className="block font-mono text-xs uppercase tracking-widest text-foreground/45"
                >
                  Senha
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="mínimo 6 caracteres"
                  className={fieldClass}
                  required
                  minLength={6}
                  disabled={register.isPending}
                />
              </div>

              <button
                type="submit"
                disabled={register.isPending}
                onMouseEnter={() => setButtonHover(true)}
                onMouseLeave={() => setButtonHover(false)}
                className="mt-2 w-full rounded-full h-14 text-base bg-primary text-black flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-all duration-300 font-bold disabled:opacity-60 disabled:pointer-events-none"
              >
                {register.isPending ? "Criando…" : "Cadastrar"}
              </button>
            </form>

            <p className="mt-8 text-center font-mono text-xs text-foreground/45">
              Já tem conta?{" "}
              <Link
                href="/sign-in"
                className="text-primary/90 underline-offset-4 hover:underline hover:text-primary"
              >
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
