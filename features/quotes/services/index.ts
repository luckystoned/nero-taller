import { QuoteStatus } from "../../../apps/web/generated/prisma/client";
import { prisma } from "../../../apps/web/lib/prisma";

import type {
  CreateQuoteInput,
  DeleteQuoteInput,
  UpdateQuoteInput,
} from "../schemas";

type QuoteItemInput = CreateQuoteInput["items"][number];

function toMoney(value: number) {
  return value.toFixed(2);
}

function calculateItemTotal(item: QuoteItemInput) {
  return item.quantity * item.unitPrice;
}

function calculateTotals(items: QuoteItemInput[]) {
  const subtotal = items.reduce(
    (total, item) => total + calculateItemTotal(item),
    0,
  );
  const tax = 0;

  return {
    subtotal,
    tax,
    total: subtotal + tax,
  };
}

function buildQuoteItemData(items: QuoteItemInput[]) {
  return items.map((item) => ({
    description: item.description,
    quantity: toMoney(item.quantity),
    unitPrice: toMoney(item.unitPrice),
    total: toMoney(calculateItemTotal(item)),
    type: item.type,
  }));
}

async function assertWorkOrderExists(workOrderId: string) {
  const workOrderExists = await prisma.workOrder.count({
    where: { id: workOrderId },
  });

  if (!workOrderExists) {
    throw new Error("La orden de trabajo indicada no existe.");
  }
}

export async function createQuote(input: CreateQuoteInput) {
  await assertWorkOrderExists(input.workOrderId);

  const totals = calculateTotals(input.items);

  return prisma.quote.create({
    data: {
      workOrderId: input.workOrderId,
      status: QuoteStatus.DRAFT,
      subtotal: toMoney(totals.subtotal),
      tax: toMoney(totals.tax),
      total: toMoney(totals.total),
      notes: input.notes,
      items: {
        create: buildQuoteItemData(input.items),
      },
    },
  });
}

export async function updateQuote(input: UpdateQuoteInput) {
  const { id, items, ...data } = input;

  const currentQuote = await prisma.quote.findUnique({
    where: { id },
  });

  if (!currentQuote) {
    throw new Error("El presupuesto indicado no existe.");
  }

  if (!items) {
    return prisma.quote.update({
      where: { id },
      data,
    });
  }

  const totals = calculateTotals(items);

  return prisma.$transaction(async (transaction) => {
    await transaction.quoteItem.deleteMany({
      where: { quoteId: id },
    });

    return transaction.quote.update({
      where: { id },
      data: {
        ...data,
        subtotal: toMoney(totals.subtotal),
        tax: toMoney(totals.tax),
        total: toMoney(totals.total),
        items: {
          create: buildQuoteItemData(items),
        },
      },
    });
  });
}

export async function deleteQuote(input: DeleteQuoteInput) {
  return prisma.quote.delete({
    where: { id: input.id },
  });
}
