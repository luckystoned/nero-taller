"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import {
  createVehicleSchema,
  deleteVehicleSchema,
  updateVehicleSchema,
} from "../schemas";
import { createVehicle, deleteVehicle, updateVehicle } from "../services";
import type { Vehicle } from "../types";

type VehicleActionError = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

type VehicleActionResult =
  | {
      success: true;
      vehicle: Vehicle;
    }
  | {
      success: false;
      message: string;
      errors?: VehicleActionError;
    };

function formatValidationError(error: ZodError): VehicleActionError {
  return error.flatten();
}

function formatServiceError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export async function createVehicleAction(
  input: unknown,
): Promise<VehicleActionResult> {
  const parsed = createVehicleSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos crear el vehículo. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const vehicle = await createVehicle(parsed.data);
    revalidatePath("/vehicles");

    return { success: true, vehicle };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos crear el vehículo. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function updateVehicleAction(
  input: unknown,
): Promise<VehicleActionResult> {
  const parsed = updateVehicleSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos actualizar el vehículo. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const vehicle = await updateVehicle(parsed.data);
    revalidatePath("/vehicles");

    return { success: true, vehicle };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos actualizar el vehículo. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function deleteVehicleAction(
  input: unknown,
): Promise<VehicleActionResult> {
  const parsed = deleteVehicleSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos eliminar el vehículo. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const vehicle = await deleteVehicle(parsed.data);
    revalidatePath("/vehicles");

    return { success: true, vehicle };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos eliminar el vehículo. Revisá los datos ingresados.",
      ),
    };
  }
}
