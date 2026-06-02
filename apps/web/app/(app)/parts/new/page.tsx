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

import { listSuppliers } from "../../../../../../features/suppliers/queries";

import { PartCreateForm } from "../_components/part-create-form";

export default async function NewPartPage() {
  const suppliers = await listSuppliers();
  const supplierOptions = suppliers.map((supplier) => ({
    id: supplier.id,
    name: supplier.name,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo repuesto</CardTitle>
        <CardDescription>
          Carga los datos mínimos del repuesto.
        </CardDescription>
        <CardAction>
          <Link
            href="/parts"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Volver
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <PartCreateForm suppliers={supplierOptions} />
      </CardContent>
    </Card>
  );
}
