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

import { createPartAction } from "../../../../../../features/parts/actions";
import {
  createPartSchema,
  type CreatePartInput,
} from "../../../../../../features/parts/schemas";

type PartFormInput = z.input<typeof createPartSchema>;

type SupplierOption = {
  id: string;
  name: string;
};

type PartCreateFormProps = {
  suppliers: SupplierOption[];
};

const partFieldNames = [
  "name",
  "sku",
  "description",
  "brand",
  "unitCost",
  "salePrice",
  "stock",
  "supplierId",
] as const satisfies readonly (keyof PartFormInput)[];

function isPartFieldName(value: string): value is keyof PartFormInput {
  return partFieldNames.some((fieldName) => fieldName === value);
}

function requiredNumber(value: unknown) {
  if (value === "") {
    return Number.NaN;
  }

  return Number(value);
}

function optionalNumber(value: unknown) {
  if (value === "") {
    return null;
  }

  return Number(value);
}

export function PartCreateForm({ suppliers }: PartCreateFormProps) {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<PartFormInput, unknown, CreatePartInput>({
    resolver: zodResolver(createPartSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      brand: "",
      unitCost: 0,
      salePrice: null,
      stock: null,
      supplierId: "",
    },
  });

  async function onSubmit(values: CreatePartInput) {
    setFormMessage(null);

    const result = await createPartAction(values);

    if (result.success) {
      router.push(`/parts/${result.part.id}`);
      router.refresh();
      return;
    }

    setFormMessage(result.message);

    if (result.errors) {
      Object.entries(result.errors.fieldErrors).forEach(
        ([fieldName, messages]) => {
          const message = messages?.[0];

          if (message && isPartFieldName(fieldName)) {
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
            aria-invalid={Boolean(errors.name)}
            placeholder="Filtro de aceite"
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="sku" className="text-sm font-medium">
            SKU
          </label>
          <Input
            id="sku"
            aria-invalid={Boolean(errors.sku)}
            placeholder="FILTRO-001"
            {...register("sku")}
          />
          {errors.sku ? (
            <p className="text-sm text-destructive">{errors.sku.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="brand" className="text-sm font-medium">
            Marca
          </label>
          <Input
            id="brand"
            aria-invalid={Boolean(errors.brand)}
            placeholder="Bosch"
            {...register("brand")}
          />
          {errors.brand ? (
            <p className="text-sm text-destructive">{errors.brand.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="unitCost" className="text-sm font-medium">
            Costo unitario
          </label>
          <Input
            id="unitCost"
            type="number"
            min="0"
            step="0.01"
            aria-invalid={Boolean(errors.unitCost)}
            {...register("unitCost", {
              setValueAs: requiredNumber,
            })}
          />
          {errors.unitCost ? (
            <p className="text-sm text-destructive">
              {errors.unitCost.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="salePrice" className="text-sm font-medium">
            Precio de venta
          </label>
          <Input
            id="salePrice"
            type="number"
            min="0"
            step="0.01"
            aria-invalid={Boolean(errors.salePrice)}
            {...register("salePrice", {
              setValueAs: optionalNumber,
            })}
          />
          {errors.salePrice ? (
            <p className="text-sm text-destructive">
              {errors.salePrice.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="stock" className="text-sm font-medium">
            Stock
          </label>
          <Input
            id="stock"
            type="number"
            min="0"
            step="1"
            aria-invalid={Boolean(errors.stock)}
            {...register("stock", {
              setValueAs: optionalNumber,
            })}
          />
          {errors.stock ? (
            <p className="text-sm text-destructive">{errors.stock.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="supplierId" className="text-sm font-medium">
            Proveedor
          </label>
          <select
            id="supplierId"
            aria-invalid={Boolean(errors.supplierId)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            {...register("supplierId")}
          >
            <option value="">Sin proveedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
          {errors.supplierId ? (
            <p className="text-sm text-destructive">
              {errors.supplierId.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="description" className="text-sm font-medium">
            Descripción
          </label>
          <Textarea
            id="description"
            aria-invalid={Boolean(errors.description)}
            placeholder="Detalles internos del repuesto"
            {...register("description")}
          />
          {errors.description ? (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
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
          href="/parts"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ArrowLeft data-icon="inline-start" aria-hidden="true" />
          Volver
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          <Save data-icon="inline-start" aria-hidden="true" />
          {isSubmitting ? "Guardando..." : "Crear repuesto"}
        </Button>
      </div>
    </form>
  );
}
