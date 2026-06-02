"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import { createApprovalSchema, respondApprovalSchema } from "../schemas";
import { serializeApproval } from "../serializers";
import {
  approveApproval,
  createApproval,
  rejectApproval,
} from "../services";
import type { ApprovalDTO } from "../types";

type ApprovalActionError = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

type ApprovalActionResult =
  | {
      success: true;
      approval: ApprovalDTO;
    }
  | {
      success: false;
      message: string;
      errors?: ApprovalActionError;
    };

function formatValidationError(error: ZodError): ApprovalActionError {
  return error.flatten();
}

function formatServiceError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export async function createApprovalAction(
  input: unknown,
): Promise<ApprovalActionResult> {
  const parsed = createApprovalSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos crear la aprobación. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const approval = await createApproval(parsed.data);
    revalidatePath("/approvals");
    revalidatePath(`/quotes/${approval.quoteId}`);

    return { success: true, approval: serializeApproval(approval) };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos crear la aprobación. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function approveApprovalAction(
  input: unknown,
): Promise<ApprovalActionResult> {
  const parsed = respondApprovalSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos aprobar la solicitud. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const approval = await approveApproval(parsed.data);
    revalidatePath("/approvals");
    revalidatePath(`/approvals/${approval.id}`);
    revalidatePath("/quotes");
    revalidatePath(`/quotes/${approval.quoteId}`);
    revalidatePath("/work-orders");

    return { success: true, approval: serializeApproval(approval) };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos aprobar la solicitud. Revisá los datos ingresados.",
      ),
    };
  }
}

export async function rejectApprovalAction(
  input: unknown,
): Promise<ApprovalActionResult> {
  const parsed = respondApprovalSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pudimos rechazar la solicitud. Revisá los datos ingresados.",
      errors: formatValidationError(parsed.error),
    };
  }

  try {
    const approval = await rejectApproval(parsed.data);
    revalidatePath("/approvals");
    revalidatePath(`/approvals/${approval.id}`);
    revalidatePath("/quotes");
    revalidatePath(`/quotes/${approval.quoteId}`);
    revalidatePath("/work-orders");

    return { success: true, approval: serializeApproval(approval) };
  } catch (error) {
    return {
      success: false,
      message: formatServiceError(
        error,
        "No pudimos rechazar la solicitud. Revisá los datos ingresados.",
      ),
    };
  }
}
