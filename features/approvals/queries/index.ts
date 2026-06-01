import { prisma } from "../../../apps/web/lib/prisma";

import {
  approvalIdSchema,
  approvalListQuerySchema,
  type ApprovalListQueryInput,
} from "../schemas";
import { serializeApprovalWithQuote } from "../serializers";

const approvalInclude = {
  quote: {
    include: {
      items: {
        orderBy: {
          createdAt: "asc",
        },
      },
      workOrder: {
        include: {
          vehicle: {
            include: {
              customer: true,
              company: true,
            },
          },
        },
      },
    },
  },
} as const;

export async function getApprovalById(id: string) {
  const approvalId = approvalIdSchema.parse(id);

  const approval = await prisma.approval.findUnique({
    where: { id: approvalId },
    include: approvalInclude,
  });

  return approval ? serializeApprovalWithQuote(approval) : null;
}

export async function getApprovalByQuoteId(quoteId: string) {
  const query = approvalListQuerySchema.parse({ quoteId });

  const approval = await prisma.approval.findUnique({
    where: { quoteId: query?.quoteId },
    include: approvalInclude,
  });

  return approval ? serializeApprovalWithQuote(approval) : null;
}

export async function listApprovals(input?: ApprovalListQueryInput) {
  const query = approvalListQuerySchema.parse(input);

  const approvals = await prisma.approval.findMany({
    include: approvalInclude,
    where: {
      quoteId: query?.quoteId,
      status: query?.status,
    },
    orderBy: [{ requestedAt: "desc" }],
    skip: query?.skip,
    take: query?.take ?? 50,
  });

  return approvals.map(serializeApprovalWithQuote);
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
