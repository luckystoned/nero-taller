import { Car, Plus } from "lucide-react";
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

import { listVehicles } from "../../../../../features/vehicles/queries";

type VehicleWithOwner = Awaited<ReturnType<typeof listVehicles>>[number];

function formatOptionalValue(value: number | string | null) {
  if (typeof value === "number") {
    return value.toLocaleString("es-AR");
  }

  return value?.trim() ? value : "Sin cargar";
}

function formatOwner(vehicle: VehicleWithOwner) {
  if (vehicle.customer) {
    return `${vehicle.customer.lastName}, ${vehicle.customer.firstName}`;
  }

  if (vehicle.company) {
    return vehicle.company.name;
  }

  return "Sin propietario";
}

export default async function VehiclesPage() {
  const vehicles = await listVehicles();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Vehículos</CardTitle>
          <CardDescription>
            Registro de vehículos de clientes y empresas.
          </CardDescription>
          <CardAction>
            <Link
              href="/vehicles/new"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <Plus data-icon="inline-start" aria-hidden="true" />
              Nuevo vehículo
            </Link>
          </CardAction>
        </CardHeader>
      </Card>

      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-8">
            <Badge variant="secondary">Sin vehículos</Badge>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">Todavía no hay vehículos</h2>
              <p className="max-w-prose text-sm text-muted-foreground">
                Crea el primer vehículo para asociarlo a un cliente o una
                empresa.
              </p>
            </div>
            <Link href="/vehicles/new" className={cn(buttonVariants())}>
              <Plus data-icon="inline-start" aria-hidden="true" />
              Crear vehículo
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} size="sm">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <Car aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>
                      <Link
                        href={`/vehicles/${vehicle.id}`}
                        className="hover:underline"
                      >
                        {vehicle.plate}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {vehicle.brand} {vehicle.model}
                    </CardDescription>
                  </div>
                </div>
                <CardAction>
                  <Link
                    href={`/vehicles/${vehicle.id}`}
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
                    <dt className="text-muted-foreground">Propietario</dt>
                    <dd className="font-medium">{formatOwner(vehicle)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Año</dt>
                    <dd className="font-medium">
                      {formatOptionalValue(vehicle.year)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Kilometraje</dt>
                    <dd className="font-medium">
                      {formatOptionalValue(vehicle.mileage)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Creado</dt>
                    <dd className="font-medium">
                      {vehicle.createdAt.toLocaleDateString("es-AR")}
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
