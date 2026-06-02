import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getSafePublicVehicleHistoryByToken } from "../../../../../features/public-history/queries";
import { publicVehicleHistoryTokenSchema } from "../../../../../features/public-history/schemas";

type PublicHistoryPageProps = {
  params: Promise<{
    token: string;
  }>;
};

type PublicHistory = NonNullable<
  Awaited<ReturnType<typeof getSafePublicVehicleHistoryByToken>>
>;

const statusLabels: Record<PublicHistory["workOrders"][number]["status"], string> =
  {
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

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
  }).format(value);
}

export default async function PublicHistoryPage({
  params,
}: PublicHistoryPageProps) {
  const { token } = await params;
  const parsedToken = publicVehicleHistoryTokenSchema.safeParse(token);

  if (!parsedToken.success) {
    notFound();
  }

  const publicHistory = await getSafePublicVehicleHistoryByToken(
    parsedToken.data,
  );

  if (!publicHistory) {
    notFound();
  }

  if (!publicHistory.isEnabled) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-8">
        <Card>
          <CardHeader>
            <Badge variant="secondary">Historial público</Badge>
            <CardTitle>Este historial público no está disponible.</CardTitle>
            <CardDescription>
              El taller desactivó temporalmente el acceso a este historial.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 px-4 py-8">
      <Card>
        <CardHeader>
          <Badge variant="secondary">Vehículo</Badge>
          <CardTitle>{publicHistory.vehicle.plate}</CardTitle>
          <CardDescription>
            {publicHistory.vehicle.brand} {publicHistory.vehicle.model}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de servicios</CardTitle>
          <CardDescription>
            Servicios registrados por el taller para este vehículo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {publicHistory.workOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Todavía no hay servicios publicados para este vehículo.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Fecha</th>
                    <th className="py-2 pr-3 font-medium">Estado</th>
                    <th className="py-2 font-medium">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {publicHistory.workOrders.map((workOrder) => (
                    <tr
                      key={`${workOrder.createdAt.toISOString()}-${workOrder.status}`}
                      className="border-b last:border-0"
                    >
                      <td className="py-2 pr-3 whitespace-nowrap">
                        {formatDate(workOrder.createdAt)}
                      </td>
                      <td className="py-2 pr-3">
                        <Badge variant="secondary">
                          {statusLabels[workOrder.status]}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <p className="max-w-prose whitespace-pre-wrap font-medium">
                          {workOrder.intakeReason}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Actualizado: {formatDate(workOrder.updatedAt)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
