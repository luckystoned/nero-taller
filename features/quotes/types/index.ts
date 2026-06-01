import type {
  Quote as PrismaQuote,
  QuoteItem as PrismaQuoteItem,
  QuoteItemType as PrismaQuoteItemType,
  QuoteStatus as PrismaQuoteStatus,
} from "../../../apps/web/generated/prisma/client";

import type {
  SerializedQuote,
  SerializedQuoteItem,
} from "../serializers";

import type {
  CreateQuoteInput,
  DeleteQuoteInput,
  QuoteItemTypeInput,
  QuoteListQueryInput,
  QuoteStatusInput,
  UpdateQuoteInput,
} from "../schemas";

export type Quote = PrismaQuote;
export type QuoteItem = PrismaQuoteItem;
export type QuoteStatus = PrismaQuoteStatus;
export type QuoteItemType = PrismaQuoteItemType;
export type QuoteId = Quote["id"];
export type QuoteItemId = QuoteItem["id"];
export type QuoteDTO = SerializedQuote;
export type QuoteItemDTO = SerializedQuoteItem;

export type {
  CreateQuoteInput,
  DeleteQuoteInput,
  QuoteItemTypeInput,
  QuoteListQueryInput,
  QuoteStatusInput,
  UpdateQuoteInput,
};
