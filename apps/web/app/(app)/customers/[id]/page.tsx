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

import { getCustomerById } from "../../../../../../features/customers/queries";
import { customerIdSchema } from "../../../../../../features/customers/schemas";

type CustomerDetailPageProps = {
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

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;
  const parsedId = customerIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const customer = await getCustomerById(parsedId.data);

  if (!customer) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <Badge variant="secondary">Cliente individual</Badge>
          <CardTitle>
            {customer.firstName} {customer.lastName}
          </CardTitle>
          <CardDescription>Detalle completo del cliente.</CardDescription>
          <CardAction>
            <Link
              href="/customers"
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
          <CardTitle>Datos del cliente</CardTitle>
          <CardDescription>
            Información registrada para la operación del taller.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Nombre</dt>
              <dd className="text-sm font-medium">{customer.firstName}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Apellido</dt>
              <dd className="text-sm font-medium">{customer.lastName}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(customer.email)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Teléfono</dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(customer.phone)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Documento</dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(customer.documentId)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">ID interno</dt>
              <dd className="break-all text-sm font-medium">{customer.id}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Notas</dt>
              <dd className="whitespace-pre-wrap text-sm font-medium">
                {formatOptionalValue(customer.notes)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Creado</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(customer.createdAt)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Actualizado</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(customer.updatedAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
