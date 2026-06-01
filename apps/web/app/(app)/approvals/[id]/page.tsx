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

import { getApprovalById } from "../../../../../../features/approvals/queries";
import { approvalIdSchema } from "../../../../../../features/approvals/schemas";

import { ApprovalResponseForm } from "../_components/approval-response-form";

type ApprovalDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ApprovalWithQuote = NonNullable<Awaited<ReturnType<typeof getApprovalById>>>;
type QuoteItem = ApprovalWithQuote["quote"]["items"][number];

const statusLabels: Record<ApprovalWithQuote["status"], string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
};

const itemTypeLabels: Record<QuoteItem["type"], string> = {
  LABOR: "Mano de obra",
  PART: "Repuesto",
  OTHER: "Otro",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}

function formatOptionalValue(value: string | null) {
  return value?.trim() ? value : "Sin cargar";
}

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

export default async function ApprovalDetailPage({
  params,
}: ApprovalDetailPageProps) {
  const { id } = await params;
  const parsedId = approvalIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const approval = await getApprovalById(parsedId.data);

  if (!approval) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <Badge variant="secondary">{statusLabels[approval.status]}</Badge>
          <CardTitle>Aprobación</CardTitle>
          <CardDescription>{formatQuote(approval)}</CardDescription>
          <CardAction>
            <Link
              href="/approvals"
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
          <CardTitle>Datos de aprobación</CardTitle>
          <CardDescription>
            Estado interno de la solicitud asociada al presupuesto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Estado</dt>
              <dd className="text-sm font-medium">
                {statusLabels[approval.status]}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Presupuesto</dt>
              <dd className="text-sm font-medium">{formatQuote(approval)}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Solicitada</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(approval.requestedAt)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Respondida</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(approval.respondedAt)}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="text-sm text-muted-foreground">
                Notas de respuesta
              </dt>
              <dd className="whitespace-pre-wrap text-sm font-medium">
                {formatOptionalValue(approval.responseNotes)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Presupuesto</CardTitle>
          <CardDescription>Ítems y total a aprobar.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {approval.quote.items.map((item) => (
              <div key={item.id} className="rounded-lg border p-3">
                <dl className="grid gap-3 text-sm sm:grid-cols-5">
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Descripción</dt>
                    <dd className="font-medium">{item.description}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Tipo</dt>
                    <dd className="font-medium">{itemTypeLabels[item.type]}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Cantidad</dt>
                    <dd className="font-medium">{item.quantity}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Total</dt>
                    <dd className="font-medium">{formatMoney(item.total)}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
          <dl className="mt-4 grid gap-3 rounded-lg border p-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium">
                {formatMoney(approval.quote.subtotal)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Impuestos</dt>
              <dd className="font-medium">{formatMoney(approval.quote.tax)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Total</dt>
              <dd className="font-medium">
                {formatMoney(approval.quote.total)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Responder aprobación</CardTitle>
          <CardDescription>
            Solo las solicitudes pendientes pueden aprobarse o rechazarse.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approval.status === "PENDING" ? (
            <ApprovalResponseForm approvalId={approval.id} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Esta aprobación ya fue respondida.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
