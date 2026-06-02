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

import { getSupplierById } from "../../../../../../features/suppliers/queries";
import { supplierIdSchema } from "../../../../../../features/suppliers/schemas";

type SupplierDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatOptionalValue(value: string | null) {
  return value?.trim() ? value : "Sin cargar";
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function SupplierDetailPage({
  params,
}: SupplierDetailPageProps) {
  const { id } = await params;
  const parsedId = supplierIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const supplier = await getSupplierById(parsedId.data);

  if (!supplier) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <Badge variant="secondary">Proveedor</Badge>
          <CardTitle>{supplier.name}</CardTitle>
          <CardDescription>Detalle completo del proveedor.</CardDescription>
          <CardAction>
            <Link
              href="/suppliers"
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
          <CardTitle>Datos del proveedor</CardTitle>
          <CardDescription>
            Información registrada para compras y contacto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Nombre</dt>
              <dd className="text-sm font-medium">{supplier.name}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(supplier.email)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Teléfono</dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(supplier.phone)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">
                CUIT o ID fiscal
              </dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(supplier.taxId)}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Dirección</dt>
              <dd className="whitespace-pre-wrap text-sm font-medium">
                {formatOptionalValue(supplier.address)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">ID interno</dt>
              <dd className="break-all text-sm font-medium">{supplier.id}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Notas</dt>
              <dd className="whitespace-pre-wrap text-sm font-medium">
                {formatOptionalValue(supplier.notes)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Creado</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(supplier.createdAt)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Actualizado</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(supplier.updatedAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
