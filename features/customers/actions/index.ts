"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import {
  createCustomerSchema,
  deleteCustomerSchema,
  updateCustomerSchema,
} from "../schemas";
import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "../services";
import type { Customer } from "../types";

type CustomerActionError = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

type CustomerActionResult =
  | {
      success: true;
      customer: Customer;
    }
  | {
      success: false;
      message: string;
      errors?: CustomerActionError;
    };

function formatValidationError(error: ZodError): CustomerActionError {
  return error.flatten();
}

export async function createCustomerAction(
  input: unknown,
): Promise<CustomerActionResult> {
  const parsed = createCustomerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos crear el cliente. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  const customer = await createCustomer(parsed.data);
  revalidatePath("/customers");

  return { success: true, customer };
}

export async function updateCustomerAction(
  input: unknown,
): Promise<CustomerActionResult> {
  const parsed = updateCustomerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos actualizar el cliente. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  const customer = await updateCustomer(parsed.data);
  revalidatePath("/customers");

  return { success: true, customer };
}

export async function deleteCustomerAction(
  input: unknown,
): Promise<CustomerActionResult> {
  const parsed = deleteCustomerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos eliminar el cliente. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  const customer = await deleteCustomer(parsed.data);
  revalidatePath("/customers");

  return { success: true, customer };
}
