"use client";

import { Copy, Eye, EyeOff, Plus, QrCode } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as QRCode from "qrcode";
import { useEffect, useState } from "react";

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
  publicUrl: string | null;
  vehicleId: string;
};

export function PublicHistoryControls({
  publicHistory,
  publicUrl,
  vehicleId,
}: PublicHistoryControlsProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    if (!publicUrl) {
      return;
    }

    QRCode.toDataURL(publicUrl, {
      margin: 2,
      width: 240,
    })
      .then((dataUrl) => {
        if (isActive) {
          setQrDataUrl(dataUrl);
        }
      })
      .catch(() => {
        if (isActive) {
          setQrDataUrl(null);
          setMessage("No pudimos generar el QR.");
        }
      });

    return () => {
      isActive = false;
    };
  }, [publicUrl]);

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

  async function copyPublicUrl() {
    if (!publicUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(publicUrl);
      setMessage("URL copiada.");
    } catch {
      setMessage("No pudimos copiar la URL.");
    }
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
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="flex flex-col items-center gap-3 rounded-lg border bg-background p-4">
          {qrDataUrl ? (
            <Image
              src={qrDataUrl}
              alt="QR del historial público"
              width={224}
              height={224}
              unoptimized
              className="size-56 rounded-md bg-white p-2"
            />
          ) : (
            <div className="flex size-56 items-center justify-center rounded-md border bg-muted text-muted-foreground">
              <QrCode className="size-10" aria-hidden="true" />
              <span className="sr-only">Generando QR</span>
            </div>
          )}
          <p className="text-center text-xs text-muted-foreground">
            Escaneá para abrir el historial público.
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-muted-foreground">Estado</dt>
            <dd>
              <Badge
                variant={publicHistory.isEnabled ? "secondary" : "outline"}
              >
                {publicHistory.isEnabled ? "Activo" : "Inactivo"}
              </Badge>
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-muted-foreground">URL pública</dt>
            <dd className="break-all text-sm font-medium">
              {publicUrl ?? "Preparando URL..."}
            </dd>
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <dt className="text-sm text-muted-foreground">Token público</dt>
            <dd className="break-all rounded-lg border bg-muted px-3 py-2 font-mono text-xs">
              {publicHistory.publicToken}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          disabled={!publicUrl}
          onClick={copyPublicUrl}
        >
          <Copy data-icon="inline-start" aria-hidden="true" />
          Copiar URL
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

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
