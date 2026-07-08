"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import { createClient } from "../../../apps/web/lib/supabase/server";

import {
  cancelAppointmentSchema,
  createAppointmentSchema,
  createWorkOrderFromAppointmentSchema,
  deleteAppointmentSchema,
  linkWorkOrderToAppointmentSchema,
  rescheduleAppointmentSchema,
  updateAppointmentSchema,
} from "../schemas";
import {
  cancelAppointment,
  createAppointment,
  createWorkOrderFromAppointment,
  deleteAppointment,
  linkWorkOrderToAppointment,
  rescheduleAppointment,
  updateAppointment,
} from "../services";
import type { Appointment } from "../types";
import type { WorkOrder } from "../../work-orders/types";

type AppointmentActionError = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

type AppointmentActionResult =
  | {
      success: true;
      appointment: Appointment;
    }
  | {
      success: false;
      message: string;
      errors?: AppointmentActionError;
    };

type AppointmentWorkOrderActionResult =
  | {
      success: true;
      appointment: Appointment;
      workOrder: WorkOrder;
    }
  | {
      success: false;
      message: string;
      errors?: AppointmentActionError;
    };

function formatValidationError(error: ZodError): AppointmentActionError {
  return error.flatten();
}

function formatServiceError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

async function getCurrentUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const subject = data?.claims?.sub;

  return typeof subject === "string" ? subject : null;
}

function revalidateAppointmentPaths(appointmentId?: string) {
  revalidatePath("/appointments");

  if (appointmentId) {
    revalidatePath(`/appointments/${appointmentId}`);
    revalidatePath(`/appointments/${appointmentId}/edit`);
  }
}

function revalidateAppointmentAndWorkOrderPaths(
  appointmentId: string,
  workOrderId: string,
) {
  revalidateAppointmentPaths(appointmentId);
  revalidatePath("/work-orders");
  revalidatePath(`/work-orders/${workOrderId}`);
}

export async function createAppointmentAction(
  input: unknown,
): Promise<AppointmentActionResult> {
  const parsed = createAppointmentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos crear el turno. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const appointment = await createAppointment({
      ...parsed.data,
      createdBy: parsed.data.createdBy ?? (await getCurrentUserId()),
    });
    revalidateAppointmentPaths(appointment.id);

    return { success: true, appointment };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos crear el turno. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function updateAppointmentAction(
  input: unknown,
): Promise<AppointmentActionResult> {
  const parsed = updateAppointmentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos actualizar el turno. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const appointment = await updateAppointment(parsed.data);
    revalidateAppointmentPaths(appointment.id);

    return { success: true, appointment };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos actualizar el turno. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function cancelAppointmentAction(
  input: unknown,
): Promise<AppointmentActionResult> {
  const parsed = cancelAppointmentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos cancelar el turno. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const appointment = await cancelAppointment(parsed.data);
    revalidateAppointmentPaths(appointment.id);

    return { success: true, appointment };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos cancelar el turno. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function deleteAppointmentAction(
  input: unknown,
): Promise<AppointmentActionResult> {
  const parsed = deleteAppointmentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos borrar el turno. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const appointment = await deleteAppointment(parsed.data);
    revalidateAppointmentPaths();

    return { success: true, appointment };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos borrar el turno. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function rescheduleAppointmentAction(
  input: unknown,
): Promise<AppointmentActionResult> {
  const parsed = rescheduleAppointmentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos reprogramar el turno. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const appointment = await rescheduleAppointment(parsed.data);
    revalidateAppointmentPaths(appointment.id);

    return { success: true, appointment };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos reprogramar el turno. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function createWorkOrderFromAppointmentAction(
  input: unknown,
): Promise<AppointmentWorkOrderActionResult> {
  const parsed = createWorkOrderFromAppointmentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message:
        "No pudimos crear la orden desde el turno. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const result = await createWorkOrderFromAppointment(parsed.data);
    revalidateAppointmentAndWorkOrderPaths(
      result.appointment.id,
      result.workOrder.id,
    );

    return { success: true, ...result };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos crear la orden desde el turno. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function linkWorkOrderToAppointmentAction(
  input: unknown,
): Promise<AppointmentWorkOrderActionResult> {
  const parsed = linkWorkOrderToAppointmentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message:
        "No pudimos asociar la orden al turno. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const result = await linkWorkOrderToAppointment(parsed.data);
    revalidateAppointmentAndWorkOrderPaths(
      result.appointment.id,
      result.workOrder.id,
    );

    return { success: true, ...result };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos asociar la orden al turno. Revisá los datos ingresados.",
      ),
    };
  }
}
