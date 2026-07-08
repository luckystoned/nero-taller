import type {
  AppointmentPriority,
  AppointmentReminderStatus,
  AppointmentStatus,
} from "../../../../../../features/appointments/types";

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  REQUESTED: "Solicitado",
  CONFIRMED: "Confirmado",
  CHECKED_IN: "Ingresado",
  IN_PROGRESS: "En reparación",
  WAITING_PARTS: "Esperando repuestos",
  READY_FOR_PICKUP: "Listo para retirar",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
  NO_SHOW: "No asistió",
};

export const appointmentPriorityLabels: Record<AppointmentPriority, string> = {
  LOW: "Baja",
  NORMAL: "Normal",
  HIGH: "Alta",
  URGENT: "Urgente",
};

export const appointmentReminderStatusLabels: Record<
  AppointmentReminderStatus,
  string
> = {
  NOT_SCHEDULED: "Sin recordatorio",
  SCHEDULED: "Programado",
  SENT: "Enviado",
  FAILED: "Falló",
  CANCELLED: "Cancelado",
};

export const appointmentViewLabels = {
  day: "Día",
  week: "Semana",
  month: "Mes",
} as const;

export function formatAppointmentOwner(input: {
  customer?: { firstName: string; lastName: string } | null;
  company?: { name: string } | null;
}) {
  if (input.customer) {
    return `${input.customer.lastName}, ${input.customer.firstName}`;
  }

  if (input.company) {
    return input.company.name;
  }

  return "Sin propietario";
}

export function formatAppointmentDateTime(value: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function formatAppointmentTime(value: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export function formatDateKey(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

export function formatDateTitle(value: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(value);
}

export function toDateInputValue(value: Date) {
  return formatDateKey(value);
}

export function toDateTimeInputValue(value: Date) {
  const timezoneOffset = value.getTimezoneOffset();
  const localValue = new Date(value.getTime() - timezoneOffset * 60000);

  return localValue.toISOString().slice(0, 16);
}
