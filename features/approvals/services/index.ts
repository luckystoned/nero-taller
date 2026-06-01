import { ApprovalStatus } from "../../../apps/web/generated/prisma/client";
import { prisma } from "../../../apps/web/lib/prisma";

import type { CreateApprovalInput, RespondApprovalInput } from "../schemas";

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

export async function approveApproval(input: RespondApprovalInput) {
  return prisma.approval.update({
    where: { id: input.id },
    data: {
      status: ApprovalStatus.APPROVED,
      respondedAt: new Date(),
      responseNotes: input.responseNotes,
    },
  });
}

export async function rejectApproval(input: RespondApprovalInput) {
  return prisma.approval.update({
    where: { id: input.id },
    data: {
      status: ApprovalStatus.REJECTED,
      respondedAt: new Date(),
      responseNotes: input.responseNotes,
    },
  });
}
