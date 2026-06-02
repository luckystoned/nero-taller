import type {
  QuoteStatus,
  WorkOrderStatus,
} from "../../../apps/web/generated/prisma/client";

export type DashboardMetrics = {
  totalCustomers: number;
  totalCompanies: number;
  totalVehicles: number;
  totalWorkOrders: number;
  totalQuotes: number;
  totalApprovedQuotes: number;
  totalRejectedQuotes: number;
  totalSuppliers: number;
  totalParts: number;
};

export type WorkOrdersByStatusItem = {
  status: WorkOrderStatus;
  count: number;
};

export type QuotesByStatusItem = {
  status: QuoteStatus;
  count: number;
};

export type RecentWorkOrder = {
  id: string;
  status: WorkOrderStatus;
  intakeReason: string;
  createdAt: Date;
  vehicle: {
    plate: string;
    brand: string;
    model: string;
  };
};

export type RecentQuote = {
  id: string;
  status: QuoteStatus;
  total: number;
  createdAt: Date;
  workOrder: {
    id: string;
    vehicle: {
      plate: string;
      brand: string;
      model: string;
    };
  };
};

export type RecentActivity = {
  workOrders: RecentWorkOrder[];
  quotes: RecentQuote[];
};
