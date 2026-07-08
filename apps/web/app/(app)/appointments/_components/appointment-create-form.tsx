"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { createAppointmentAction } from "../../../../../../features/appointments/actions";
import {
  appointmentPriorities,
  appointmentStatuses,
  createAppointmentSchema,
  type CreateAppointmentInput,
} from "../../../../../../features/appointments/schemas";

import {
  appointmentPriorityLabels,
  appointmentStatusLabels,
} from "./appointment-labels";

type AppointmentFormInput = {
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

type AppointmentCreateFormProps = {
  vehicles: VehicleOption[];
  workOrders: WorkOrderOption[];
  defaultStartAt: string;
  defaultEndAt: string;
};

const appointmentFieldNames = [
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

export function AppointmentCreateForm({
  vehicles,
  workOrders,
  defaultStartAt,
  defaultEndAt,
}: AppointmentCreateFormProps) {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    control,
  } = useForm<AppointmentFormInput, unknown, CreateAppointmentInput>({
    resolver: zodResolver(createAppointmentSchema) as Resolver<
      AppointmentFormInput,
      unknown,
      CreateAppointmentInput
    >,
    defaultValues: {
      vehicleId: "",
      workOrderId: null,
      title: "",
      description: null,
      serviceType: null,
      status: "REQUESTED",
      priority: "NORMAL",
      scheduledStartAt: defaultStartAt,
      scheduledEndAt: defaultEndAt,
      estimatedDropoffAt: null,
      estimatedPickupAt: null,
      estimatedDurationMinutes: null,
      internalNotes: null,
      cancellationReason: null,
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

  async function onSubmit(values: CreateAppointmentInput) {
    setFormMessage(null);

    const result = await createAppointmentAction(values);

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
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
            <option value="">Seleccionar vehículo</option>
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
            disabled={!selectedVehicleId}
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
            placeholder="Cambio de aceite y revisión general"
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
            placeholder="Mantenimiento"
            {...register("serviceType")}
          />
          {errors.serviceType ? (
            <p className="text-sm text-destructive">
              {errors.serviceType.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="estimatedDurationMinutes" className="text-sm font-medium">
            Duración estimada
          </label>
          <Input
            id="estimatedDurationMinutes"
            type="number"
            min="1"
            placeholder="60"
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
            placeholder="Detalle visible del turno"
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
            placeholder="Notas para el equipo del taller"
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
          href="/appointments"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ArrowLeft data-icon="inline-start" aria-hidden="true" />
          Volver
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          <Save data-icon="inline-start" aria-hidden="true" />
          {isSubmitting ? "Guardando..." : "Crear turno"}
        </Button>
      </div>
    </form>
  );
}
