import type {
  PublicVehicleHistory as PrismaPublicVehicleHistory,
  WorkOrderStatus as PrismaWorkOrderStatus,
} from "../../../apps/web/generated/prisma/client";

import type {
  CreatePublicVehicleHistoryInput,
  PublicVehicleHistoryListQueryInput,
  UpdatePublicVehicleHistoryStatusInput,
} from "../schemas";

export type PublicVehicleHistory = PrismaPublicVehicleHistory;
export type PublicVehicleHistoryId = PublicVehicleHistory["id"];

export type PublicVehicleHistoryVehicleSummary = {
  plate: string;
  brand: string;
  model: string;
  year: number | null;
};

export type PublicVehicleHistoryWorkOrderSummary = {
  id: string;
  status: PrismaWorkOrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicVehicleHistoryDTO = PublicVehicleHistory & {
  vehicle: PublicVehicleHistoryVehicleSummary;
};

export type PublicVehicleHistorySafeDTO = {
  id: string;
  publicToken: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  vehicle: PublicVehicleHistoryVehicleSummary;
  workOrders: PublicVehicleHistoryWorkOrderSummary[];
};

export type {
  CreatePublicVehicleHistoryInput,
  PublicVehicleHistoryListQueryInput,
  UpdatePublicVehicleHistoryStatusInput,
};
