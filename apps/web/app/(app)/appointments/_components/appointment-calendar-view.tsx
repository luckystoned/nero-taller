import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { listAppointments } from "../../../../../../features/appointments/queries";
import type {
  AppointmentCalendarViewInput,
  CapacitySummary,
} from "../../../../../../features/appointments/types";

import {
  formatDateKey,
  formatDateTitle,
  toDateInputValue,
} from "./appointment-labels";
import { AppointmentDayColumn } from "./appointment-day-column";

type AppointmentWithDetails = Awaited<ReturnType<typeof listAppointments>>[number];

type AppointmentCalendarViewProps = {
  view: AppointmentCalendarViewInput;
  dates: Date[];
  appointments: AppointmentWithDetails[];
  capacitySummaries: CapacitySummary[];
};

function groupAppointmentsByDate(appointments: AppointmentWithDetails[]) {
  const grouped = new Map<string, AppointmentWithDetails[]>();

  appointments.forEach((appointment) => {
    const dateKey = formatDateKey(appointment.scheduledStartAt);
    const current = grouped.get(dateKey) ?? [];

    current.push(appointment);
    grouped.set(dateKey, current);
  });

  return grouped;
}

function groupCapacityByDate(capacitySummaries: CapacitySummary[]) {
  return new Map(
    capacitySummaries.map((summary) => [summary.dateKey, summary] as const),
  );
}

export function AppointmentCalendarView({
  view,
  dates,
  appointments,
  capacitySummaries,
}: AppointmentCalendarViewProps) {
  const appointmentsByDate = groupAppointmentsByDate(appointments);
  const capacityByDate = groupCapacityByDate(capacitySummaries);

  if (view === "month") {
    return (
      <Card>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
            {dates.map((date) => {
              const dateKey = formatDateKey(date);
              const dayAppointments = appointmentsByDate.get(dateKey) ?? [];
              const capacity = capacityByDate.get(dateKey);
              const overloaded =
                capacity?.isOverAppointmentCapacity ||
                capacity?.isOverVehicleCapacity;

              return (
                <Link
                  key={dateKey}
                  href={`/appointments?view=day&date=${toDateInputValue(date)}`}
                  className={cn(
                    "flex min-h-28 flex-col justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted",
                    overloaded && "border-amber-300 bg-amber-50",
                  )}
                >
                  <span className="font-medium capitalize">
                    {formatDateTitle(date)}
                  </span>
                  <span className="text-muted-foreground">
                    {dayAppointments.length} turnos
                  </span>
                  {overloaded ? (
                    <span className="text-xs font-medium text-amber-900">
                      Sobrecargado
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-3",
        view === "day" ? "grid-cols-1" : "lg:grid-cols-7",
      )}
    >
      {dates.map((date) => {
        const dateKey = formatDateKey(date);

        return (
          <AppointmentDayColumn
            key={dateKey}
            date={date}
            appointments={appointmentsByDate.get(dateKey) ?? []}
            capacitySummary={capacityByDate.get(dateKey)}
          />
        );
      })}
    </div>
  );
}
