"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Ban, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  cancelAppointmentAction,
  deleteAppointmentAction,
  updateAppointmentAction,
} from "../../../../../../features/appointments/actions";
import {
  appointmentPriorities,
  appointmentStatuses,
  updateAppointmentSchema,
  type UpdateAppointmentInput,
} from "../../../../../../features/appointments/schemas";
import type { Appointment } from "../../../../../../features/appointments/types";

import {
  appointmentPriorityLabels,
  appointmentStatusLabels,
  toDateTimeInputValue,
} from "./appointment-labels";

type AppointmentFormInput = {
  id: string;
  vehicleId: string;
  workOrderId: string | null;
  title: string;
  description: string | null;
  serviceType: string | null;
  status: (typeof appointmentStatuses)[number];
  priority: (typeof appointmentPriorities)[number];
  scheduledStartAt: string;
  scheduledEndAt: string;
  estimatedDropoffAt: string | null;
  estimatedPickupAt: string | null;
  estimatedDurationMinutes: number | null;
  internalNotes: string | null;
  cancellationReason: string | null;
};

type VehicleOption = {
  id: string;
  label: string;
  ownerLabel: string;
};

type WorkOrderOption = {
  id: string;
  vehicleId: string;
  label: string;
};

type AppointmentEditFormProps = {
  appointment: Appointment;
  vehicles: VehicleOption[];
  workOrders: WorkOrderOption[];
};

const appointmentFieldNames = [
  "id",
  "vehicleId",
  "workOrderId",
  "title",
  "description",
  "serviceType",
  "status",
  "priority",
  "scheduledStartAt",
  "scheduledEndAt",
  "estimatedDropoffAt",
  "estimatedPickupAt",
  "estimatedDurationMinutes",
  "internalNotes",
  "cancellationReason",
] as const satisfies readonly (keyof AppointmentFormInput)[];

function isAppointmentFieldName(
  value: string,
): value is keyof AppointmentFormInput {
  return appointmentFieldNames.some((fieldName) => fieldName === value);
}

function optionalNumber(value: unknown) {
  if (value === "") {
    return null;
  }

  return Number(value);
}

