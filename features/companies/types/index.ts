import type { Company as PrismaCompany } from "../../../apps/web/generated/prisma/client";

import type {
  CompanyListQueryInput,
  CreateCompanyInput,
  DeleteCompanyInput,
  UpdateCompanyInput,
} from "../schemas";

export type Company = PrismaCompany;
export type CompanyId = Company["id"];

export type {
  CompanyListQueryInput,
  CreateCompanyInput,
  DeleteCompanyInput,
  UpdateCompanyInput,
};
