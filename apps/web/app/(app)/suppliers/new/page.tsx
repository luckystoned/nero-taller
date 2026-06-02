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

import { SupplierCreateForm } from "../_components/supplier-create-form";

export default function NewSupplierPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo proveedor</CardTitle>
        <CardDescription>
          Carga los datos mínimos del proveedor.
        </CardDescription>
        <CardAction>
          <Link
            href="/suppliers"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Volver
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <SupplierCreateForm />
      </CardContent>
    </Card>
  );
}
