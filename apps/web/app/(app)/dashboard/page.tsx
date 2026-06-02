import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  getDashboardMetrics,
  getQuotesByStatus,
  getRecentActivity,
  getWorkOrdersByStatus,
} from "../../../../../features/dashboard/queries";
import type {
  DashboardMetrics,
  QuotesByStatusItem,
  RecentActivity,
  WorkOrdersByStatusItem,
} from "../../../../../features/dashboard/types";

const metricLabels: { key: keyof DashboardMetrics; label: string }[] = [
  { key: "totalCustomers", label: "Clientes" },
  { key: "totalCompanies", label: "Empresas" },
  { key: "totalVehicles", label: "Vehículos" },
  { key: "totalWorkOrders", label: "Órdenes" },
  { key: "totalQuotes", label: "Presupuestos" },
  { key: "totalApprovedQuotes", label: "Presupuestos aprobados" },
  { key: "totalRejectedQuotes", label: "Presupuestos rechazados" },
  { key: "totalSuppliers", label: "Proveedores" },
  { key: "totalParts", label: "Repuestos" },
];

const workOrderStatusLabels: Record<WorkOrdersByStatusItem["status"], string> = {
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

const quoteStatusLabels: Record<QuotesByStatusItem["status"], string> = {
  DRAFT: "Borrador",
  SENT: "Enviado",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  CANCELLED: "Cancelado",
};

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}

function formatVehicle(vehicle: {
  plate: string;
  brand: string;
  model: string;
}) {
  return `${vehicle.plate} - ${vehicle.brand} ${vehicle.model}`;
}

function MetricsGrid({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {metricLabels.map((metric) => (
        <Card key={metric.key} size="sm">
          <CardHeader>
            <CardDescription>{metric.label}</CardDescription>
            <CardTitle className="text-2xl">
              {metrics[metric.key].toLocaleString("es-AR")}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </section>
  );
}

function StatusTable<TStatus extends string>({
  emptyMessage,
  labels,
  rows,
}: {
  emptyMessage: string;
  labels: Record<TStatus, string>;
  rows: { status: TStatus; count: number }[];
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="py-2 pr-3 font-medium">Estado</th>
            <th className="py-2 text-right font-medium">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.status} className="border-b last:border-0">
              <td className="py-2 pr-3">
                <Badge variant="secondary">{labels[row.status]}</Badge>
              </td>
              <td className="py-2 text-right font-medium">
                {row.count.toLocaleString("es-AR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecentActivityTable({ activity }: { activity: RecentActivity }) {
  const hasActivity =
    activity.workOrders.length > 0 || activity.quotes.length > 0;

  if (!hasActivity) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no hay actividad reciente.
      </p>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Orden</th>
              <th className="py-2 pr-3 font-medium">Estado</th>
              <th className="py-2 text-right font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {activity.workOrders.map((workOrder) => (
              <tr key={workOrder.id} className="border-b last:border-0">
                <td className="py-2 pr-3">
                  <p className="font-medium">
                    {formatVehicle(workOrder.vehicle)}
                  </p>
                  <p className="max-w-72 truncate text-muted-foreground">
                    {workOrder.intakeReason}
                  </p>
                </td>
                <td className="py-2 pr-3">
                  <Badge variant="secondary">
                    {workOrderStatusLabels[workOrder.status]}
                  </Badge>
                </td>
                <td className="py-2 text-right">
                  {formatDateTime(workOrder.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Presupuesto</th>
              <th className="py-2 pr-3 font-medium">Estado</th>
              <th className="py-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {activity.quotes.map((quote) => (
              <tr key={quote.id} className="border-b last:border-0">
                <td className="py-2 pr-3">
                  <p className="font-medium">
                    {formatVehicle(quote.workOrder.vehicle)}
                  </p>
                  <p className="text-muted-foreground">
                    {formatDateTime(quote.createdAt)}
                  </p>
                </td>
                <td className="py-2 pr-3">
                  <Badge variant="secondary">
                    {quoteStatusLabels[quote.status]}
                  </Badge>
                </td>
                <td className="py-2 text-right font-medium">
                  {formatMoney(quote.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const [
    metrics,
    workOrdersByStatus,
    quotesByStatus,
    recentActivity,
  ] = await Promise.all([
    getDashboardMetrics(),
    getWorkOrdersByStatus(),
    getQuotesByStatus(),
    getRecentActivity(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <Badge variant="secondary">MVP demo</Badge>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            Vista general con datos reales de la operación del taller.
          </CardDescription>
        </CardHeader>
      </Card>

      <MetricsGrid metrics={metrics} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Órdenes por estado</CardTitle>
            <CardDescription>
              Distribución actual del ciclo operativo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatusTable
              emptyMessage="Todavía no hay órdenes de trabajo."
              labels={workOrderStatusLabels}
              rows={workOrdersByStatus}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Presupuestos por estado</CardTitle>
            <CardDescription>
              Resumen de presupuestos emitidos y respondidos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatusTable
              emptyMessage="Todavía no hay presupuestos."
              labels={quoteStatusLabels}
              rows={quotesByStatus}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad reciente</CardTitle>
          <CardDescription>
            Últimas órdenes de trabajo y presupuestos creados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivityTable activity={recentActivity} />
        </CardContent>
      </Card>
    </div>
  );
}
