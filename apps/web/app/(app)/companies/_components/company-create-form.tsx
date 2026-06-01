"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { createCompanyAction } from "../../../../../../features/companies/actions";
import {
  createCompanySchema,
  type CreateCompanyInput,
} from "../../../../../../features/companies/schemas";

type CompanyFormInput = z.input<typeof createCompanySchema>;

const companyFieldNames = [
  "name",
  "email",
  "phone",
  "taxId",
  "requiresApproval",
  "notes",
] as const satisfies readonly (keyof CompanyFormInput)[];

function isCompanyFieldName(value: string): value is keyof CompanyFormInput {
  return companyFieldNames.some((fieldName) => fieldName === value);
}

export function CompanyCreateForm() {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<CompanyFormInput, unknown, CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      taxId: "",
      requiresApproval: false,
      notes: "",
    },
  });

  async function onSubmit(values: CreateCompanyInput) {
    setFormMessage(null);

    const result = await createCompanyAction(values);

    if (result.success) {
      router.push(`/companies/${result.company.id}`);
      router.refresh();
      return;
    }

    setFormMessage(result.message);

    if (result.errors) {
      Object.entries(result.errors.fieldErrors).forEach(
        ([fieldName, messages]) => {
          const message = messages?.[0];

          if (message && isCompanyFieldName(fieldName)) {
            setError(fieldName, { message });
          }
        },
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre
          </label>
          <Input
            id="name"
            autoComplete="organization"
            aria-invalid={Boolean(errors.name)}
            placeholder="Empresa SRL"
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            placeholder="administracion@empresa.com"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Teléfono
          </label>
          <Input
            id="phone"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            placeholder="11 5555-5555"
            {...register("phone")}
          />
          {errors.phone ? (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="taxId" className="text-sm font-medium">
            CUIT o ID fiscal
          </label>
          <Input
            id="taxId"
            aria-invalid={Boolean(errors.taxId)}
            placeholder="30-00000000-0"
            {...register("taxId")}
          />
          {errors.taxId ? (
            <p className="text-sm text-destructive">{errors.taxId.message}</p>
          ) : null}
        </div>

        <div className="flex items-start gap-3 rounded-lg border p-3 md:col-span-2">
          <Input
            id="requiresApproval"
            type="checkbox"
            className="mt-0.5 size-4"
            aria-invalid={Boolean(errors.requiresApproval)}
            {...register("requiresApproval")}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="requiresApproval" className="text-sm font-medium">
              Requiere aprobación
            </label>
            <p className="text-sm text-muted-foreground">
              Marca esta opción si los trabajos de esta empresa requieren
              aprobación previa.
            </p>
            {errors.requiresApproval ? (
              <p className="text-sm text-destructive">
                {errors.requiresApproval.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notas
          </label>
          <Textarea
            id="notes"
            aria-invalid={Boolean(errors.notes)}
            placeholder="Observaciones internas de la empresa"
            {...register("notes")}
          />
          {errors.notes ? (
            <p className="text-sm text-destructive">{errors.notes.message}</p>
          ) : null}
        </div>
      </div>

      {formMessage ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formMessage}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link
          href="/companies"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ArrowLeft data-icon="inline-start" aria-hidden="true" />
          Volver
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          <Save data-icon="inline-start" aria-hidden="true" />
          {isSubmitting ? "Guardando..." : "Crear empresa"}
        </Button>
      </div>
    </form>
  );
}
