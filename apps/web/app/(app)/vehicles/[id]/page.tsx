import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
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

import { getVehicleById } from "../../../../../../features/vehicles/queries";
import { vehicleIdSchema } from "../../../../../../features/vehicles/schemas";

import { PublicHistoryControls } from "../_components/public-history-controls";

type VehicleDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type VehicleWithOwner = NonNullable<Awaited<ReturnType<typeof getVehicleById>>>;

function formatOptionalValue(value: number | string | null) {
  if (typeof value === "number") {
    return value.toLocaleString("es-AR");
  }

  return value?.trim() ? value : "Sin cargar";
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
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

function formatOwnerType(vehicle: VehicleWithOwner) {
  if (vehicle.customer) {
    return "Cliente";
  }

  if (vehicle.company) {
    return "Empresa";
  }

  return "Sin cargar";
}

function buildPublicHistoryUrl(publicToken: string, requestHeaders: Headers) {
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) {
    return `/public-history/${publicToken}`;
  }

  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.")
      ? "http"
      : "https");

  return `${protocol}://${host}/public-history/${publicToken}`;
}

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { id } = await params;
  const parsedId = vehicleIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const vehicle = await getVehicleById(parsedId.data);

  if (!vehicle) {
    notFound();
  }

  const requestHeaders = await headers();
  const publicUrl = vehicle.publicHistory
    ? buildPublicHistoryUrl(vehicle.publicHistory.publicToken, requestHeaders)
    : null;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <Badge variant="secondary">Vehículo</Badge>
          <CardTitle>{vehicle.plate}</CardTitle>
          <CardDescription>
            {vehicle.brand} {vehicle.model}
          </CardDescription>
          <CardAction>
            <Link
              href="/vehicles"
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
          <CardTitle>Datos del vehículo</CardTitle>
          <CardDescription>
            Información registrada para la operación del taller.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Patente</dt>
              <dd className="text-sm font-medium">{vehicle.plate}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">VIN</dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(vehicle.vin)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Marca</dt>
              <dd className="text-sm font-medium">{vehicle.brand}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Modelo</dt>
              <dd className="text-sm font-medium">{vehicle.model}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Año</dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(vehicle.year)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Kilometraje</dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(vehicle.mileage)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">
                Tipo de propietario
              </dt>
              <dd className="text-sm font-medium">
                {formatOwnerType(vehicle)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Propietario</dt>
              <dd className="text-sm font-medium">{formatOwner(vehicle)}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Cliente ID</dt>
              <dd className="break-all text-sm font-medium">
                {formatOptionalValue(vehicle.customerId)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Empresa ID</dt>
              <dd className="break-all text-sm font-medium">
                {formatOptionalValue(vehicle.companyId)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">ID interno</dt>
              <dd className="break-all text-sm font-medium">{vehicle.id}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Creado</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(vehicle.createdAt)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Actualizado</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(vehicle.updatedAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial público</CardTitle>
          <CardDescription>
            Gestión interna del QR y el acceso público al historial del
            vehículo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PublicHistoryControls
            vehicleId={vehicle.id}
            publicHistory={vehicle.publicHistory}
            publicUrl={publicUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
}
