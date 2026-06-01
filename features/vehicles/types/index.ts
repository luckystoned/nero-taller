import type { Vehicle as PrismaVehicle } from "../../../apps/web/generated/prisma/client";

import type {
  CreateVehicleInput,
  DeleteVehicleInput,
  UpdateVehicleInput,
  VehicleListQueryInput,
} from "../schemas";

export type Vehicle = PrismaVehicle;
export type VehicleId = Vehicle["id"];

export type {
  CreateVehicleInput,
  DeleteVehicleInput,
  UpdateVehicleInput,
  VehicleListQueryInput,
};
