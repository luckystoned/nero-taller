import { AlertTriangle } from "lucide-react";

import type { CapacitySummary } from "../../../../../../features/appointments/types";

type AppointmentCapacityWarningProps = {
  summary?: CapacitySummary;
};

export function AppointmentCapacityWarning({
  summary,
}: AppointmentCapacityWarningProps) {
  if (
    !summary ||
    (!summary.isOverAppointmentCapacity && !summary.isOverVehicleCapacity)
  ) {
    return null;
  }

  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
      <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <p>
        Día sobrecargado: {summary.appointmentCount}/
        {summary.maxAppointmentsPerDay} turnos y {summary.vehicleCount}/
        {summary.maxVehiclesPerDay} vehículos.
      </p>
    </div>
  );
}
