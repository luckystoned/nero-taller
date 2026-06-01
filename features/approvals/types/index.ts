import type {
  Approval as PrismaApproval,
  ApprovalStatus as PrismaApprovalStatus,
} from "../../../apps/web/generated/prisma/client";

import type {
  SerializedApproval,
  SerializedApprovalWithQuote,
} from "../serializers";
import type {
  ApprovalListQueryInput,
  ApprovalStatusInput,
  CreateApprovalInput,
  RespondApprovalInput,
} from "../schemas";

export type Approval = PrismaApproval;
export type ApprovalStatus = PrismaApprovalStatus;
export type ApprovalId = Approval["id"];
export type ApprovalDTO = SerializedApproval;
export type ApprovalWithQuoteDTO = SerializedApprovalWithQuote;

export type {
  ApprovalListQueryInput,
  ApprovalStatusInput,
  CreateApprovalInput,
  RespondApprovalInput,
};
