"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import {
  createPublicVehicleHistorySchema,
  updatePublicVehicleHistoryStatusSchema,
} from "../schemas";
import {
  createPublicVehicleHistory,
  updatePublicVehicleHistoryStatus,
} from "../services";
import type { PublicVehicleHistory } from "../types";

type PublicVehicleHistoryActionError = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

type PublicVehicleHistoryActionResult =
  | {
      success: true;
      publicHistory: PublicVehicleHistory;
    }
  | {
      success: false;
      message: string;
      errors?: PublicVehicleHistoryActionError;
    };

function formatValidationError(
  error: ZodError,
): PublicVehicleHistoryActionError {
  return error.flatten();
}

function formatServiceError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export async function createPublicVehicleHistoryAction(
  input: unknown,
): Promise<PublicVehicleHistoryActionResult> {
  const parsed = createPublicVehicleHistorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message:
        "No pudimos crear el historial público. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const publicHistory = await createPublicVehicleHistory(parsed.data);
    revalidatePath("/vehicles");
    revalidatePath(`/vehicles/${publicHistory.vehicleId}`);

    return { success: true, publicHistory };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos crear el historial público. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function updatePublicVehicleHistoryStatusAction(
  input: unknown,
): Promise<PublicVehicleHistoryActionResult> {
  const parsed = updatePublicVehicleHistoryStatusSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message:
        "No pudimos actualizar el historial público. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const publicHistory = await updatePublicVehicleHistoryStatus(parsed.data);
    revalidatePath("/vehicles");
    revalidatePath(`/vehicles/${publicHistory.vehicleId}`);

    return { success: true, publicHistory };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos actualizar el historial público. Revisá los datos ingresados.",
      ),
    };
  }
}
