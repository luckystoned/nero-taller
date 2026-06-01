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

import { getCompanyById } from "../../../../../../features/companies/queries";
import { companyIdSchema } from "../../../../../../features/companies/schemas";

type CompanyDetailPageProps = {
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

export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  const { id } = await params;
  const parsedId = companyIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const company = await getCompanyById(parsedId.data);

  if (!company) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <Badge variant="secondary">Cliente empresa</Badge>
          <CardTitle>{company.name}</CardTitle>
          <CardDescription>Detalle completo de la empresa.</CardDescription>
          <CardAction>
            <Link
              href="/companies"
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
          <CardTitle>Datos de la empresa</CardTitle>
          <CardDescription>
            Información registrada para la operación del taller.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Nombre</dt>
              <dd className="text-sm font-medium">{company.name}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(company.email)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Teléfono</dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(company.phone)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">
                CUIT o ID fiscal
              </dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(company.taxId)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">
                Requiere aprobación
              </dt>
              <dd className="text-sm font-medium">
                {company.requiresApproval ? "Sí" : "No"}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">ID interno</dt>
              <dd className="break-all text-sm font-medium">{company.id}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Notas</dt>
              <dd className="whitespace-pre-wrap text-sm font-medium">
                {formatOptionalValue(company.notes)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Creada</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(company.createdAt)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Actualizada</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(company.updatedAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
