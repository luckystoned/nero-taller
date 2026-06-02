"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import {
  createSupplierSchema,
  deleteSupplierSchema,
  updateSupplierSchema,
} from "../schemas";
import { createSupplier, deleteSupplier, updateSupplier } from "../services";
import type { Supplier } from "../types";

type SupplierActionError = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

type SupplierActionResult =
  | {
      success: true;
      supplier: Supplier;
    }
  | {
      success: false;
      message: string;
      errors?: SupplierActionError;
    };

function formatValidationError(error: ZodError): SupplierActionError {
  return error.flatten();
}

export async function createSupplierAction(
  input: unknown,
): Promise<SupplierActionResult> {
  const parsed = createSupplierSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos crear el proveedor. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  const supplier = await createSupplier(parsed.data);
  revalidatePath("/suppliers");

  return { success: true, supplier };
}

export async function updateSupplierAction(
  input: unknown,
): Promise<SupplierActionResult> {
  const parsed = updateSupplierSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message:
        "No pudimos actualizar el proveedor. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  const supplier = await updateSupplier(parsed.data);
  revalidatePath("/suppliers");

  return { success: true, supplier };
}

export async function deleteSupplierAction(
  input: unknown,
): Promise<SupplierActionResult> {
  const parsed = deleteSupplierSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos eliminar el proveedor. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  const supplier = await deleteSupplier(parsed.data);
  revalidatePath("/suppliers");

  return { success: true, supplier };
}
