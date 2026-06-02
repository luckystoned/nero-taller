import { prisma } from "../../../apps/web/lib/prisma";

import type {
  CreatePartInput,
  DeletePartInput,
  UpdatePartInput,
} from "../schemas";

type PartSupplierInput = {
  supplierId?: string | null;
};

async function assertSupplierExists(input: PartSupplierInput) {
  if (!input.supplierId) {
    return;
  }

  const supplierExists = await prisma.supplier.count({
    where: { id: input.supplierId },
  });

  if (!supplierExists) {
    throw new Error("El proveedor indicado no existe.");
  }
}

export async function createPart(input: CreatePartInput) {
  await assertSupplierExists(input);

  return prisma.part.create({
    data: input,
  });
}

export async function updatePart(input: UpdatePartInput) {
  const { id, ...data } = input;

  if (Object.hasOwn(data, "supplierId")) {
    await assertSupplierExists(data);
  }

  return prisma.part.update({
    where: { id },
    data,
  });
}

export async function deletePart(input: DeletePartInput) {
  return prisma.part.delete({
    where: { id: input.id },
  });
}
