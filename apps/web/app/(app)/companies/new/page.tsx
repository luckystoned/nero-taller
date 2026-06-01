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

import { CompanyCreateForm } from "../_components/company-create-form";

export default function NewCompanyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva empresa</CardTitle>
        <CardDescription>
          Carga los datos mínimos del cliente empresa.
        </CardDescription>
        <CardAction>
          <Link
            href="/companies"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Volver
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <CompanyCreateForm />
      </CardContent>
    </Card>
  );
}
