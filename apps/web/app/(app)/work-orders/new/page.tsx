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

import { listVehicles } from "../../../../../../features/vehicles/queries";

import { WorkOrderCreateForm } from "../_components/work-order-create-form";

type VehicleWithOwner = Awaited<ReturnType<typeof listVehicles>>[number];

function formatOwner(vehicle: VehicleWithOwner) {
  if (vehicle.customer) {
    return `${vehicle.customer.lastName}, ${vehicle.customer.firstName}`;
  }

  if (vehicle.company) {
    return vehicle.company.name;
  }

  return "Sin propietario";
}

export default async function NewWorkOrderPage() {
  const vehicles = await listVehicles();
  const vehicleOptions = vehicles.map((vehicle) => ({
    id: vehicle.id,
    label: `${vehicle.plate} - ${vehicle.brand} ${vehicle.model} - ${formatOwner(vehicle)}`,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva orden de trabajo</CardTitle>
        <CardDescription>
          Carga la recepción inicial del vehículo en el taller.
        </CardDescription>
        <CardAction>
          <Link
            href="/work-orders"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Volver
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <WorkOrderCreateForm vehicles={vehicleOptions} />
      </CardContent>
    </Card>
  );
}
