import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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

import { listVehicles } from "../../../../../../features/vehicles/queries";
import { listWorkOrders } from "../../../../../../features/work-orders/queries";

import { AppointmentCreateForm } from "../_components/appointment-create-form";
import {
  formatAppointmentOwner,
  toDateTimeInputValue,
} from "../_components/appointment-labels";

type NewAppointmentPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];

  return Array.isArray(value) ? value[0] : value;
}

function parseDateParam(value: string | undefined) {
  if (!value) {
    return new Date();
  }

  const date = new Date(`${value}T09:00:00`);

  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export default async function NewAppointmentPage({
  searchParams,
}: NewAppointmentPageProps) {
  const params = await searchParams;
  const startAt = parseDateParam(getSearchParam(params, "date"));
  const endAt = addHours(startAt, 1);
  const [vehicles, workOrders] = await Promise.all([
    listVehicles({ take: 100 }),
    listWorkOrders({ take: 100 }),
  ]);

  const vehicleOptions = vehicles.map((vehicle) => ({
    id: vehicle.id,
    label: `${vehicle.plate} - ${vehicle.brand} ${vehicle.model} - ${formatAppointmentOwner(vehicle)}`,
    ownerLabel: formatAppointmentOwner(vehicle),
  }));

  const workOrderOptions = workOrders.map((workOrder) => ({
    id: workOrder.id,
    vehicleId: workOrder.vehicleId,
    label: `${workOrder.vehicle.plate} - ${workOrder.intakeReason}`,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo turno</CardTitle>
        <CardDescription>
          Agenda el ingreso de un cliente y vehículo al taller.
        </CardDescription>
        <CardAction>
          <Link
            href="/appointments"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Volver
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <AppointmentCreateForm
          vehicles={vehicleOptions}
          workOrders={workOrderOptions}
          defaultStartAt={toDateTimeInputValue(startAt)}
          defaultEndAt={toDateTimeInputValue(endAt)}
        />
      </CardContent>
    </Card>
  );
}
