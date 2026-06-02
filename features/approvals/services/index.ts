import {
  ApprovalStatus,
  QuoteStatus,
  WorkOrderStatus,
} from "../../../apps/web/generated/prisma/client";
import { prisma } from "../../../apps/web/lib/prisma";

import type { CreateApprovalInput, RespondApprovalInput } from "../schemas";

type ApprovalWorkflowTarget = {
  approvalStatus: typeof ApprovalStatus.APPROVED | typeof ApprovalStatus.REJECTED;
  quoteStatus: typeof QuoteStatus.APPROVED | typeof QuoteStatus.REJECTED;
  workOrderStatus:
    | typeof WorkOrderStatus.APPROVED
    | typeof WorkOrderStatus.QUOTE_PENDING;
};

async function assertQuoteExists(quoteId: string) {
  const quoteExists = await prisma.quote.count({
    where: { id: quoteId },
  });

  if (!quoteExists) {
    throw new Error("El presupuesto indicado no existe.");
  }
}

async function assertApprovalDoesNotExist(quoteId: string) {
  const approvalExists = await prisma.approval.count({
    where: { quoteId },
  });

  if (approvalExists) {
    throw new Error("El presupuesto ya tiene una aprobación asociada.");
  }
}

export async function createApproval(input: CreateApprovalInput) {
  await assertQuoteExists(input.quoteId);
  await assertApprovalDoesNotExist(input.quoteId);

  return prisma.approval.create({
    data: {
      quoteId: input.quoteId,
      status: ApprovalStatus.PENDING,
    },
  });
}

async function respondApproval(
  input: RespondApprovalInput,
  target: ApprovalWorkflowTarget,
) {
  return prisma.$transaction(async (transaction) => {
    const currentApproval = await transaction.approval.findUnique({
      where: { id: input.id },
      include: {
        quote: {
          include: {
            workOrder: true,
          },
        },
      },
    });

    if (!currentApproval) {
      throw new Error("La aprobación indicada no existe.");
    }

    if (currentApproval.status !== ApprovalStatus.PENDING) {
      throw new Error("La aprobación ya fue respondida.");
    }

    const respondedAt = new Date();
    const approvalUpdate = await transaction.approval.updateMany({
      where: {
        id: input.id,
        status: ApprovalStatus.PENDING,
      },
      data: {
        status: target.approvalStatus,
        respondedAt,
        responseNotes: input.responseNotes,
      },
    });

    if (approvalUpdate.count === 0) {
      throw new Error("La aprobación ya fue respondida.");
    }

    const approval = await transaction.approval.findUniqueOrThrow({
      where: { id: input.id },
    });

    await transaction.quote.update({
      where: { id: currentApproval.quoteId },
      data: {
        status: target.quoteStatus,
      },
    });

    const previousWorkOrderStatus = currentApproval.quote.workOrder.status;

    if (previousWorkOrderStatus !== target.workOrderStatus) {
      await transaction.workOrder.update({
        where: { id: currentApproval.quote.workOrderId },
        data: {
          status: target.workOrderStatus,
        },
      });

      await transaction.workOrderStatusHistory.create({
        data: {
          workOrderId: currentApproval.quote.workOrderId,
          fromStatus: previousWorkOrderStatus,
          toStatus: target.workOrderStatus,
        },
      });
    }

    return approval;
  });
}

export async function approveApproval(input: RespondApprovalInput) {
  return respondApproval(input, {
    approvalStatus: ApprovalStatus.APPROVED,
    quoteStatus: QuoteStatus.APPROVED,
    workOrderStatus: WorkOrderStatus.APPROVED,
  });
}

export async function rejectApproval(input: RespondApprovalInput) {
  return respondApproval(input, {
    approvalStatus: ApprovalStatus.REJECTED,
    quoteStatus: QuoteStatus.REJECTED,
    workOrderStatus: WorkOrderStatus.QUOTE_PENDING,
  });
}
