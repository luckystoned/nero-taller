import { prisma } from "../../../apps/web/lib/prisma";
import { serializeQuote } from "../../quotes/serializers";

import type {
  DashboardMetrics,
  QuotesByStatusItem,
  RecentActivity,
  WorkOrdersByStatusItem,
} from "../types";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [
    totalCustomers,
    totalCompanies,
    totalVehicles,
    totalWorkOrders,
    totalQuotes,
    totalApprovedQuotes,
    totalRejectedQuotes,
    totalSuppliers,
    totalParts,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.company.count(),
    prisma.vehicle.count(),
    prisma.workOrder.count(),
    prisma.quote.count(),
    prisma.quote.count({ where: { status: "APPROVED" } }),
    prisma.quote.count({ where: { status: "REJECTED" } }),
    prisma.supplier.count(),
    prisma.part.count(),
  ]);

  return {
    totalCustomers,
    totalCompanies,
    totalVehicles,
    totalWorkOrders,
    totalQuotes,
    totalApprovedQuotes,
    totalRejectedQuotes,
    totalSuppliers,
    totalParts,
  };
}

export async function getWorkOrdersByStatus(): Promise<
  WorkOrdersByStatusItem[]
> {
  const groupedWorkOrders = await prisma.workOrder.groupBy({
    by: ["status"],
    _count: {
      _all: true,
    },
    orderBy: {
      status: "asc",
    },
  });

  return groupedWorkOrders.map((item) => ({
    status: item.status,
    count: item._count._all,
  }));
}

export async function getQuotesByStatus(): Promise<QuotesByStatusItem[]> {
  const groupedQuotes = await prisma.quote.groupBy({
    by: ["status"],
    _count: {
      _all: true,
    },
    orderBy: {
      status: "asc",
    },
  });

  return groupedQuotes.map((item) => ({
    status: item.status,
    count: item._count._all,
  }));
}

export async function getRecentActivity(): Promise<RecentActivity> {
  const [workOrders, quotes] = await Promise.all([
    prisma.workOrder.findMany({
      include: {
        vehicle: {
          select: {
            plate: true,
            brand: true,
            model: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
    prisma.quote.findMany({
      include: {
        workOrder: {
          select: {
            id: true,
            vehicle: {
              select: {
                plate: true,
                brand: true,
                model: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
  ]);

  return {
    workOrders,
    quotes: quotes.map((quote) => serializeQuote(quote)),
  };
}
