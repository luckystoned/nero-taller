import { Building2, Plus } from "lucide-react";
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

import { listCompanies } from "../../../../../features/companies/queries";

function formatOptionalValue(value: string | null) {
  return value?.trim() ? value : "Sin cargar";
}

export default async function CompaniesPage() {
  const companies = await listCompanies();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Empresas</CardTitle>
          <CardDescription>
            Gestión de clientes empresa del taller.
          </CardDescription>
          <CardAction>
            <Link
              href="/companies/new"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <Plus data-icon="inline-start" aria-hidden="true" />
              Nueva empresa
            </Link>
          </CardAction>
        </CardHeader>
      </Card>

      {companies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-8">
            <Badge variant="secondary">Sin empresas</Badge>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">Todavía no hay empresas</h2>
              <p className="max-w-prose text-sm text-muted-foreground">
                Crea la primera empresa para registrar clientes comerciales del
                taller.
              </p>
            </div>
            <Link href="/companies/new" className={cn(buttonVariants())}>
              <Plus data-icon="inline-start" aria-hidden="true" />
              Crear empresa
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {companies.map((company) => (
            <Card key={company.id} size="sm">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <Building2 aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>
                      <Link
                        href={`/companies/${company.id}`}
                        className="hover:underline"
                      >
                        {company.name}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {formatOptionalValue(company.email)}
                    </CardDescription>
                  </div>
                </div>
                <CardAction>
                  <Link
                    href={`/companies/${company.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                    )}
                  >
                    Ver detalle
                  </Link>
                </CardAction>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 text-sm sm:grid-cols-4">
                  <div>
                    <dt className="text-muted-foreground">Teléfono</dt>
                    <dd className="font-medium">
                      {formatOptionalValue(company.phone)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">CUIT o ID fiscal</dt>
                    <dd className="font-medium">
                      {formatOptionalValue(company.taxId)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Aprobación</dt>
                    <dd className="font-medium">
                      {company.requiresApproval
                        ? "Requerida"
                        : "No requerida"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Creada</dt>
                    <dd className="font-medium">
                      {company.createdAt.toLocaleDateString("es-AR")}
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
