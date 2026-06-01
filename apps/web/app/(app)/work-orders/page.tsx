import { ClipboardList, Plus } from "lucide-react";
import Link from "next/link";

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

import { listWorkOrders } from "../../../../../features/work-orders/queries";

type WorkOrderWithVehicle = Awaited<ReturnType<typeof listWorkOrders>>[number];

const statusLabels: Record<WorkOrderWithVehicle["status"], string> = {
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

function formatOwner(workOrder: WorkOrderWithVehicle) {
  if (workOrder.vehicle.customer) {
    return `${workOrder.vehicle.customer.lastName}, ${workOrder.vehicle.customer.firstName}`;
  }

  if (workOrder.vehicle.company) {
    return workOrder.vehicle.company.name;
  }

  return "Sin propietario";
}

export default async function WorkOrdersPage() {
  const workOrders = await listWorkOrders();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Órdenes de trabajo</CardTitle>
          <CardDescription>
            Recepción, diagnóstico, reparación y entrega.
          </CardDescription>
          <CardAction>
            <Link
              href="/work-orders/new"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <Plus data-icon="inline-start" aria-hidden="true" />
              Nueva orden
            </Link>
          </CardAction>
        </CardHeader>
      </Card>

      {workOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-8">
            <Badge variant="secondary">Sin órdenes</Badge>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">
                Todavía no hay órdenes de trabajo
              </h2>
              <p className="max-w-prose text-sm text-muted-foreground">
                Crea la primera orden para registrar el ingreso de un vehículo
                al taller.
              </p>
            </div>
            <Link href="/work-orders/new" className={cn(buttonVariants())}>
              <Plus data-icon="inline-start" aria-hidden="true" />
              Crear orden
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {workOrders.map((workOrder) => (
            <Card key={workOrder.id} size="sm">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <ClipboardList aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>
                      <Link
                        href={`/work-orders/${workOrder.id}`}
                        className="hover:underline"
                      >
                        {workOrder.vehicle.plate}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {workOrder.vehicle.brand} {workOrder.vehicle.model}
                    </CardDescription>
                  </div>
                </div>
                <CardAction>
                  <Link
                    href={`/work-orders/${workOrder.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                    )}
                  >
                    Ver detalle
                  </Link>
                </CardAction>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 text-sm sm:grid-cols-4">
                  <div>
                    <dt className="text-muted-foreground">Estado</dt>
                    <dd className="font-medium">
                      {statusLabels[workOrder.status]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Propietario</dt>
                    <dd className="font-medium">{formatOwner(workOrder)}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">
                      Motivo de ingreso
                    </dt>
                    <dd className="font-medium">{workOrder.intakeReason}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
