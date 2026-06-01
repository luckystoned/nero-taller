import type {
  WorkOrder as PrismaWorkOrder,
  WorkOrderStatus as PrismaWorkOrderStatus,
  WorkOrderStatusHistory as PrismaWorkOrderStatusHistory,
} from "../../../apps/web/generated/prisma/client";

import type {
  ChangeWorkOrderStatusInput,
  CreateWorkOrderInput,
  DeleteWorkOrderInput,
  UpdateWorkOrderInput,
  WorkOrderListQueryInput,
  WorkOrderStatusInput,
} from "../schemas";

export type WorkOrder = PrismaWorkOrder;
export type WorkOrderStatus = PrismaWorkOrderStatus;
export type WorkOrderStatusHistory = PrismaWorkOrderStatusHistory;
export type WorkOrderId = WorkOrder["id"];
export type WorkOrderStatusHistoryId = WorkOrderStatusHistory["id"];

export type {
  ChangeWorkOrderStatusInput,
  CreateWorkOrderInput,
  DeleteWorkOrderInput,
  UpdateWorkOrderInput,
  WorkOrderListQueryInput,
  WorkOrderStatusInput,
};
