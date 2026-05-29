import { prisma } from "../../../apps/web/lib/prisma";

import type {
  CreateCustomerInput,
  DeleteCustomerInput,
  UpdateCustomerInput,
} from "../schemas";

export async function createCustomer(input: CreateCustomerInput) {
  return prisma.customer.create({
    data: input,
  });
}

export async function updateCustomer(input: UpdateCustomerInput) {
  const { id, ...data } = input;

  return prisma.customer.update({
    where: { id },
    data,
  });
}

export async function deleteCustomer(input: DeleteCustomerInput) {
  return prisma.customer.delete({
    where: { id: input.id },
  });
}