export function AppointmentEditForm({
  appointment,
  vehicles,
  workOrders,
}: AppointmentEditFormProps) {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState(
    appointment.cancellationReason ?? "",
  );

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    control,
  } = useForm<AppointmentFormInput, unknown, UpdateAppointmentInput>({
    resolver: zodResolver(updateAppointmentSchema) as Resolver<
      AppointmentFormInput,
      unknown,
      UpdateAppointmentInput
    >,
    defaultValues: {
      id: appointment.id,
      vehicleId: appointment.vehicleId,
      workOrderId: appointment.workOrderId,
      title: appointment.title,
      description: appointment.description,
      serviceType: appointment.serviceType,
      status: appointment.status,
      priority: appointment.priority,
      scheduledStartAt: toDateTimeInputValue(appointment.scheduledStartAt),
      scheduledEndAt: toDateTimeInputValue(appointment.scheduledEndAt),
      estimatedDropoffAt: appointment.estimatedDropoffAt
        ? toDateTimeInputValue(appointment.estimatedDropoffAt)
        : null,
      estimatedPickupAt: appointment.estimatedPickupAt
        ? toDateTimeInputValue(appointment.estimatedPickupAt)
        : null,
      estimatedDurationMinutes: appointment.estimatedDurationMinutes,
      internalNotes: appointment.internalNotes,
      cancellationReason: appointment.cancellationReason,
    },
  });

  const selectedVehicleId = useWatch({ control, name: "vehicleId" });
  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === selectedVehicleId),
    [selectedVehicleId, vehicles],
  );
  const filteredWorkOrders = useMemo(
    () =>
      workOrders.filter((workOrder) => workOrder.vehicleId === selectedVehicleId),
    [selectedVehicleId, workOrders],
  );

  async function onSubmit(values: UpdateAppointmentInput) {
    setFormMessage(null);

    const result = await updateAppointmentAction(values);

    if (result.success) {
      router.push(`/appointments/${result.appointment.id}`);
      router.refresh();
      return;
    }

    setFormMessage(result.message);

    if (result.errors) {
      Object.entries(result.errors.fieldErrors).forEach(
        ([fieldName, messages]) => {
          const message = messages?.[0];

          if (message && isAppointmentFieldName(fieldName)) {
            setError(fieldName, { message });
          }
        },
      );
    }
  }

  async function onCancel() {
    setFormMessage(null);

    const result = await cancelAppointmentAction({
      id: appointment.id,
      cancellationReason: cancelReason,
    });

    if (result.success) {
      router.push(`/appointments/${result.appointment.id}`);
      router.refresh();
      return;
    }

    setFormMessage(result.message);
  }

  async function onDelete() {
    setFormMessage(null);

    const result = await deleteAppointmentAction({ id: appointment.id });

    if (result.success) {
      router.push("/appointments");
      router.refresh();
      return;
    }

    setFormMessage(result.message);
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <input type="hidden" {...register("id")} />

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="vehicleId" className="text-sm font-medium">
              Vehículo
            </label>
            <select
              id="vehicleId"
              aria-invalid={Boolean(errors.vehicleId)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              {...register("vehicleId")}
            >
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.label}
                </option>
              ))}
            </select>
            {selectedVehicle ? (
              <p className="text-xs text-muted-foreground">
                Propietario: {selectedVehicle.ownerLabel}
              </p>
            ) : null}
            {errors.vehicleId ? (
              <p className="text-sm text-destructive">
                {errors.vehicleId.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="workOrderId" className="text-sm font-medium">
              Orden de trabajo
            </label>
            <select
              id="workOrderId"
              aria-invalid={Boolean(errors.workOrderId)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              {...register("workOrderId")}
            >
              <option value="">Sin orden asociada</option>
              {filteredWorkOrders.map((workOrder) => (
                <option key={workOrder.id} value={workOrder.id}>
                  {workOrder.label}
                </option>
              ))}
            </select>
            {errors.workOrderId ? (
              <p className="text-sm text-destructive">
                {errors.workOrderId.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título
            </label>
            <Input
              id="title"
              aria-invalid={Boolean(errors.title)}
              {...register("title")}
            />
            {errors.title ? (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="serviceType" className="text-sm font-medium">
              Tipo de servicio
            </label>
            <Input
              id="serviceType"
              aria-invalid={Boolean(errors.serviceType)}
              {...register("serviceType")}
            />
            {errors.serviceType ? (
              <p className="text-sm text-destructive">
                {errors.serviceType.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="estimatedDurationMinutes"
              className="text-sm font-medium"
            >
              Duración estimada
            </label>
            <Input
              id="estimatedDurationMinutes"
              type="number"
              min="1"
              aria-invalid={Boolean(errors.estimatedDurationMinutes)}
              {...register("estimatedDurationMinutes", {
                setValueAs: optionalNumber,
              })}
            />
            {errors.estimatedDurationMinutes ? (
              <p className="text-sm text-destructive">
                {errors.estimatedDurationMinutes.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="text-sm font-medium">
              Estado
            </label>
            <select
              id="status"
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              {...register("status")}
            >
              {appointmentStatuses.map((status) => (
                <option key={status} value={status}>
                  {appointmentStatusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Prioridad
            </label>
            <select
              id="priority"
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              {...register("priority")}
            >
              {appointmentPriorities.map((priority) => (
                <option key={priority} value={priority}>
                  {appointmentPriorityLabels[priority]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="scheduledStartAt" className="text-sm font-medium">
              Inicio
            </label>
            <Input
              id="scheduledStartAt"
              type="datetime-local"
              aria-invalid={Boolean(errors.scheduledStartAt)}
              {...register("scheduledStartAt")}
            />
            {errors.scheduledStartAt ? (
              <p className="text-sm text-destructive">
                {errors.scheduledStartAt.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="scheduledEndAt" className="text-sm font-medium">
              Fin
            </label>
            <Input
              id="scheduledEndAt"
              type="datetime-local"
              aria-invalid={Boolean(errors.scheduledEndAt)}
              {...register("scheduledEndAt")}
            />
            {errors.scheduledEndAt ? (
              <p className="text-sm text-destructive">
                {errors.scheduledEndAt.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="estimatedDropoffAt" className="text-sm font-medium">
              Ingreso estimado
            </label>
            <Input
              id="estimatedDropoffAt"
              type="datetime-local"
              aria-invalid={Boolean(errors.estimatedDropoffAt)}
              {...register("estimatedDropoffAt")}
            />
            {errors.estimatedDropoffAt ? (
              <p className="text-sm text-destructive">
                {errors.estimatedDropoffAt.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="estimatedPickupAt" className="text-sm font-medium">
              Retiro estimado
            </label>
            <Input
              id="estimatedPickupAt"
              type="datetime-local"
              aria-invalid={Boolean(errors.estimatedPickupAt)}
              {...register("estimatedPickupAt")}
            />
            {errors.estimatedPickupAt ? (
              <p className="text-sm text-destructive">
                {errors.estimatedPickupAt.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descripción
            </label>
            <Textarea
              id="description"
              aria-invalid={Boolean(errors.description)}
              {...register("description")}
            />
            {errors.description ? (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="internalNotes" className="text-sm font-medium">
              Notas internas
            </label>
            <Textarea
              id="internalNotes"
              aria-invalid={Boolean(errors.internalNotes)}
              {...register("internalNotes")}
            />
            {errors.internalNotes ? (
              <p className="text-sm text-destructive">
                {errors.internalNotes.message}
              </p>
            ) : null}
          </div>
        </div>

        {formMessage ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formMessage}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link
            href={`/appointments/${appointment.id}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Volver
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            <Save data-icon="inline-start" aria-hidden="true" />
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>

      <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="flex flex-col gap-2">
          <label htmlFor="cancelReason" className="text-sm font-medium">
            Motivo de cancelación
          </label>
          <Input
            id="cancelReason"
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
            placeholder="El cliente reprogramó el ingreso"
          />
        </div>
        <Button type="button" variant="destructive" onClick={onCancel}>
          <Ban data-icon="inline-start" aria-hidden="true" />
          Cancelar turno
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 p-4">
        <div>
          <h2 className="text-sm font-medium">Borrado por error de carga</h2>
          <p className="text-sm text-muted-foreground">
            Usá esta acción solo si el turno no debe quedar en el historial.
          </p>
        </div>
        <div>
          <Button type="button" variant="destructive" onClick={onDelete}>
            <Trash2 data-icon="inline-start" aria-hidden="true" />
            Borrar turno
          </Button>
        </div>
      </div>
    </div>
  );
}
