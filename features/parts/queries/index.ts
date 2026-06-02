import { prisma } from "../../../apps/web/lib/prisma";

import {
  partIdSchema,
  partListQuerySchema,
  type PartListQueryInput,
} from "../schemas";
import { serializePart } from "../serializers";

export async function getPartById(id: string) {
  const partId = partIdSchema.parse(id);

  const part = await prisma.part.findUnique({
    where: { id: partId },
    include: {
      supplier: true,
    },
  });

  return part ? serializePart(part) : null;
}

export async function listParts(input?: PartListQueryInput) {
  const query = partListQuerySchema.parse(input);
  const search = query?.search?.trim();

  const parts = await prisma.part.findMany({
    include: {
      supplier: true,
    },
    where: {
      supplierId: query?.supplierId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { brand: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ name: "asc" }],
    skip: query?.skip,
    take: query?.take ?? 50,
  });

  return parts.map(serializePart);
}

export async function countParts(input?: PartListQueryInput) {
  const query = partListQuerySchema.parse(input);
  const search = query?.search?.trim();

  return prisma.part.count({
    where: {
      supplierId: query?.supplierId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { brand: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
  });
}
