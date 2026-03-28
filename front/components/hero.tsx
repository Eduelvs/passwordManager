"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { GL } from "./gl";
import { Pill } from "./pill";
import { Button } from "./ui/button";

export function Hero() {
  const [hovering, setHovering] = useState(false);
  return (
    <div className="flex flex-col h-svh justify-between relative z-11">
      <GL hovering={hovering} />

      <div className="relative z-10 mt-[400px] text-center">
        <Pill className="mb-6" colorDot="secondary">SEGURO</Pill>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient">
         Olá Eduardo!<br />
          <i className="font-light">É um prazer te ver aqui</i>
        </h1>
        <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance mt-8 max-w-[440px] mx-auto">
          Seja bem-vindo ao seu sistema de gerenciamento de senhas.
        </p>

        <Link className="inline-block max-sm:hidden" href="/sign-in">
          <div
            className={cn(
              "glass-backdrop mt-14 inline-flex cursor-pointer items-center justify-center rounded-full border px-6 py-3 text-white! transition-all duration-300 ease-out active:scale-[0.98] active:translate-y-0 motion-reduce:transition-colors motion-reduce:hover:scale-100 motion-reduce:hover:translate-y-0",
              "border-primary-foreground/8 bg-primary/3 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:border-white/8 dark:bg-white/4 dark:text-primary-foreground dark:shadow-[0_4px_24px_rgba(0,0,0,0.15)]",
              hovering &&
                "-translate-y-0.5 scale-[1.03] border-primary-foreground/16 bg-primary/7 shadow-[0_10px_32px_rgba(0,0,0,0.08)] dark:border-white/14 dark:bg-white/7 dark:shadow-[0_10px_36px_rgba(0,0,0,0.22)]",
            )}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            Entrar
          </div>
        </Link>
        <Link className="contents sm:hidden" href="/sign-in">
          <Button
            size="sm"
            className="mt-14 hover:-translate-y-0.5 hover:scale-[1.03] active:translate-y-0 active:scale-[0.98] motion-reduce:hover:scale-100 motion-reduce:hover:translate-y-0"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            Entrar
          </Button>
        </Link>
      </div>
    </div>
  );
}
