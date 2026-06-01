"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";

import { changeWorkOrderStatusAction } from "../../../../../../features/work-orders/actions";
import {
  changeWorkOrderStatusSchema,
  workOrderStatuses,
  type ChangeWorkOrderStatusInput,
} from "../../../../../../features/work-orders/schemas";
import type { WorkOrderStatus } from "../../../../../../features/work-orders/types";

type WorkOrderStatusFormInput = z.input<typeof changeWorkOrderStatusSchema>;

type WorkOrderStatusFormProps = {
  workOrderId: string;
  currentStatus: WorkOrderStatus;
  statusLabels: Record<WorkOrderStatus, string>;
};

const statusFieldNames = [
  "id",
  "status",
] as const satisfies readonly (keyof WorkOrderStatusFormInput)[];

function isStatusFieldName(
  value: string,
): value is keyof WorkOrderStatusFormInput {
  return statusFieldNames.some((fieldName) => fieldName === value);
}

export function WorkOrderStatusForm({
  workOrderId,
  currentStatus,
  statusLabels,
}: WorkOrderStatusFormProps) {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<WorkOrderStatusFormInput, unknown, ChangeWorkOrderStatusInput>({
    resolver: zodResolver(changeWorkOrderStatusSchema),
    defaultValues: {
      id: workOrderId,
      status: currentStatus,
    },
  });

  const [selectedStatus, setSelectedStatus] = useState<WorkOrderStatus>(
    currentStatus,
  );
  const isSameStatus = selectedStatus === currentStatus;
  const statusRegistration = register("status");

  async function onSubmit(values: ChangeWorkOrderStatusInput) {
    setFormMessage(null);

    const result = await changeWorkOrderStatusAction(values);

    if (result.success) {
      router.refresh();
      return;
    }

    setFormMessage(result.message);

    if (result.errors) {
      Object.entries(result.errors.fieldErrors).forEach(
        ([fieldName, messages]) => {
          const message = messages?.[0];

          if (message && isStatusFieldName(fieldName)) {
            setError(fieldName, { message });
          }
        },
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input type="hidden" {...register("id")} />

      <div className="flex flex-col gap-2">
        <label htmlFor="status" className="text-sm font-medium">
          Nuevo estado
        </label>
        <select
          id="status"
          aria-invalid={Boolean(errors.status)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          {...statusRegistration}
          onChange={(event) => {
            setSelectedStatus(event.target.value as WorkOrderStatus);
            void statusRegistration.onChange(event);
          }}
        >
          {workOrderStatuses.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
        {errors.status ? (
          <p className="text-sm text-destructive">{errors.status.message}</p>
        ) : null}
      </div>

      {formMessage ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formMessage}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || isSameStatus}>
          <Save data-icon="inline-start" aria-hidden="true" />
          {isSubmitting ? "Actualizando..." : "Actualizar estado"}
        </Button>
      </div>
    </form>
  );
}
