import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { listCompanies } from "../../../../../../features/companies/queries";
import type { listCustomers } from "../../../../../../features/customers/queries";
import type { listVehicles } from "../../../../../../features/vehicles/queries";

import {
  appointmentStatusLabels,
  appointmentViewLabels,
} from "./appointment-labels";

type CustomerOption = Awaited<ReturnType<typeof listCustomers>>[number];
type CompanyOption = Awaited<ReturnType<typeof listCompanies>>[number];
type VehicleOption = Awaited<ReturnType<typeof listVehicles>>[number];

type AppointmentFiltersProps = {
  view: string;
  date: string;
  status?: string;
  serviceType?: string;
  customerId?: string;
  companyId?: string;
  vehicleId?: string;
  customers: CustomerOption[];
  companies: CompanyOption[];
  vehicles: VehicleOption[];
};

export function AppointmentFilters({
  view,
  date,
  status,
  serviceType,
  customerId,
  companyId,
  vehicleId,
  customers,
  companies,
  vehicles,
}: AppointmentFiltersProps) {
  return (
    <Card>
      <CardContent>
        <form className="grid gap-3 md:grid-cols-4 lg:grid-cols-7">
          <div className="flex flex-col gap-2">
            <label htmlFor="view" className="text-sm font-medium">
              Vista
            </label>
            <select
              id="view"
              name="view"
              defaultValue={view}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {Object.entries(appointmentViewLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="text-sm font-medium">
              Fecha
            </label>
            <input
              id="date"
              name="date"
              type="date"
              defaultValue={date}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="text-sm font-medium">
              Estado
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status ?? ""}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="">Todos</option>
              {Object.entries(appointmentStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="serviceType" className="text-sm font-medium">
              Servicio
            </label>
            <input
              id="serviceType"
              name="serviceType"
              defaultValue={serviceType ?? ""}
              placeholder="Mantenimiento"
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="customerId" className="text-sm font-medium">
              Cliente
            </label>
            <select
              id="customerId"
              name="customerId"
              defaultValue={customerId ?? ""}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="">Todos</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.lastName}, {customer.firstName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="companyId" className="text-sm font-medium">
              Empresa
            </label>
            <select
              id="companyId"
              name="companyId"
              defaultValue={companyId ?? ""}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="">Todas</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="vehicleId" className="text-sm font-medium">
              Vehículo
            </label>
            <select
              id="vehicleId"
              name="vehicleId"
              defaultValue={vehicleId ?? ""}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="">Todos</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plate}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end md:col-span-4 lg:col-span-7">
            <Button type="submit" variant="outline">
              <Filter data-icon="inline-start" aria-hidden="true" />
              Aplicar filtros
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
