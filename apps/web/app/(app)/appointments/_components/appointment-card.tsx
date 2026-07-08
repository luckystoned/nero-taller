import { Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { listAppointments } from "../../../../../../features/appointments/queries";
import type { WorkOrderStatus } from "../../../../../../features/work-orders/types";

import {
  appointmentPriorityLabels,
  formatAppointmentOwner,
  formatAppointmentTime,
} from "./appointment-labels";
import { AppointmentStatusBadge } from "./appointment-status-badge";

type AppointmentWithDetails = Awaited<ReturnType<typeof listAppointments>>[number];

const workOrderStatusLabels: Record<WorkOrderStatus, string> = {
  DRAFT: "Borrador",
  RECEIVED: "Recibida",
  DIAGNOSIS_IN_PROGRESS: "Diagnóstico en curso",
  QUOTE_PENDING: "Presupuesto pendiente",
  WAITING_CLIENT_APPROVAL: "Esperando aprobación del cliente",
  WAITING_COMPANY_APPROVAL: "Esperando aprobación de empresa",
  APPROVED: "Aprobada",
  IN_PROGRESS: "En reparación",
  WAITING_PARTS: "Esperando repuestos",
  COMPLETED: "Completada",
  READY_FOR_PICKUP: "Lista para retirar",
  DELIVERED: "Entregada",
  CANCELLED: "Cancelada",
};

type AppointmentCardProps = {
  appointment: AppointmentWithDetails;
};

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <Card size="sm" className="rounded-lg">
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>
            <Link
              href={`/appointments/${appointment.id}`}
              className="hover:underline"
            >
              {appointment.title}
            </Link>
          </CardTitle>
          <div className="mt-1 flex flex-wrap gap-1">
            <AppointmentStatusBadge status={appointment.status} />
            <Badge variant="secondary">
              {appointmentPriorityLabels[appointment.priority]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
          <span className="font-medium">
            {formatAppointmentTime(appointment.scheduledStartAt)} -{" "}
            {formatAppointmentTime(appointment.scheduledEndAt)}
          </span>
        </div>
        <div className="text-sm">
          <p className="font-medium">
            {appointment.vehicle.plate} - {appointment.vehicle.brand}{" "}
            {appointment.vehicle.model}
          </p>
          <p className="text-muted-foreground">
            {formatAppointmentOwner(appointment)}
          </p>
        </div>
        {appointment.serviceType ? (
          <p className="text-xs text-muted-foreground">
            Servicio: {appointment.serviceType}
          </p>
        ) : null}
        <p className="text-xs font-medium text-muted-foreground">
          {appointment.workOrder
            ? `Orden: ${workOrderStatusLabels[appointment.workOrder.status]}`
            : "Pendiente de orden"}
        </p>
        <Link
          href={`/appointments/${appointment.id}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <ExternalLink data-icon="inline-start" aria-hidden="true" />
          Ver turno
        </Link>
      </CardContent>
    </Card>
  );
}
