import { Package, Plus } from "lucide-react";
import Link from "next/link";

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

import { listParts } from "../../../../../features/parts/queries";

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

export default async function PartsPage() {
  const parts = await listParts();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Repuestos</CardTitle>
          <CardDescription>
            Gestión de repuestos y costos del taller.
          </CardDescription>
          <CardAction>
            <Link
              href="/parts/new"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <Plus data-icon="inline-start" aria-hidden="true" />
              Nuevo repuesto
            </Link>
          </CardAction>
        </CardHeader>
      </Card>

      {parts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-8">
            <Badge variant="secondary">Sin repuestos</Badge>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">Todavía no hay repuestos</h2>
              <p className="max-w-prose text-sm text-muted-foreground">
                Crea el primer repuesto para registrar componentes, costos y
                proveedores.
              </p>
            </div>
            <Link href="/parts/new" className={cn(buttonVariants())}>
              <Plus data-icon="inline-start" aria-hidden="true" />
              Crear repuesto
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {parts.map((part) => (
            <Card key={part.id} size="sm">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <Package aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>
                      <Link
                        href={`/parts/${part.id}`}
                        className="hover:underline"
                      >
                        {part.name}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {formatOptionalValue(part.sku)}
                    </CardDescription>
                  </div>
                </div>
                <CardAction>
                  <Link
                    href={`/parts/${part.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                    )}
                  >
                    Ver detalle
                  </Link>
                </CardAction>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 text-sm sm:grid-cols-6">
                  <div>
                    <dt className="text-muted-foreground">Marca</dt>
                    <dd className="font-medium">
                      {formatOptionalValue(part.brand)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Costo</dt>
                    <dd className="font-medium">
                      {formatMoney(part.unitCost)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Venta</dt>
                    <dd className="font-medium">
                      {formatMoney(part.salePrice)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Stock</dt>
                    <dd className="font-medium">
                      {formatOptionalNumber(part.stock)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Proveedor</dt>
                    <dd className="font-medium">
                      {part.supplier
                        ? part.supplier.name
                        : "Sin proveedor"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Creado</dt>
                    <dd className="font-medium">
                      {part.createdAt.toLocaleDateString("es-AR")}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
