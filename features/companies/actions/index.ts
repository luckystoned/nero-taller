"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import {
  createCompanySchema,
  deleteCompanySchema,
  updateCompanySchema,
} from "../schemas";
import { createCompany, deleteCompany, updateCompany } from "../services";
import type { Company } from "../types";

type CompanyActionError = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

type CompanyActionResult =
  | {
      success: true;
      company: Company;
    }
  | {
      success: false;
      message: string;
      errors?: CompanyActionError;
    };

function formatValidationError(error: ZodError): CompanyActionError {
  return error.flatten();
}

export async function createCompanyAction(
  input: unknown,
): Promise<CompanyActionResult> {
  const parsed = createCompanySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos crear la empresa. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  const company = await createCompany(parsed.data);
  revalidatePath("/companies");

  return { success: true, company };
}

export async function updateCompanyAction(
  input: unknown,
): Promise<CompanyActionResult> {
  const parsed = updateCompanySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos actualizar la empresa. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  const company = await updateCompany(parsed.data);
  revalidatePath("/companies");

  return { success: true, company };
}

export async function deleteCompanyAction(
  input: unknown,
): Promise<CompanyActionResult> {
  const parsed = deleteCompanySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos eliminar la empresa. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  const company = await deleteCompany(parsed.data);
  revalidatePath("/companies");

  return { success: true, company };
}
