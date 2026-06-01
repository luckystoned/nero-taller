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

import { listCompanies } from "../../../../../../features/companies/queries";
import { listCustomers } from "../../../../../../features/customers/queries";

import { VehicleCreateForm } from "../_components/vehicle-create-form";

export default async function NewVehiclePage() {
  const [customers, companies] = await Promise.all([
    listCustomers(),
    listCompanies(),
  ]);

  const customerOptions = customers.map((customer) => ({
    id: customer.id,
    label: `${customer.lastName}, ${customer.firstName}`,
  }));

  const companyOptions = companies.map((company) => ({
    id: company.id,
    label: company.name,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo vehículo</CardTitle>
        <CardDescription>
          Carga los datos mínimos del vehículo y su propietario.
        </CardDescription>
        <CardAction>
          <Link
            href="/vehicles"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Volver
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <VehicleCreateForm
          customers={customerOptions}
          companies={companyOptions}
        />
      </CardContent>
    </Card>
  );
}
