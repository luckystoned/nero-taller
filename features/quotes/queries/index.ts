import { prisma } from "../../../apps/web/lib/prisma";

import {
  quoteIdSchema,
  quoteListQuerySchema,
  type QuoteListQueryInput,
} from "../schemas";

const quoteInclude = {
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
} as const;

export async function getQuoteById(id: string) {
  const quoteId = quoteIdSchema.parse(id);

  return prisma.quote.findUnique({
    where: { id: quoteId },
    include: quoteInclude,
  });
}

export async function listQuotes(input?: QuoteListQueryInput) {
  const query = quoteListQuerySchema.parse(input);

  return prisma.quote.findMany({
    include: quoteInclude,
    where: {
      workOrderId: query?.workOrderId,
      status: query?.status,
    },
    orderBy: [{ createdAt: "desc" }],
    skip: query?.skip,
    take: query?.take ?? 50,
  });
}

export async function countQuotes(input?: QuoteListQueryInput) {
  const query = quoteListQuerySchema.parse(input);

  return prisma.quote.count({
    where: {
      workOrderId: query?.workOrderId,
      status: query?.status,
    },
  });
}
