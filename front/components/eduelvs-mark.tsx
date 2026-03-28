import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

export type EduelvsMarkProps = {
  className?: string;
  /** `header` — navegação compacta. `hero` — páginas de auth com subtítulo discreto. */
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
        "group inline-flex items-center gap-2",
        header && "gap-1.5",
        className,
      )}
    >
      <Shield
        className={cn(
          "shrink-0 text-primary/90 transition-opacity group-hover:text-primary",
          header ? "size-4 sm:size-[18px]" : "size-5 sm:size-6",
        )}
        strokeWidth={1.5}
        aria-hidden
      />
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "font-sentient font-light tracking-tight text-primary",
            header ? "text-base sm:text-[1.05rem]" : "text-2xl sm:text-3xl",
          )}
        >
          Eduelvs
        </span>
        {!header ? (
          <span className="font-mono text-[10px] tracking-[0.2em] text-foreground/40">
            cofre seguro
          </span>
        ) : null}
      </span>
    </span>
  );
}
