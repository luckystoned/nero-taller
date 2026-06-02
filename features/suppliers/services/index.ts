import { prisma } from "../../../apps/web/lib/prisma";

import type {
  CreateSupplierInput,
  DeleteSupplierInput,
  UpdateSupplierInput,
} from "../schemas";

export async function createSupplier(input: CreateSupplierInput) {
  return prisma.supplier.create({
    data: input,
  });
}

export async function updateSupplier(input: UpdateSupplierInput) {
  const { id, ...data } = input;

  return prisma.supplier.update({
    where: { id },
    data,
  });
}

export async function deleteSupplier(input: DeleteSupplierInput) {
  return prisma.supplier.delete({
    where: { id: input.id },
  });
}
