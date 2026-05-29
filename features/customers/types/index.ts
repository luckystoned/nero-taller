import type { Customer as PrismaCustomer } from "../../../apps/web/generated/prisma/client";

import type {
  CreateCustomerInput,
  CustomerListQueryInput,
  DeleteCustomerInput,
  UpdateCustomerInput,
} from "../schemas";

export type Customer = PrismaCustomer;
export type CustomerId = Customer["id"];

export type {
  CreateCustomerInput,
  CustomerListQueryInput,
  DeleteCustomerInput,
  UpdateCustomerInput,
};
