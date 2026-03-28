"use client";

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

      <div className=" mt-[400px] text-center relative">
        <Pill className="mb-6">SHIELD</Pill>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient">
         Olá Eduardo!<br />
          <i className="font-light">É um prazer te ver aqui</i>
        </h1>
        <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance mt-8 max-w-[440px] mx-auto">
          Seja bem-vindo ao seu sistema de gerenciamento de senhas.
        </p>

        <Link className="contents max-sm:hidden" href="/sign-in">
          <Button
            className="mt-14"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            Entrar
          </Button>
        </Link>
        <Link className="contents sm:hidden" href="/sign-in">
          <Button
            size="sm"
            className="mt-14"
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
