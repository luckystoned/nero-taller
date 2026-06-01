import { CheckCircle2 } from "lucide-react";
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

import { listApprovals } from "../../../../../features/approvals/queries";

type ApprovalWithQuote = Awaited<ReturnType<typeof listApprovals>>[number];

const statusLabels: Record<ApprovalWithQuote["status"], string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
};

function formatDateTime(value: Date | null) {
  if (!value) {
    return "Sin responder";
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatQuote(approval: ApprovalWithQuote) {
  return `${approval.quote.workOrder.vehicle.plate} - ${approval.quote.workOrder.vehicle.brand} ${approval.quote.workOrder.vehicle.model}`;
}

export default async function ApprovalsPage() {
  const approvals = await listApprovals();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Aprobaciones</CardTitle>
          <CardDescription>
            Solicitudes internas de aprobación de presupuestos.
          </CardDescription>
        </CardHeader>
      </Card>

      {approvals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-8">
            <Badge variant="secondary">Sin aprobaciones</Badge>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">
                Todavía no hay aprobaciones
              </h2>
              <p className="max-w-prose text-sm text-muted-foreground">
                Crea una solicitud desde el detalle de un presupuesto.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {approvals.map((approval) => (
            <Card key={approval.id} size="sm">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <CheckCircle2 aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>
                      <Link
                        href={`/approvals/${approval.id}`}
                        className="hover:underline"
                      >
                        {formatQuote(approval)}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {statusLabels[approval.status]}
                    </CardDescription>
                  </div>
                </div>
                <CardAction>
                  <Link
                    href={`/approvals/${approval.id}`}
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
                    <dt className="text-muted-foreground">Presupuesto</dt>
                    <dd className="font-medium">{formatQuote(approval)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Solicitada</dt>
                    <dd className="font-medium">
                      {formatDateTime(approval.requestedAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Respondida</dt>
                    <dd className="font-medium">
                      {formatDateTime(approval.respondedAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Estado</dt>
                    <dd className="font-medium">
                      {statusLabels[approval.status]}
                    </dd>
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
