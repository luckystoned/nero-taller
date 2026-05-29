import { prisma } from "../../../apps/web/lib/prisma";

import {
  customerIdSchema,
  customerListQuerySchema,
  type CustomerListQueryInput,
} from "../schemas";

export async function getCustomerById(id: string) {
  const customerId = customerIdSchema.parse(id);

  return prisma.customer.findUnique({
    where: { id: customerId },
  });
}

export async function listCustomers(input?: CustomerListQueryInput) {
  const query = customerListQuerySchema.parse(input);
  const search = query?.search?.trim();

  return prisma.customer.findMany({
    where: search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { documentId: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    skip: query?.skip,
    take: query?.take ?? 50,
  });
}

export async function countCustomers(input?: CustomerListQueryInput) {
  const query = customerListQuerySchema.parse(input);
  const search = query?.search?.trim();

  return prisma.customer.count({
    where: search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { documentId: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
  });
}
