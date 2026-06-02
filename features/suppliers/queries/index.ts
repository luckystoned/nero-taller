import { prisma } from "../../../apps/web/lib/prisma";

import {
  supplierIdSchema,
  supplierListQuerySchema,
  type SupplierListQueryInput,
} from "../schemas";

export async function getSupplierById(id: string) {
  const supplierId = supplierIdSchema.parse(id);

  return prisma.supplier.findUnique({
    where: { id: supplierId },
  });
}

export async function listSuppliers(input?: SupplierListQueryInput) {
  const query = supplierListQuerySchema.parse(input);
  const search = query?.search?.trim();

  return prisma.supplier.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { taxId: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: [{ name: "asc" }],
    skip: query?.skip,
    take: query?.take ?? 50,
  });
}

export async function countSuppliers(input?: SupplierListQueryInput) {
  const query = supplierListQuerySchema.parse(input);
  const search = query?.search?.trim();

  return prisma.supplier.count({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { taxId: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
  });
}
