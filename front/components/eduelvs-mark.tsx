import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

export type EduelvsMarkProps = {
  className?: string;
  /**
   * `header` — barra de navegação (compacto, sem subtítulo).
   * `hero` — topo de sign-in / sign-up (destaque + “cofre seguro”).
   */
  variant?: "header" | "hero";
};

export function EduelvsMark({
  className,
  variant = "hero",
}: EduelvsMarkProps) {
  const header = variant === "header";

  return (
    <span
      className={cn(
        "group inline-flex items-center gap-1.5 sm:gap-2.5",
        className,
      )}
    >
      <Shield
        className={cn(
          "shrink-0 text-primary drop-shadow-[0_0_12px_rgba(255,199,0,0.4)] transition-[filter,transform] group-hover:scale-[1.04] group-hover:drop-shadow-[0_0_18px_rgba(255,199,0,0.55)]",
          header ? "size-[18px] sm:size-5" : "size-7 sm:size-[2.125rem]",
        )}
        strokeWidth={1.35}
        aria-hidden
      />
      <span
        className={cn(
          "shrink-0 rounded-full bg-gradient-to-b from-primary via-amber-400 to-amber-800 opacity-90 shadow-[0_0_16px_rgba(255,199,0,0.45)] transition-[opacity,box-shadow] group-hover:opacity-100 group-hover:shadow-[0_0_22px_rgba(255,199,0,0.55)]",
          header ? "h-6 w-0.5 sm:h-7 sm:w-[3px]" : "h-9 w-1",
        )}
        aria-hidden
      />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span
          className={cn(
            "font-sentient font-extralight leading-none tracking-tight bg-gradient-to-br from-primary via-[#fff2b3] to-amber-600 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(255,199,0,0.2)] transition-[filter] group-hover:drop-shadow-[0_0_32px_rgba(255,199,0,0.35)]",
            header
              ? "text-base sm:text-lg"
              : "text-[1.7rem] sm:text-3xl",
          )}
        >
          Eduelvs
        </span>
        {!header ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.55em] text-foreground/35 pl-0.5">
            cofre seguro
          </span>
        ) : null}
      </span>
    </span>
  );
}
