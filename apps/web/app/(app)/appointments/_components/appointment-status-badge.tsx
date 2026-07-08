import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { AppointmentStatus } from "../../../../../../features/appointments/types";

import { appointmentStatusLabels } from "./appointment-labels";

const statusClassNames: Record<AppointmentStatus, string> = {
  REQUESTED: "border-blue-200 bg-blue-50 text-blue-700",
  CONFIRMED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CHECKED_IN: "border-cyan-200 bg-cyan-50 text-cyan-700",
  IN_PROGRESS: "border-amber-200 bg-amber-50 text-amber-800",
  WAITING_PARTS: "border-orange-200 bg-orange-50 text-orange-800",
  READY_FOR_PICKUP: "border-lime-200 bg-lime-50 text-lime-800",
  COMPLETED: "border-zinc-200 bg-zinc-50 text-zinc-700",
  CANCELLED: "border-red-200 bg-red-50 text-red-700",
  NO_SHOW: "border-purple-200 bg-purple-50 text-purple-700",
};

type AppointmentStatusBadgeProps = {
  status: AppointmentStatus;
};

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(statusClassNames[status])}>
      {appointmentStatusLabels[status]}
    </Badge>
  );
}
