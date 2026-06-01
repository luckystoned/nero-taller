"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import {
  changeWorkOrderStatusSchema,
  createWorkOrderSchema,
  deleteWorkOrderSchema,
  updateWorkOrderSchema,
} from "../schemas";
import {
  changeWorkOrderStatus,
  createWorkOrder,
  deleteWorkOrder,
  updateWorkOrder,
} from "../services";
import type { WorkOrder } from "../types";

type WorkOrderActionError = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

type WorkOrderActionResult =
  | {
      success: true;
      workOrder: WorkOrder;
    }
  | {
      success: false;
      message: string;
      errors?: WorkOrderActionError;
    };

function formatValidationError(error: ZodError): WorkOrderActionError {
  return error.flatten();
}

function formatServiceError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export async function createWorkOrderAction(
  input: unknown,
): Promise<WorkOrderActionResult> {
  const parsed = createWorkOrderSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message:
        "No pudimos crear la orden de trabajo. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const workOrder = await createWorkOrder(parsed.data);
    revalidatePath("/work-orders");

    return { success: true, workOrder };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos crear la orden de trabajo. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function updateWorkOrderAction(
  input: unknown,
): Promise<WorkOrderActionResult> {
  const parsed = updateWorkOrderSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message:
        "No pudimos actualizar la orden de trabajo. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const workOrder = await updateWorkOrder(parsed.data);
    revalidatePath("/work-orders");

    return { success: true, workOrder };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos actualizar la orden de trabajo. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function deleteWorkOrderAction(
  input: unknown,
): Promise<WorkOrderActionResult> {
  const parsed = deleteWorkOrderSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message:
        "No pudimos eliminar la orden de trabajo. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const workOrder = await deleteWorkOrder(parsed.data);
    revalidatePath("/work-orders");

    return { success: true, workOrder };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos eliminar la orden de trabajo. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function changeWorkOrderStatusAction(
  input: unknown,
): Promise<WorkOrderActionResult> {
  const parsed = changeWorkOrderStatusSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message:
        "No pudimos cambiar el estado de la orden. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const workOrder = await changeWorkOrderStatus(parsed.data);
    revalidatePath("/work-orders");
    revalidatePath(`/work-orders/${workOrder.id}`);

    return { success: true, workOrder };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos cambiar el estado de la orden. Revisá los datos ingresados.",
      ),
    };
  }
}
