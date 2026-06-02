"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import {
  createPartSchema,
  deletePartSchema,
  updatePartSchema,
} from "../schemas";
import { serializePart } from "../serializers";
import { createPart, deletePart, updatePart } from "../services";
import type { PartDTO } from "../types";

type PartActionError = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

type PartActionResult =
  | {
      success: true;
      part: PartDTO;
    }
  | {
      success: false;
      message: string;
      errors?: PartActionError;
    };

function formatValidationError(error: ZodError): PartActionError {
  return error.flatten();
}

function formatServiceError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export async function createPartAction(
  input: unknown,
): Promise<PartActionResult> {
  const parsed = createPartSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos crear el repuesto. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const part = await createPart(parsed.data);
    revalidatePath("/parts");

    return { success: true, part: serializePart(part) };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos crear el repuesto. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function updatePartAction(
  input: unknown,
): Promise<PartActionResult> {
  const parsed = updatePartSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos actualizar el repuesto. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const part = await updatePart(parsed.data);
    revalidatePath("/parts");

    return { success: true, part: serializePart(part) };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos actualizar el repuesto. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function deletePartAction(
  input: unknown,
): Promise<PartActionResult> {
  const parsed = deletePartSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos eliminar el repuesto. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const part = await deletePart(parsed.data);
    revalidatePath("/parts");

    return { success: true, part: serializePart(part) };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos eliminar el repuesto. Revisá los datos ingresados.",
      ),
    };
  }
}
