"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import {
  createQuoteSchema,
  deleteQuoteSchema,
  updateQuoteSchema,
} from "../schemas";
import { createQuote, deleteQuote, updateQuote } from "../services";
import type { Quote } from "../types";

type QuoteActionError = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

type QuoteActionResult =
  | {
      success: true;
      quote: Quote;
    }
  | {
      success: false;
      message: string;
      errors?: QuoteActionError;
    };

function formatValidationError(error: ZodError): QuoteActionError {
  return error.flatten();
}

function formatServiceError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export async function createQuoteAction(
  input: unknown,
): Promise<QuoteActionResult> {
  const parsed = createQuoteSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos crear el presupuesto. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const quote = await createQuote(parsed.data);
    revalidatePath("/quotes");

    return { success: true, quote };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos crear el presupuesto. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function updateQuoteAction(
  input: unknown,
): Promise<QuoteActionResult> {
  const parsed = updateQuoteSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message:
        "No pudimos actualizar el presupuesto. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const quote = await updateQuote(parsed.data);
    revalidatePath("/quotes");

    return { success: true, quote };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos actualizar el presupuesto. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function deleteQuoteAction(
  input: unknown,
): Promise<QuoteActionResult> {
  const parsed = deleteQuoteSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos eliminar el presupuesto. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const quote = await deleteQuote(parsed.data);
    revalidatePath("/quotes");

    return { success: true, quote };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos eliminar el presupuesto. Revisá los datos ingresados.",
      ),
    };
  }
}
