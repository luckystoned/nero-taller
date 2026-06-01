import { ArrowLeft } from "lucide-react";
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

import { getWorkOrderById } from "../../../../../../features/work-orders/queries";
import { workOrderIdSchema } from "../../../../../../features/work-orders/schemas";

import { WorkOrderStatusForm } from "../_components/work-order-status-form";

type WorkOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type WorkOrderWithDetails = NonNullable<
  Awaited<ReturnType<typeof getWorkOrderById>>
>;

const statusLabels: Record<WorkOrderWithDetails["status"], string> = {
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

function formatOwner(workOrder: WorkOrderWithDetails) {
  if (workOrder.vehicle.customer) {
    return `${workOrder.vehicle.customer.lastName}, ${workOrder.vehicle.customer.firstName}`;
  }

  if (workOrder.vehicle.company) {
    return workOrder.vehicle.company.name;
  }

  return "Sin propietario";
}

function formatStatus(value: WorkOrderWithDetails["status"] | null) {
  return value ? statusLabels[value] : "Inicio";
}

export default async function WorkOrderDetailPage({
  params,
}: WorkOrderDetailPageProps) {
  const { id } = await params;
  const parsedId = workOrderIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const workOrder = await getWorkOrderById(parsedId.data);

  if (!workOrder) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <Badge variant="secondary">{statusLabels[workOrder.status]}</Badge>
          <CardTitle>Orden de trabajo</CardTitle>
          <CardDescription>
            {workOrder.vehicle.plate} - {workOrder.vehicle.brand}{" "}
            {workOrder.vehicle.model}
          </CardDescription>
          <CardAction>
            <Link
              href="/work-orders"
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
          <CardTitle>Datos de la orden</CardTitle>
          <CardDescription>
            Información registrada durante la recepción.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Estado actual</dt>
              <dd className="text-sm font-medium">
                {statusLabels[workOrder.status]}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Vehículo</dt>
              <dd className="text-sm font-medium">
                {workOrder.vehicle.plate} - {workOrder.vehicle.brand}{" "}
                {workOrder.vehicle.model}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Propietario</dt>
              <dd className="text-sm font-medium">{formatOwner(workOrder)}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Kilometraje</dt>
              <dd className="text-sm font-medium">
                {formatOptionalValue(workOrder.mileage)}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="text-sm text-muted-foreground">
                Motivo de ingreso
              </dt>
              <dd className="whitespace-pre-wrap text-sm font-medium">
                {workOrder.intakeReason}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Síntomas</dt>
              <dd className="whitespace-pre-wrap text-sm font-medium">
                {formatOptionalValue(workOrder.symptoms)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Creada</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(workOrder.createdAt)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Actualizada</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(workOrder.updatedAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar estado</CardTitle>
          <CardDescription>
            Actualiza el estado actual y registra el movimiento en el historial.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkOrderStatusForm
            workOrderId={workOrder.id}
            currentStatus={workOrder.status}
            statusLabels={statusLabels}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de estados</CardTitle>
          <CardDescription>
            Timeline básica de cambios registrados para la orden.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workOrder.statusHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Todavía no hay movimientos de estado.
            </p>
          ) : (
            <ol className="flex flex-col gap-3">
              {workOrder.statusHistory.map((historyItem) => (
                <li
                  key={historyItem.id}
                  className="rounded-lg border p-3 text-sm"
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-muted-foreground">Desde</p>
                      <p className="font-medium">
                        {formatStatus(historyItem.fromStatus)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Hacia</p>
                      <p className="font-medium">
                        {formatStatus(historyItem.toStatus)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fecha</p>
                      <p className="font-medium">
                        {formatDateTime(historyItem.createdAt)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
