"use client";

import { GL } from "@/components/gl";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { Leva } from "leva";
import Link from "next/link";
import { useState } from "react";

const fieldClass =
  "w-full h-14 px-4 rounded-lg bg-white/[0.06] border border-border font-mono text-sm text-foreground placeholder:text-foreground/35 outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25";

export default function SignIn() {
  const [formActive, setFormActive] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const hovering = formActive || buttonHover;

  const handleFormBlurCapture = (e: React.FocusEvent<HTMLFormElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    setFormActive(false);
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
          <Logo className="w-[88px] md:w-[100px]" />
        </Link>

        <div className="relative z-10 w-full max-w-[440px]">
          <div
            className={cn(
              "rounded-2xl border border-border/70 bg-black/45 p-8 sm:p-10 shadow-[0_0_0_1px_rgba(255,199,0,0.06)] backdrop-blur-md transition-[box-shadow,background-color] duration-500",
              formActive && "bg-black/55 shadow-[0_0_60px_-12px_rgba(255,199,0,0.15)]"
            )}
          >
            <div className="mb-8 text-center">
              <h1 className="font-sentient text-3xl sm:text-4xl tracking-tight">
                Entrar na conta
              </h1>
              <p className="mt-3 font-mono text-sm text-foreground/55 text-balance">
                Autentique-se para continuar ao seu cofre de senhas.
              </p>
            </div>

            <form
              className="space-y-5"
              onFocusCapture={() => setFormActive(true)}
              onBlurCapture={handleFormBlurCapture}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="space-y-2">
                <label
                  htmlFor="signin-email"
                  className="block font-mono text-xs uppercase tracking-widest text-foreground/45"
                >
                  E-mail
                </label>
                <input
                  id="signin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  className={fieldClass}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="signin-password"
                    className="block font-mono text-xs uppercase tracking-widest text-foreground/45"
                  >
                    Senha
                  </label>
                  <button
                    type="button"
                    className="font-mono text-xs text-primary/90 underline-offset-4 hover:underline hover:text-primary"
                  >
                    Esqueci a senha
                  </button>
                </div>
                <input
                  id="signin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={fieldClass}
                  required
                />
              </div>

              <div
                className="mt-2 w-1/2 justify-self-center rounded-full h-14 text-base bg-primary text-black flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-all duration-300"
                onMouseEnter={() => setButtonHover(true)}
                onMouseLeave={() => setButtonHover(false)}
              >
                <p className="text-base font-bold">Entrar</p>
              </div>
            </form>

            <p className="mt-8 text-center font-mono text-xs text-foreground/45">
              Ainda não tem conta?{" "}
              <Link
                href="/"
                className="text-primary/90 underline-offset-4 hover:underline hover:text-primary"
              >
                Voltar ao início
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
