import { Plus, Truck } from "lucide-react";
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

import { listSuppliers } from "../../../../../features/suppliers/queries";

function formatOptionalValue(value: string | null) {
  return value?.trim() ? value : "Sin cargar";
}

export default async function SuppliersPage() {
  const suppliers = await listSuppliers();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Proveedores</CardTitle>
          <CardDescription>
            Gestión de proveedores del taller.
          </CardDescription>
          <CardAction>
            <Link
              href="/suppliers/new"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <Plus data-icon="inline-start" aria-hidden="true" />
              Nuevo proveedor
            </Link>
          </CardAction>
        </CardHeader>
      </Card>

      {suppliers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-8">
            <Badge variant="secondary">Sin proveedores</Badge>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">
                Todavía no hay proveedores
              </h2>
              <p className="max-w-prose text-sm text-muted-foreground">
                Crea el primer proveedor para registrar contactos comerciales
                del taller.
              </p>
            </div>
            <Link href="/suppliers/new" className={cn(buttonVariants())}>
              <Plus data-icon="inline-start" aria-hidden="true" />
              Crear proveedor
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} size="sm">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <Truck aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>
                      <Link
                        href={`/suppliers/${supplier.id}`}
                        className="hover:underline"
                      >
                        {supplier.name}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {formatOptionalValue(supplier.email)}
                    </CardDescription>
                  </div>
                </div>
                <CardAction>
                  <Link
                    href={`/suppliers/${supplier.id}`}
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
                      {formatOptionalValue(supplier.phone)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">CUIT o ID fiscal</dt>
                    <dd className="font-medium">
                      {formatOptionalValue(supplier.taxId)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Dirección</dt>
                    <dd className="font-medium">
                      {formatOptionalValue(supplier.address)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Creado</dt>
                    <dd className="font-medium">
                      {supplier.createdAt.toLocaleDateString("es-AR")}
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
