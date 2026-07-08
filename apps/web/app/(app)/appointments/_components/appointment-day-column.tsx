import type { listAppointments } from "../../../../../../features/appointments/queries";
import type { CapacitySummary } from "../../../../../../features/appointments/types";

import { formatDateKey, formatDateTitle } from "./appointment-labels";
import { AppointmentCapacityWarning } from "./appointment-capacity-warning";
import { AppointmentCard } from "./appointment-card";

type AppointmentWithDetails = Awaited<ReturnType<typeof listAppointments>>[number];

type AppointmentDayColumnProps = {
  date: Date;
  appointments: AppointmentWithDetails[];
  capacitySummary?: CapacitySummary;
};

export function AppointmentDayColumn({
  date,
  appointments,
  capacitySummary,
}: AppointmentDayColumnProps) {
  const dateKey = formatDateKey(date);

  return (
    <section className="flex min-h-64 flex-col gap-3 rounded-lg border bg-card p-3">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold capitalize">
            {formatDateTitle(date)}
          </h2>
          <p className="text-xs text-muted-foreground">{dateKey}</p>
        </div>
        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
          {appointments.length}
        </span>
      </header>
      <AppointmentCapacityWarning summary={capacitySummary} />
      {appointments.length === 0 ? (
        <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
          Sin turnos cargados.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </section>
  );
}
