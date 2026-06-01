import type {
  ApprovalStatus,
  QuoteItemType,
  QuoteStatus,
} from "../../apps/web/generated/prisma/client";
import type {
  SerializedQuote,
  SerializedQuoteItem,
} from "../quotes/serializers";
import { serializeQuoteWithItems } from "../quotes/serializers";

type ApprovalShape = {
  id: string;
  quoteId: string;
  status: ApprovalStatus;
  requestedAt: Date;
  respondedAt: Date | null;
  responseNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type QuoteWithItemsShape = {
  id: string;
  workOrderId: string;
  status: QuoteStatus;
  subtotal: {
    toNumber?: () => number;
    toString: () => string;
  };
  tax: {
    toNumber?: () => number;
    toString: () => string;
  };
  total: {
    toNumber?: () => number;
    toString: () => string;
  };
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    quoteId: string;
    description: string;
    quantity: {
      toNumber?: () => number;
      toString: () => string;
    };
    unitPrice: {
      toNumber?: () => number;
      toString: () => string;
    };
    total: {
      toNumber?: () => number;
      toString: () => string;
    };
    type: QuoteItemType;
    createdAt: Date;
  }[];
};

type SerializedQuoteWithItems<TQuote extends QuoteWithItemsShape> = Omit<
  TQuote,
  "subtotal" | "tax" | "total" | "items"
> &
  SerializedQuote & {
    items: SerializedQuoteItem[];
  };

export type SerializedApproval = ApprovalShape;

export type SerializedApprovalWithQuote = SerializedApproval & {
  quote: SerializedQuote & {
    items: SerializedQuoteItem[];
  };
};

export function serializeApproval<TApproval extends ApprovalShape>(
  approval: TApproval,
): TApproval {
  return approval;
}

export function serializeApprovalWithQuote<
  TApproval extends ApprovalShape & { quote: QuoteWithItemsShape },
>(
  approval: TApproval,
): Omit<TApproval, "quote"> & {
  quote: SerializedQuoteWithItems<TApproval["quote"]>;
} {
  const { quote, ...approvalWithoutQuote } = approval;

  return {
    ...serializeApproval(approvalWithoutQuote),
    quote: serializeQuoteWithItems(quote),
  } as Omit<TApproval, "quote"> & {
    quote: SerializedQuoteWithItems<TApproval["quote"]>;
  };
}
