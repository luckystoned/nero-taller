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

import { getQuoteById } from "../../../../../../features/quotes/queries";
import { quoteIdSchema } from "../../../../../../features/quotes/schemas";

import { RequestApprovalButton } from "../_components/request-approval-button";

type QuoteDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type QuoteWithDetails = NonNullable<Awaited<ReturnType<typeof getQuoteById>>>;
type QuoteItem = QuoteWithDetails["items"][number];

const statusLabels: Record<QuoteWithDetails["status"], string> = {
  DRAFT: "Borrador",
  SENT: "Enviado",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  CANCELLED: "Cancelado",
};

const approvalStatusLabels = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
} as const;

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

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatWorkOrder(quote: QuoteWithDetails) {
  return `${quote.workOrder.vehicle.plate} - ${quote.workOrder.vehicle.brand} ${quote.workOrder.vehicle.model}`;
}

export default async function QuoteDetailPage({ params }: QuoteDetailPageProps) {
  const { id } = await params;
  const parsedId = quoteIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const quote = await getQuoteById(parsedId.data);

  if (!quote) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <Badge variant="secondary">{statusLabels[quote.status]}</Badge>
          <CardTitle>Presupuesto</CardTitle>
          <CardDescription>{formatWorkOrder(quote)}</CardDescription>
          <CardAction>
            <Link
              href="/quotes"
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
          <CardTitle>Datos del presupuesto</CardTitle>
          <CardDescription>
            Información general y totales calculados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Orden</dt>
              <dd className="text-sm font-medium">{formatWorkOrder(quote)}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Estado</dt>
              <dd className="text-sm font-medium">
                {statusLabels[quote.status]}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Notas</dt>
              <dd className="whitespace-pre-wrap text-sm font-medium">
                {formatOptionalValue(quote.notes)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Subtotal</dt>
              <dd className="text-sm font-medium">
                {formatMoney(quote.subtotal)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Impuestos</dt>
              <dd className="text-sm font-medium">{formatMoney(quote.tax)}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Total</dt>
              <dd className="text-sm font-medium">
                {formatMoney(quote.total)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Creado</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(quote.createdAt)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Actualizado</dt>
              <dd className="text-sm font-medium">
                {formatDateTime(quote.updatedAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aprobación</CardTitle>
          <CardDescription>
            Solicitud interna asociada a este presupuesto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quote.approval ? (
            <div className="flex flex-col items-start gap-3">
              <Badge variant="secondary">
                {approvalStatusLabels[quote.approval.status]}
              </Badge>
              <Link
                href={`/approvals/${quote.approval.id}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Ver aprobación
              </Link>
            </div>
          ) : (
            <RequestApprovalButton quoteId={quote.id} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ítems</CardTitle>
          <CardDescription>
            Mano de obra, repuestos y otros conceptos incluidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {quote.items.map((item) => (
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
                  <div>
                    <dt className="text-muted-foreground">Precio unitario</dt>
                    <dd className="font-medium">
                      {formatMoney(item.unitPrice)}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
