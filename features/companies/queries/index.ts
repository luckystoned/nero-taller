import { prisma } from "../../../apps/web/lib/prisma";

import {
  companyIdSchema,
  companyListQuerySchema,
  type CompanyListQueryInput,
} from "../schemas";

export async function getCompanyById(id: string) {
  const companyId = companyIdSchema.parse(id);

  return prisma.company.findUnique({
    where: { id: companyId },
  });
}

export async function listCompanies(input?: CompanyListQueryInput) {
  const query = companyListQuerySchema.parse(input);
  const search = query?.search?.trim();

  return prisma.company.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { taxId: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: [{ name: "asc" }],
    skip: query?.skip,
    take: query?.take ?? 50,
  });
}

export async function countCompanies(input?: CompanyListQueryInput) {
  const query = companyListQuerySchema.parse(input);
  const search = query?.search?.trim();

  return prisma.company.count({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { taxId: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
  });
}
