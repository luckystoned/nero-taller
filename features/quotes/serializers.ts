import type {
  QuoteItemType,
  QuoteStatus,
} from "../../apps/web/generated/prisma/client";

type DecimalLike = {
  toNumber?: () => number;
  toString: () => string;
};

type QuoteShape = {
  id: string;
  workOrderId: string;
  status: QuoteStatus;
  subtotal: DecimalLike;
  tax: DecimalLike;
  total: DecimalLike;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type QuoteItemShape = {
  id: string;
  quoteId: string;
  description: string;
  quantity: DecimalLike;
  unitPrice: DecimalLike;
  total: DecimalLike;
  type: QuoteItemType;
  createdAt: Date;
};

export type SerializedQuote = Omit<
  QuoteShape,
  "subtotal" | "tax" | "total"
> & {
  subtotal: number;
  tax: number;
  total: number;
};

export type SerializedQuoteItem = Omit<
  QuoteItemShape,
  "quantity" | "unitPrice" | "total"
> & {
  quantity: number;
  unitPrice: number;
  total: number;
};

function decimalToNumber(value: DecimalLike) {
  return value.toNumber?.() ?? Number(value.toString());
}

export function serializeQuoteItem<TQuoteItem extends QuoteItemShape>(
  item: TQuoteItem,
): Omit<TQuoteItem, "quantity" | "unitPrice" | "total"> &
  SerializedQuoteItem {
  return {
    ...item,
    quantity: decimalToNumber(item.quantity),
    unitPrice: decimalToNumber(item.unitPrice),
    total: decimalToNumber(item.total),
  };
}

export function serializeQuote<TQuote extends QuoteShape>(
  quote: TQuote,
): Omit<TQuote, "subtotal" | "tax" | "total"> & SerializedQuote {
  return {
    ...quote,
    subtotal: decimalToNumber(quote.subtotal),
    tax: decimalToNumber(quote.tax),
    total: decimalToNumber(quote.total),
  };
}

export function serializeQuoteWithItems<
  TQuote extends QuoteShape & { items: QuoteItemShape[] },
>(quote: TQuote): Omit<TQuote, "subtotal" | "tax" | "total" | "items"> &
  SerializedQuote & {
    items: SerializedQuoteItem[];
  } {
  const { items, ...quoteWithoutItems } = quote;

  return {
    ...serializeQuote(quoteWithoutItems),
    items: items.map(serializeQuoteItem),
  } as Omit<TQuote, "subtotal" | "tax" | "total" | "items"> &
    SerializedQuote & {
      items: SerializedQuoteItem[];
    };
}
