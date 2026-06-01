"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { createQuoteAction } from "../../../../../../features/quotes/actions";
import {
  createQuoteSchema,
  quoteItemTypes,
  type CreateQuoteInput,
} from "../../../../../../features/quotes/schemas";

type QuoteFormInput = z.input<typeof createQuoteSchema>;

type WorkOrderOption = {
  id: string;
  label: string;
};

type QuoteCreateFormProps = {
  workOrders: WorkOrderOption[];
};

const quoteFieldNames = [
  "workOrderId",
  "notes",
  "items",
] as const satisfies readonly (keyof QuoteFormInput)[];

const itemTypeLabels: Record<(typeof quoteItemTypes)[number], string> = {
  LABOR: "Mano de obra",
  PART: "Repuesto",
  OTHER: "Otro",
};

function isQuoteFieldName(value: string): value is keyof QuoteFormInput {
  return quoteFieldNames.some((fieldName) => fieldName === value);
}

function optionalNumber(value: unknown) {
  if (value === "") {
    return 0;
  }

  return Number(value);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}

export function QuoteCreateForm({ workOrders }: QuoteCreateFormProps) {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<QuoteFormInput, unknown, CreateQuoteInput>({
    resolver: zodResolver(createQuoteSchema),
    defaultValues: {
      workOrderId: "",
      notes: "",
      items: [
        {
          description: "",
          type: "LABOR",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    },
  });

  const { append, fields, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({
    control,
    name: "items",
  });

  const previewSubtotal = useMemo(() => {
    return (watchedItems ?? []).reduce((subtotal, item) => {
      const quantity = Number(item?.quantity ?? 0);
      const unitPrice = Number(item?.unitPrice ?? 0);

      return subtotal + quantity * unitPrice;
    }, 0);
  }, [watchedItems]);

  async function onSubmit(values: CreateQuoteInput) {
    setFormMessage(null);

    const result = await createQuoteAction(values);

    if (result.success) {
      router.push(`/quotes/${result.quote.id}`);
      router.refresh();
      return;
    }

    setFormMessage(result.message);

    if (result.errors) {
      Object.entries(result.errors.fieldErrors).forEach(
        ([fieldName, messages]) => {
          const message = messages?.[0];

          if (message && isQuoteFieldName(fieldName)) {
            setError(fieldName, { message });
          }
        },
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="workOrderId" className="text-sm font-medium">
            Orden de trabajo
          </label>
          <select
            id="workOrderId"
            aria-invalid={Boolean(errors.workOrderId)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            {...register("workOrderId")}
          >
            <option value="">Seleccionar orden</option>
            {workOrders.map((workOrder) => (
              <option key={workOrder.id} value={workOrder.id}>
                {workOrder.label}
              </option>
            ))}
          </select>
          {errors.workOrderId ? (
            <p className="text-sm text-destructive">
              {errors.workOrderId.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notas
          </label>
          <Textarea
            id="notes"
            aria-invalid={Boolean(errors.notes)}
            placeholder="Notas internas del presupuesto"
            {...register("notes")}
          />
          {errors.notes ? (
            <p className="text-sm text-destructive">{errors.notes.message}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-medium">Ítems</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                description: "",
                type: "LABOR",
                quantity: 1,
                unitPrice: 0,
              })
            }
          >
            <Plus data-icon="inline-start" aria-hidden="true" />
            Agregar ítem
          </Button>
        </div>

        {errors.items?.root?.message ? (
          <p className="text-sm text-destructive">{errors.items.root.message}</p>
        ) : null}
        {typeof errors.items?.message === "string" ? (
          <p className="text-sm text-destructive">{errors.items.message}</p>
        ) : null}

        <div className="grid gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border p-3">
              <div className="grid gap-3 md:grid-cols-[1fr_140px_120px_140px_auto]">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`items.${index}.description`}
                    className="text-sm font-medium"
                  >
                    Descripción
                  </label>
                  <Input
                    id={`items.${index}.description`}
                    aria-invalid={Boolean(errors.items?.[index]?.description)}
                    placeholder="Servicio o repuesto"
                    {...register(`items.${index}.description`)}
                  />
                  {errors.items?.[index]?.description ? (
                    <p className="text-sm text-destructive">
                      {errors.items[index]?.description?.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`items.${index}.type`}
                    className="text-sm font-medium"
                  >
                    Tipo
                  </label>
                  <select
                    id={`items.${index}.type`}
                    aria-invalid={Boolean(errors.items?.[index]?.type)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...register(`items.${index}.type`)}
                  >
                    {quoteItemTypes.map((type) => (
                      <option key={type} value={type}>
                        {itemTypeLabels[type]}
                      </option>
                    ))}
                  </select>
                  {errors.items?.[index]?.type ? (
                    <p className="text-sm text-destructive">
                      {errors.items[index]?.type?.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`items.${index}.quantity`}
                    className="text-sm font-medium"
                  >
                    Cantidad
                  </label>
                  <Input
                    id={`items.${index}.quantity`}
                    type="number"
                    min="0"
                    step="1"
                    aria-invalid={Boolean(errors.items?.[index]?.quantity)}
                    {...register(`items.${index}.quantity`, {
                      setValueAs: optionalNumber,
                    })}
                  />
                  {errors.items?.[index]?.quantity ? (
                    <p className="text-sm text-destructive">
                      {errors.items[index]?.quantity?.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`items.${index}.unitPrice`}
                    className="text-sm font-medium"
                  >
                    Precio unitario
                  </label>
                  <Input
                    id={`items.${index}.unitPrice`}
                    type="number"
                    min="0"
                    step="0.01"
                    aria-invalid={Boolean(errors.items?.[index]?.unitPrice)}
                    {...register(`items.${index}.unitPrice`, {
                      setValueAs: optionalNumber,
                    })}
                  />
                  {errors.items?.[index]?.unitPrice ? (
                    <p className="text-sm text-destructive">
                      {errors.items[index]?.unitPrice?.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Eliminar ítem"
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <dl className="grid gap-3 rounded-lg border p-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="font-medium">{formatMoney(previewSubtotal)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Impuestos</dt>
          <dd className="font-medium">{formatMoney(0)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Total</dt>
          <dd className="font-medium">{formatMoney(previewSubtotal)}</dd>
        </div>
      </dl>

      {formMessage ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formMessage}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link
          href="/quotes"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ArrowLeft data-icon="inline-start" aria-hidden="true" />
          Volver
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          <Save data-icon="inline-start" aria-hidden="true" />
          {isSubmitting ? "Guardando..." : "Crear presupuesto"}
        </Button>
      </div>
    </form>
  );
}
