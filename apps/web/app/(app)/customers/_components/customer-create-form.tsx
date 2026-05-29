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

import { createCustomerAction } from "../../../../../../features/customers/actions";
import {
  createCustomerSchema,
  type CreateCustomerInput,
} from "../../../../../../features/customers/schemas";

type CustomerFormInput = z.input<typeof createCustomerSchema>;

const customerFieldNames = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "documentId",
  "notes",
] as const satisfies readonly (keyof CustomerFormInput)[];

function isCustomerFieldName(value: string): value is keyof CustomerFormInput {
  return customerFieldNames.some((fieldName) => fieldName === value);
}

export function CustomerCreateForm() {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<CustomerFormInput, unknown, CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      documentId: "",
      notes: "",
    },
  });

  async function onSubmit(values: CreateCustomerInput) {
    setFormMessage(null);

    const result = await createCustomerAction(values);

    if (result.success) {
      router.push(`/customers/${result.customer.id}`);
      router.refresh();
      return;
    }

    setFormMessage(result.message);

    if (result.errors) {
      Object.entries(result.errors.fieldErrors).forEach(
        ([fieldName, messages]) => {
          const message = messages?.[0];

          if (message && isCustomerFieldName(fieldName)) {
            setError(fieldName, { message });
          }
        },
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            Nombre
          </label>
          <Input
            id="firstName"
            autoComplete="given-name"
            aria-invalid={Boolean(errors.firstName)}
            placeholder="Juan"
            {...register("firstName")}
          />
          {errors.firstName ? (
            <p className="text-sm text-destructive">
              {errors.firstName.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Apellido
          </label>
          <Input
            id="lastName"
            autoComplete="family-name"
            aria-invalid={Boolean(errors.lastName)}
            placeholder="Pérez"
            {...register("lastName")}
          />
          {errors.lastName ? (
            <p className="text-sm text-destructive">
              {errors.lastName.message}
            </p>
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
            placeholder="cliente@ejemplo.com"
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
          <label htmlFor="documentId" className="text-sm font-medium">
            Documento
          </label>
          <Input
            id="documentId"
            aria-invalid={Boolean(errors.documentId)}
            placeholder="DNI, CUIT u otra referencia"
            {...register("documentId")}
          />
          {errors.documentId ? (
            <p className="text-sm text-destructive">
              {errors.documentId.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notas
          </label>
          <Textarea
            id="notes"
            aria-invalid={Boolean(errors.notes)}
            placeholder="Observaciones internas del cliente"
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
          href="/customers"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ArrowLeft data-icon="inline-start" aria-hidden="true" />
          Volver
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          <Save data-icon="inline-start" aria-hidden="true" />
          {isSubmitting ? "Guardando..." : "Crear cliente"}
        </Button>
      </div>
    </form>
  );
}
