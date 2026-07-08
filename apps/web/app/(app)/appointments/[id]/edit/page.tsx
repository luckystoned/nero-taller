import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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

import { getAppointmentById } from "../../../../../../../features/appointments/queries";
import { appointmentIdSchema } from "../../../../../../../features/appointments/schemas";
import { listVehicles } from "../../../../../../../features/vehicles/queries";
import { listWorkOrders } from "../../../../../../../features/work-orders/queries";

import { AppointmentEditForm } from "../../_components/appointment-edit-form";
import { formatAppointmentOwner } from "../../_components/appointment-labels";

type EditAppointmentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAppointmentPage({
  params,
}: EditAppointmentPageProps) {
  const { id } = await params;
  const parsedId = appointmentIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const [appointment, vehicles, workOrders] = await Promise.all([
    getAppointmentById(parsedId.data),
    listVehicles({ take: 100 }),
    listWorkOrders({ take: 100 }),
  ]);

  if (!appointment) {
    notFound();
  }

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
        <CardTitle>Editar turno</CardTitle>
        <CardDescription>
          Actualiza datos, horario, estado o cancelación del turno.
        </CardDescription>
        <CardAction>
          <Link
            href={`/appointments/${appointment.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Volver
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <AppointmentEditForm
          appointment={appointment}
          vehicles={vehicleOptions}
          workOrders={workOrderOptions}
        />
      </CardContent>
    </Card>
  );
}
