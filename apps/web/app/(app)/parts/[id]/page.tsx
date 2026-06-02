import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { getPartById } from "../../../../../../features/parts/queries";
import { partIdSchema } from "../../../../../../features/parts/schemas";

type PartDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatOptionalValue(value: string | null) {
  return value?.trim() ? value : "Sin cargar";
}

function formatOptionalNumber(value: number | null) {
  return typeof value === "number" ? value.toLocaleString("es-AR") : "Sin cargar";
}

function formatMoney(value: number | null) {
  if (value === null) {
    return "Sin cargar";
  }

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function PartDetailPage({ params }: PartDetailPageProps) {
  const { id } = await params;
  const parsedId = partIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const part = await getPartById(parsedId.data);

  if (!part) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <Badge variant="secondary">Repuesto</Badge>
          <CardTitle>{part.name}</CardTitle>
          <CardDescription>Detalle completo del repuesto.</CardDescription>
          <CardAction>
            <Link
              href="/parts"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
              )}
            >
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Volver
            </Link>
          </CardAction>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos del repuesto</CardTitle>
          <CardDescription>
            Información registrada para costos y compras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Nombre</dt>
              <dd className="text-sm font-medium">{part.name}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">SKU</dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(part.sku)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Marca</dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(part.brand)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Proveedor</dt>
              <dd className="text-sm font-medium">
                {part.supplier ? part.supplier.name : "Sin proveedor"}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Costo unitario</dt>
              <dd className="text-sm font-medium">
                {formatMoney(part.unitCost)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Precio de venta</dt>
              <dd className="text-sm font-medium">
                {formatMoney(part.salePrice)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Stock</dt>
              <dd className="text-sm font-medium">
                {formatOptionalNumber(part.stock)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">ID interno</dt>
              <dd className="break-all text-sm font-medium">{part.id}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Descripción</dt>
              <dd className="whitespace-pre-wrap text-sm font-medium">
                {formatOptionalValue(part.description)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Creado</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(part.createdAt)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Actualizado</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(part.updatedAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
