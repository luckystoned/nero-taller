import { FileText, Plus } from "lucide-react";
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

import { listQuotes } from "../../../../../features/quotes/queries";

type QuoteWithWorkOrder = Awaited<ReturnType<typeof listQuotes>>[number];

const statusLabels: Record<QuoteWithWorkOrder["status"], string> = {
  DRAFT: "Borrador",
  SENT: "Enviado",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  CANCELLED: "Cancelado",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}

function formatWorkOrder(quote: QuoteWithWorkOrder) {
  return `${quote.workOrder.vehicle.plate} - ${quote.workOrder.vehicle.brand} ${quote.workOrder.vehicle.model}`;
}

export default async function QuotesPage() {
  const quotes = await listQuotes();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Presupuestos</CardTitle>
          <CardDescription>
            Propuestas asociadas a órdenes de trabajo.
          </CardDescription>
          <CardAction>
            <Link
              href="/quotes/new"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <Plus data-icon="inline-start" aria-hidden="true" />
              Nuevo presupuesto
            </Link>
          </CardAction>
        </CardHeader>
      </Card>

      {quotes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-8">
            <Badge variant="secondary">Sin presupuestos</Badge>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">
                Todavía no hay presupuestos
              </h2>
              <p className="max-w-prose text-sm text-muted-foreground">
                Crea el primer presupuesto para una orden de trabajo existente.
              </p>
            </div>
            <Link href="/quotes/new" className={cn(buttonVariants())}>
              <Plus data-icon="inline-start" aria-hidden="true" />
              Crear presupuesto
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {quotes.map((quote) => (
            <Card key={quote.id} size="sm">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <FileText aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>
                      <Link
                        href={`/quotes/${quote.id}`}
                        className="hover:underline"
                      >
                        {formatWorkOrder(quote)}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {statusLabels[quote.status]}
                    </CardDescription>
                  </div>
                </div>
                <CardAction>
                  <Link
                    href={`/quotes/${quote.id}`}
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
                    <dt className="text-muted-foreground">Orden</dt>
                    <dd className="font-medium">{formatWorkOrder(quote)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-medium">
                      {formatMoney(quote.subtotal)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Impuestos</dt>
                    <dd className="font-medium">{formatMoney(quote.tax)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Total</dt>
                    <dd className="font-medium">{formatMoney(quote.total)}</dd>
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
