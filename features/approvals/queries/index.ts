import { prisma } from "../../../apps/web/lib/prisma";

import {
  approvalIdSchema,
  approvalListQuerySchema,
  type ApprovalListQueryInput,
} from "../schemas";

const approvalInclude = {
  quote: true,
} as const;

export async function getApprovalById(id: string) {
  const approvalId = approvalIdSchema.parse(id);

  return prisma.approval.findUnique({
    where: { id: approvalId },
    include: approvalInclude,
  });
}

export async function getApprovalByQuoteId(quoteId: string) {
  const query = approvalListQuerySchema.parse({ quoteId });

  return prisma.approval.findUnique({
    where: { quoteId: query?.quoteId },
    include: approvalInclude,
  });
}

export async function listApprovals(input?: ApprovalListQueryInput) {
  const query = approvalListQuerySchema.parse(input);

  return prisma.approval.findMany({
    include: approvalInclude,
    where: {
      quoteId: query?.quoteId,
      status: query?.status,
    },
    orderBy: [{ requestedAt: "desc" }],
    skip: query?.skip,
    take: query?.take ?? 50,
  });
}

export async function countApprovals(input?: ApprovalListQueryInput) {
  const query = approvalListQuerySchema.parse(input);

  return prisma.approval.count({
    where: {
      quoteId: query?.quoteId,
      status: query?.status,
    },
  });
}
