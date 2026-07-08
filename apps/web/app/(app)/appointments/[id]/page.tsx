import { ArrowLeft, CalendarClock, Edit } from "lucide-react";
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

import { getAppointmentById } from "../../../../../../features/appointments/queries";
import { appointmentIdSchema } from "../../../../../../features/appointments/schemas";
import { getAppointmentConflicts } from "../../../../../../features/appointments/services";

import {
  appointmentPriorityLabels,
  appointmentReminderStatusLabels,
  formatAppointmentDateTime,
  formatAppointmentOwner,
} from "../_components/appointment-labels";
import { AppointmentStatusBadge } from "../_components/appointment-status-badge";
import { AppointmentWorkOrderPanel } from "../_components/appointment-work-order-panel";

type AppointmentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatOptionalValue(value: number | string | null) {
  if (typeof value === "number") {
    return value.toLocaleString("es-AR");
  }

  return value?.trim() ? value : "Sin cargar";
}

function formatOptionalDate(value: Date | null) {
  return value ? formatAppointmentDateTime(value) : "Sin cargar";
}

export default async function AppointmentDetailPage({
  params,
}: AppointmentDetailPageProps) {
  const { id } = await params;
  const parsedId = appointmentIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const appointment = await getAppointmentById(parsedId.data);

  if (!appointment) {
    notFound();
  }

  const conflicts = await getAppointmentConflicts({
    scheduledStartAt: appointment.scheduledStartAt,
    scheduledEndAt: appointment.scheduledEndAt,
    excludeAppointmentId: appointment.id,
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <AppointmentStatusBadge status={appointment.status} />
          <CardTitle>{appointment.title}</CardTitle>
          <CardDescription>
            {appointment.vehicle.plate} - {appointment.vehicle.brand}{" "}
            {appointment.vehicle.model}
          </CardDescription>
          <CardAction className="flex gap-2">
            <Link
              href="/appointments"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
              )}
            >
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Volver
            </Link>
            <Link
              href={`/appointments/${appointment.id}/edit`}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <Edit data-icon="inline-start" aria-hidden="true" />
              Editar
            </Link>
          </CardAction>
        </CardHeader>
      </Card>

      {conflicts.hasOverlap ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Este turno se solapa con {conflicts.overlappingAppointmentIds.length}{" "}
          turno(s) activo(s).
        </div>
      ) : null}

      <AppointmentWorkOrderPanel appointment={appointment} />

      <Card>
        <CardHeader>
          <CardTitle>Datos del turno</CardTitle>
          <CardDescription>
            Información operativa para la agenda del taller.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Horario</dt>
              <dd className="text-sm font-medium">
                {formatAppointmentDateTime(appointment.scheduledStartAt)} -{" "}
                {formatAppointmentDateTime(appointment.scheduledEndAt)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Prioridad</dt>
              <dd className="text-sm font-medium">
                {appointmentPriorityLabels[appointment.priority]}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Propietario</dt>
              <dd className="text-sm font-medium">
                {formatAppointmentOwner(appointment)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Tipo de servicio</dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(appointment.serviceType)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">
                Ingreso estimado
              </dt>
              <dd className="text-sm font-medium">
                {formatOptionalDate(appointment.estimatedDropoffAt)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Retiro estimado</dt>
              <dd className="text-sm font-medium">
                {formatOptionalDate(appointment.estimatedPickupAt)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">
                Duración estimada
              </dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(appointment.estimatedDurationMinutes)} min
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Recordatorio</dt>
              <dd className="text-sm font-medium">
                {appointmentReminderStatusLabels[appointment.reminderStatus]}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Descripción</dt>
              <dd className="whitespace-pre-wrap text-sm font-medium">
                {formatOptionalValue(appointment.description)}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Notas internas</dt>
              <dd className="whitespace-pre-wrap text-sm font-medium">
                {formatOptionalValue(appointment.internalNotes)}
              </dd>
            </div>
            {appointment.cancellationReason ? (
              <div className="flex flex-col gap-1 sm:col-span-2">
                <dt className="text-sm text-muted-foreground">
                  Motivo de cancelación
                </dt>
                <dd className="whitespace-pre-wrap text-sm font-medium">
                  {appointment.cancellationReason}
                </dd>
              </div>
            ) : null}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
              <CalendarClock aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Preparación IA y recordatorios</CardTitle>
              <CardDescription>
                El turno persiste origen, contexto del asistente y estado de
                recordatorio para futuras automatizaciones.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Origen: {appointment.source}</Badge>
            <Badge variant="outline">
              Próximo recordatorio: {formatOptionalDate(appointment.nextReminderAt)}
            </Badge>
            <Badge variant="outline">
              Último recordatorio: {formatOptionalDate(appointment.lastReminderAt)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
