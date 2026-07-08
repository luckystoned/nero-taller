"use client";

import { ClipboardList, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { createWorkOrderFromAppointmentAction } from "../../../../../../features/appointments/actions";
import type { getAppointmentById } from "../../../../../../features/appointments/queries";
import type { WorkOrderStatus } from "../../../../../../features/work-orders/types";

type AppointmentWithDetails = NonNullable<
  Awaited<ReturnType<typeof getAppointmentById>>
>;

type AppointmentWorkOrderPanelProps = {
  appointment: AppointmentWithDetails;
};

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

export function AppointmentWorkOrderPanel({
  appointment,
}: AppointmentWorkOrderPanelProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function onCreateWorkOrder() {
    setMessage(null);
    setIsPending(true);

    const result = await createWorkOrderFromAppointmentAction({
      id: appointment.id,
    });

    setIsPending(false);

    if (result.success) {
      router.push(`/work-orders/${result.workOrder.id}`);
      router.refresh();
      return;
    }

    setMessage(result.message);
  }

  if (appointment.workOrder) {
    return (
      <Card>
        <CardHeader>
          <Badge variant="secondary">Orden asociada</Badge>
          <CardTitle>Trabajo operativo</CardTitle>
          <CardDescription>
            El turno queda vinculado a la orden de trabajo del vehículo.
          </CardDescription>
          <CardAction>
            <Link
              href={`/work-orders/${appointment.workOrder.id}`}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <ClipboardList data-icon="inline-start" aria-hidden="true" />
              Ver orden
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Estado de orden</dt>
              <dd className="text-sm font-medium">
                {workOrderStatusLabels[appointment.workOrder.status]}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="text-sm text-muted-foreground">
                Motivo de ingreso
              </dt>
              <dd className="text-sm font-medium">
                {appointment.workOrder.intakeReason}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Badge variant="outline">Pendiente de orden</Badge>
        <CardTitle>Sin orden de trabajo asociada</CardTitle>
        <CardDescription>
          El turno está agendado. Cuando el vehículo ingrese, podés crear la
          orden desde este turno.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" onClick={onCreateWorkOrder} disabled={isPending}>
            <Plus data-icon="inline-start" aria-hidden="true" />
            {isPending ? "Creando..." : "Crear orden desde turno"}
          </Button>
          <Link
            href={`/appointments/${appointment.id}/edit`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Asociar orden existente
          </Link>
        </div>
        {message ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {message}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
