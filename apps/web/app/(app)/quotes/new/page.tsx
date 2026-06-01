import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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

import { listWorkOrders } from "../../../../../../features/work-orders/queries";

import { QuoteCreateForm } from "../_components/quote-create-form";

type WorkOrderWithVehicle = Awaited<ReturnType<typeof listWorkOrders>>[number];

function formatWorkOrderLabel(workOrder: WorkOrderWithVehicle) {
  return `${workOrder.vehicle.plate} - ${workOrder.vehicle.brand} ${workOrder.vehicle.model} - ${workOrder.intakeReason}`;
}

export default async function NewQuotePage() {
  const workOrders = await listWorkOrders();
  const workOrderOptions = workOrders.map((workOrder) => ({
    id: workOrder.id,
    label: formatWorkOrderLabel(workOrder),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo presupuesto</CardTitle>
        <CardDescription>
          Crea un presupuesto asociado a una orden de trabajo.
        </CardDescription>
        <CardAction>
          <Link
            href="/quotes"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Volver
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <QuoteCreateForm workOrders={workOrderOptions} />
      </CardContent>
    </Card>
  );
}
