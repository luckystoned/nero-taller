import { prisma } from "../../../apps/web/lib/prisma";

import type {
  CreateCompanyInput,
  DeleteCompanyInput,
  UpdateCompanyInput,
} from "../schemas";

export async function createCompany(input: CreateCompanyInput) {
  return prisma.company.create({
    data: input,
  });
}

export async function updateCompany(input: UpdateCompanyInput) {
  const { id, ...data } = input;

  return prisma.company.update({
    where: { id },
    data,
  });
}

export async function deleteCompany(input: DeleteCompanyInput) {
  return prisma.company.delete({
    where: { id: input.id },
  });
}
