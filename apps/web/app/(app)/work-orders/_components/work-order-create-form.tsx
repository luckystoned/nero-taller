"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { createWorkOrderAction } from "../../../../../../features/work-orders/actions";
import {
  createWorkOrderSchema,
  type CreateWorkOrderInput,
} from "../../../../../../features/work-orders/schemas";

type WorkOrderFormInput = z.input<typeof createWorkOrderSchema>;

type VehicleOption = {
  id: string;
  label: string;
};

type WorkOrderCreateFormProps = {
  vehicles: VehicleOption[];
};

const workOrderFieldNames = [
  "vehicleId",
  "status",
  "intakeReason",
  "symptoms",
  "mileage",
] as const satisfies readonly (keyof WorkOrderFormInput)[];

function isWorkOrderFieldName(
  value: string,
): value is keyof WorkOrderFormInput {
  return workOrderFieldNames.some((fieldName) => fieldName === value);
}

function optionalNumber(value: unknown) {
  if (value === "") {
    return null;
  }

  return Number(value);
}

export function WorkOrderCreateForm({ vehicles }: WorkOrderCreateFormProps) {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<WorkOrderFormInput, unknown, CreateWorkOrderInput>({
    resolver: zodResolver(createWorkOrderSchema),
    defaultValues: {
      vehicleId: "",
      intakeReason: "",
      symptoms: "",
      mileage: null,
    },
  });

  async function onSubmit(values: CreateWorkOrderInput) {
    setFormMessage(null);

    const result = await createWorkOrderAction(values);

    if (result.success) {
      router.push(`/work-orders/${result.workOrder.id}`);
      router.refresh();
      return;
    }

    setFormMessage(result.message);

    if (result.errors) {
      Object.entries(result.errors.fieldErrors).forEach(
        ([fieldName, messages]) => {
          const message = messages?.[0];

          if (message && isWorkOrderFieldName(fieldName)) {
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
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            {...register("vehicleId")}
          >
            <option value="">Seleccionar vehículo</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.label}
              </option>
            ))}
          </select>
          {errors.vehicleId ? (
            <p className="text-sm text-destructive">
              {errors.vehicleId.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="intakeReason" className="text-sm font-medium">
            Motivo de ingreso
          </label>
          <Textarea
            id="intakeReason"
            aria-invalid={Boolean(errors.intakeReason)}
            placeholder="Describe el motivo principal de la orden"
            {...register("intakeReason")}
          />
          {errors.intakeReason ? (
            <p className="text-sm text-destructive">
              {errors.intakeReason.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="symptoms" className="text-sm font-medium">
            Síntomas
          </label>
          <Textarea
            id="symptoms"
            aria-invalid={Boolean(errors.symptoms)}
            placeholder="Síntomas informados por el cliente o detectados en recepción"
            {...register("symptoms")}
          />
          {errors.symptoms ? (
            <p className="text-sm text-destructive">
              {errors.symptoms.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="mileage" className="text-sm font-medium">
            Kilometraje
          </label>
          <Input
            id="mileage"
            type="number"
            min="0"
            aria-invalid={Boolean(errors.mileage)}
            placeholder="85000"
            {...register("mileage", { setValueAs: optionalNumber })}
          />
          {errors.mileage ? (
            <p className="text-sm text-destructive">
              {errors.mileage.message}
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
          href="/work-orders"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ArrowLeft data-icon="inline-start" aria-hidden="true" />
          Volver
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          <Save data-icon="inline-start" aria-hidden="true" />
          {isSubmitting ? "Guardando..." : "Crear orden"}
        </Button>
      </div>
    </form>
  );
}
