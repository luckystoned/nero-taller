import type { Part as PrismaPart } from "../../../apps/web/generated/prisma/client";

import type {
  CreatePartInput,
  DeletePartInput,
  PartListQueryInput,
  UpdatePartInput,
} from "../schemas";
import type { SerializedPart } from "../serializers";

export type Part = PrismaPart;
export type PartId = Part["id"];
export type PartDTO = SerializedPart;

export type {
  CreatePartInput,
  DeletePartInput,
  PartListQueryInput,
  UpdatePartInput,
};
