"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isPending?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isPending = false,
  confirmLabel = "Apagar",
  cancelLabel = "Cancelar",
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-red-500/20 sm:max-w-md">
        <AlertDialogHeader className="sm:text-left">
          <div className="mb-2 flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">
              <ShieldAlert className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel disabled={isPending} type="button">
            {cancelLabel}
          </AlertDialogCancel>
          <button
            type="button"
            disabled={isPending}
            onClick={() => onConfirm()}
            className={cn(
              "inline-flex h-11 min-w-[7rem] items-center justify-center rounded-lg border border-red-500/50 bg-red-500/15 px-4 font-mono text-sm font-medium uppercase tracking-wider text-red-300 outline-none transition-colors",
              "hover:bg-red-500/25 focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            {isPending ? "A apagar…" : confirmLabel}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
