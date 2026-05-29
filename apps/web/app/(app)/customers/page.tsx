import { Plus, UserRound } from "lucide-react";
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

import { listCustomers } from "../../../../../features/customers/queries";

function formatOptionalValue(value: string | null) {
  return value?.trim() ? value : "Sin cargar";
}

export default async function CustomersPage() {
  const customers = await listCustomers();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>
            Gestión de clientes individuales del taller.
          </CardDescription>
          <CardAction>
            <Link
              href="/customers/new"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <Plus data-icon="inline-start" aria-hidden="true" />
              Nuevo cliente
            </Link>
          </CardAction>
        </CardHeader>
      </Card>

      {customers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-8">
            <Badge variant="secondary">Sin clientes</Badge>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">Todavía no hay clientes</h2>
              <p className="max-w-prose text-sm text-muted-foreground">
                Crea el primer cliente para empezar a registrar la operación del
                taller.
              </p>
            </div>
            <Link href="/customers/new" className={cn(buttonVariants())}>
              <Plus data-icon="inline-start" aria-hidden="true" />
              Crear cliente
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {customers.map((customer) => (
            <Card key={customer.id} size="sm">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <UserRound aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>
                      <Link
                        href={`/customers/${customer.id}`}
                        className="hover:underline"
                      >
                        {customer.lastName}, {customer.firstName}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {formatOptionalValue(customer.email)}
                    </CardDescription>
                  </div>
                </div>
                <CardAction>
                  <Link
                    href={`/customers/${customer.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                    )}
                  >
                    Ver detalle
                  </Link>
                </CardAction>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-muted-foreground">Teléfono</dt>
                    <dd className="font-medium">
                      {formatOptionalValue(customer.phone)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Documento</dt>
                    <dd className="font-medium">
                      {formatOptionalValue(customer.documentId)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Creado</dt>
                    <dd className="font-medium">
                      {customer.createdAt.toLocaleDateString("es-AR")}
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
