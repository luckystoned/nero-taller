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
import { cn } from "@/lib/utils";

import { createVehicleAction } from "../../../../../../features/vehicles/actions";
import {
  createVehicleSchema,
  type CreateVehicleInput,
} from "../../../../../../features/vehicles/schemas";

type VehicleFormInput = z.input<typeof createVehicleSchema>;

type OwnerOption = {
  id: string;
  label: string;
};

type VehicleCreateFormProps = {
  customers: OwnerOption[];
  companies: OwnerOption[];
};

type OwnerType = "customer" | "company";

const vehicleFieldNames = [
  "plate",
  "brand",
  "model",
  "year",
  "vin",
  "mileage",
  "customerId",
  "companyId",
] as const satisfies readonly (keyof VehicleFormInput)[];

function isVehicleFieldName(value: string): value is keyof VehicleFormInput {
  return vehicleFieldNames.some((fieldName) => fieldName === value);
}

function optionalNumber(value: unknown) {
  if (value === "") {
    return null;
  }

  return Number(value);
}

export function VehicleCreateForm({
  customers,
  companies,
}: VehicleCreateFormProps) {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [ownerType, setOwnerType] = useState<OwnerType>("customer");

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<VehicleFormInput, unknown, CreateVehicleInput>({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: {
      plate: "",
      brand: "",
      model: "",
      year: null,
      vin: "",
      mileage: null,
      customerId: null,
      companyId: null,
    },
  });

  function handleOwnerTypeChange(nextOwnerType: OwnerType) {
    setOwnerType(nextOwnerType);

    if (nextOwnerType === "customer") {
      setValue("companyId", null, { shouldValidate: true });
      return;
    }

    setValue("customerId", null, { shouldValidate: true });
  }

  async function onSubmit(values: CreateVehicleInput) {
    setFormMessage(null);

    const result = await createVehicleAction(values);

    if (result.success) {
      router.push(`/vehicles/${result.vehicle.id}`);
      router.refresh();
      return;
    }

    setFormMessage(result.message);

    if (result.errors) {
      Object.entries(result.errors.fieldErrors).forEach(
        ([fieldName, messages]) => {
          const message = messages?.[0];

          if (message && isVehicleFieldName(fieldName)) {
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
          <label htmlFor="plate" className="text-sm font-medium">
            Patente
          </label>
          <Input
            id="plate"
            aria-invalid={Boolean(errors.plate)}
            placeholder="AA123BB"
            {...register("plate")}
          />
          {errors.plate ? (
            <p className="text-sm text-destructive">{errors.plate.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="vin" className="text-sm font-medium">
            VIN
          </label>
          <Input
            id="vin"
            aria-invalid={Boolean(errors.vin)}
            placeholder="Opcional"
            {...register("vin")}
          />
          {errors.vin ? (
            <p className="text-sm text-destructive">{errors.vin.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="brand" className="text-sm font-medium">
            Marca
          </label>
          <Input
            id="brand"
            aria-invalid={Boolean(errors.brand)}
            placeholder="Toyota"
            {...register("brand")}
          />
          {errors.brand ? (
            <p className="text-sm text-destructive">{errors.brand.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="model" className="text-sm font-medium">
            Modelo
          </label>
          <Input
            id="model"
            aria-invalid={Boolean(errors.model)}
            placeholder="Corolla"
            {...register("model")}
          />
          {errors.model ? (
            <p className="text-sm text-destructive">{errors.model.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="year" className="text-sm font-medium">
            Año
          </label>
          <Input
            id="year"
            type="number"
            min="0"
            aria-invalid={Boolean(errors.year)}
            placeholder="2020"
            {...register("year", { setValueAs: optionalNumber })}
          />
          {errors.year ? (
            <p className="text-sm text-destructive">{errors.year.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="mileage" className="text-sm font-medium">
            Kilometraje
          </label>
          <Input
            id="mileage"
            type="number"
            min="0"
            aria-invalid={Boolean(errors.mileage)}
            placeholder="85000"
            {...register("mileage", { setValueAs: optionalNumber })}
          />
          {errors.mileage ? (
            <p className="text-sm text-destructive">
              {errors.mileage.message}
            </p>
          ) : null}
        </div>

        <fieldset className="flex flex-col gap-3 rounded-lg border p-4 md:col-span-2">
          <legend className="px-1 text-sm font-medium">Propietario</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 rounded-lg border p-3 text-sm">
              <Input
                type="radio"
                name="ownerType"
                value="customer"
                checked={ownerType === "customer"}
                onChange={() => handleOwnerTypeChange("customer")}
                className="size-4"
              />
              Cliente
            </label>
            <label className="flex items-center gap-2 rounded-lg border p-3 text-sm">
              <Input
                type="radio"
                name="ownerType"
                value="company"
                checked={ownerType === "company"}
                onChange={() => handleOwnerTypeChange("company")}
                className="size-4"
              />
              Empresa
            </label>
          </div>

          {ownerType === "customer" ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="customerId" className="text-sm font-medium">
                Cliente
              </label>
              <select
                id="customerId"
                aria-invalid={Boolean(errors.customerId)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                {...register("customerId")}
              >
                <option value="">Seleccionar cliente</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.label}
                  </option>
                ))}
              </select>
              {errors.customerId ? (
                <p className="text-sm text-destructive">
                  {errors.customerId.message}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label htmlFor="companyId" className="text-sm font-medium">
                Empresa
              </label>
              <select
                id="companyId"
                aria-invalid={Boolean(errors.companyId)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                {...register("companyId")}
              >
                <option value="">Seleccionar empresa</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.label}
                  </option>
                ))}
              </select>
              {errors.companyId ? (
                <p className="text-sm text-destructive">
                  {errors.companyId.message}
                </p>
              ) : null}
            </div>
          )}
        </fieldset>
      </div>

      {formMessage ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formMessage}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link
          href="/vehicles"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ArrowLeft data-icon="inline-start" aria-hidden="true" />
          Volver
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          <Save data-icon="inline-start" aria-hidden="true" />
          {isSubmitting ? "Guardando..." : "Crear vehículo"}
        </Button>
      </div>
    </form>
  );
}
