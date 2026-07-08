import { CalendarDays, Plus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  getCapacitySummary,
  listAppointments,
} from "../../../../../features/appointments/queries";
import {
  appointmentCalendarViewSchema,
  appointmentStatuses,
} from "../../../../../features/appointments/schemas";
import type { AppointmentCalendarViewInput } from "../../../../../features/appointments/types";
import type { AppointmentStatusInput } from "../../../../../features/appointments/schemas";
import { listCompanies } from "../../../../../features/companies/queries";
import { listCustomers } from "../../../../../features/customers/queries";
import { listVehicles } from "../../../../../features/vehicles/queries";

import { AppointmentCalendarView } from "./_components/appointment-calendar-view";
import { AppointmentFilters } from "./_components/appointment-filters";
import { toDateInputValue } from "./_components/appointment-labels";

type AppointmentsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];

  return Array.isArray(value) ? value[0] : value;
}

function parseDateParam(value: string | undefined) {
  if (!value) {
    return new Date();
  }

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function startOfWeek(date: Date) {
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  return addDays(startOfDay(date), mondayOffset);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getCalendarRange(view: AppointmentCalendarViewInput, date: Date) {
  if (view === "day") {
    const rangeStart = startOfDay(date);
    return {
      rangeStart,
      rangeEnd: addDays(rangeStart, 1),
      dates: [rangeStart],
    };
  }

  if (view === "month") {
    const rangeStart = startOfMonth(date);
    const rangeEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const dates = [];

    for (
      let current = rangeStart;
      current < rangeEnd;
      current = addDays(current, 1)
    ) {
      dates.push(current);
    }

    return { rangeStart, rangeEnd, dates };
  }

  const rangeStart = startOfWeek(date);
  const rangeEnd = addDays(rangeStart, 7);

  return {
    rangeStart,
    rangeEnd,
    dates: Array.from({ length: 7 }, (_, index) => addDays(rangeStart, index)),
  };
}

function parseStatus(value: string | undefined): AppointmentStatusInput | undefined {
  if (!value) {
    return undefined;
  }

  return appointmentStatuses.some((status) => status === value)
    ? (value as AppointmentStatusInput)
    : undefined;
}

export default async function AppointmentsPage({
  searchParams,
}: AppointmentsPageProps) {
  const params = await searchParams;
  const view = appointmentCalendarViewSchema.parse(getSearchParam(params, "view"));
  const selectedDate = parseDateParam(getSearchParam(params, "date"));
  const { rangeStart, rangeEnd, dates } = getCalendarRange(view, selectedDate);
  const status = parseStatus(getSearchParam(params, "status"));
  const serviceType = getSearchParam(params, "serviceType") || undefined;
  const customerId = getSearchParam(params, "customerId") || undefined;
  const companyId = getSearchParam(params, "companyId") || undefined;
  const vehicleId = getSearchParam(params, "vehicleId") || undefined;

  const calendarQuery = {
    rangeStart,
    rangeEnd,
    status,
    serviceType,
    customerId,
    companyId,
    vehicleId,
  };

  const [appointments, capacitySummaries, customers, companies, vehicles] =
    await Promise.all([
      listAppointments(calendarQuery),
      getCapacitySummary(calendarQuery),
      listCustomers(),
      listCompanies(),
      listVehicles(),
    ]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <Badge variant="secondary">Agenda</Badge>
          <CardTitle>Calendario de turnos</CardTitle>
          <CardDescription>
            Organización diaria, semanal y mensual de ingresos al taller.
          </CardDescription>
          <CardAction>
            <Link
              href={`/appointments/new?date=${toDateInputValue(selectedDate)}`}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <Plus data-icon="inline-start" aria-hidden="true" />
              Nuevo turno
            </Link>
          </CardAction>
        </CardHeader>
      </Card>

      <AppointmentFilters
        view={view}
        date={toDateInputValue(selectedDate)}
        status={status}
        serviceType={serviceType}
        customerId={customerId}
        companyId={companyId}
        vehicleId={vehicleId}
        customers={customers}
        companies={companies}
        vehicles={vehicles}
      />

      {appointments.length === 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
                <CalendarDays aria-hidden="true" />
              </div>
              <div>
                <CardTitle>No hay turnos en este rango</CardTitle>
                <CardDescription>
                  Carga un turno para empezar a organizar la capacidad futura.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      ) : null}

      <AppointmentCalendarView
        view={view}
        dates={dates}
        appointments={appointments}
        capacitySummaries={capacitySummaries}
      />
    </div>
  );
}
