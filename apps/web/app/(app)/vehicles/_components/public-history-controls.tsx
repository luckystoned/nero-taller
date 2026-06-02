"use client";

import { Copy, Eye, EyeOff, Link as LinkIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  createPublicVehicleHistoryAction,
  updatePublicVehicleHistoryStatusAction,
} from "../../../../../../features/public-history/actions";

type PublicHistoryControlsProps = {
  publicHistory: {
    id: string;
    publicToken: string;
    isEnabled: boolean;
  } | null;
  vehicleId: string;
};

export function PublicHistoryControls({
  publicHistory,
  vehicleId,
}: PublicHistoryControlsProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const futurePublicPath = publicHistory
    ? `/public-history/${publicHistory.publicToken}`
    : null;

  async function createPublicHistory() {
    setMessage(null);
    setIsSubmitting(true);

    const result = await createPublicVehicleHistoryAction({ vehicleId });

    setIsSubmitting(false);

    if (result.success) {
      router.refresh();
      return;
    }

    setMessage(result.message);
  }

  async function togglePublicHistoryStatus() {
    if (!publicHistory) {
      return;
    }

    setMessage(null);
    setIsSubmitting(true);

    const result = await updatePublicVehicleHistoryStatusAction({
      id: publicHistory.id,
      isEnabled: !publicHistory.isEnabled,
    });

    setIsSubmitting(false);

    if (result.success) {
      router.refresh();
      return;
    }

    setMessage(result.message);
  }

  async function copyFuturePublicPath() {
    if (!futurePublicPath) {
      return;
    }

    await navigator.clipboard.writeText(futurePublicPath);
    setMessage("Link copiado.");
  }

  if (!publicHistory) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-muted-foreground">
          Este vehículo todavía no tiene historial público interno generado.
        </p>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={createPublicHistory}
        >
          <Plus data-icon="inline-start" aria-hidden="true" />
          {isSubmitting ? "Creando..." : "Crear historial público"}
        </Button>
        {message ? <p className="text-sm text-destructive">{message}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-sm text-muted-foreground">Estado</dt>
          <dd>
            <Badge variant={publicHistory.isEnabled ? "secondary" : "outline"}>
              {publicHistory.isEnabled ? "Activo" : "Inactivo"}
            </Badge>
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm text-muted-foreground">Link futuro</dt>
          <dd className="break-all text-sm font-medium">{futurePublicPath}</dd>
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <dt className="text-sm text-muted-foreground">Token público</dt>
          <dd className="break-all rounded-lg border bg-muted px-3 py-2 font-mono text-xs">
            {publicHistory.publicToken}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={copyFuturePublicPath}
        >
          <Copy data-icon="inline-start" aria-hidden="true" />
          Copiar link
        </Button>
        <Button
          type="button"
          variant={publicHistory.isEnabled ? "outline" : "default"}
          disabled={isSubmitting}
          onClick={togglePublicHistoryStatus}
        >
          {publicHistory.isEnabled ? (
            <EyeOff data-icon="inline-start" aria-hidden="true" />
          ) : (
            <Eye data-icon="inline-start" aria-hidden="true" />
          )}
          {publicHistory.isEnabled
            ? isSubmitting
              ? "Desactivando..."
              : "Desactivar"
            : isSubmitting
              ? "Reactivando..."
              : "Reactivar"}
        </Button>
      </div>

      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <LinkIcon aria-hidden="true" className="size-4" />
        La página pública todavía no está implementada.
      </p>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
