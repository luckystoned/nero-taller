import type { Supplier as PrismaSupplier } from "../../../apps/web/generated/prisma/client";

import type {
  CreateSupplierInput,
  DeleteSupplierInput,
  SupplierListQueryInput,
  UpdateSupplierInput,
} from "../schemas";

export type Supplier = PrismaSupplier;
export type SupplierId = Supplier["id"];

export type {
  CreateSupplierInput,
  DeleteSupplierInput,
  SupplierListQueryInput,
  UpdateSupplierInput,
};
