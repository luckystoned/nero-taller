import Link from "next/link";
import {
  Bot,
  Building2,
  Car,
  ClipboardCheck,
  FileText,
  Gauge,
  Package,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/companies", label: "Empresas", icon: Building2 },
  { href: "/vehicles", label: "Vehiculos", icon: Car },
  { href: "/work-orders", label: "Ordenes de trabajo", icon: Wrench },
  { href: "/quotes", label: "Presupuestos", icon: FileText },
  { href: "/approvals", label: "Aprobaciones", icon: ClipboardCheck },
  { href: "/parts", label: "Repuestos", icon: Package },
  { href: "/suppliers", label: "Proveedores", icon: Truck },
  { href: "/ai-assistant", label: "Asistente IA", icon: Bot },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center px-5">
          <Link href="/dashboard" className="flex flex-col">
            <span className="text-base font-semibold">Nero Taller</span>
            <span className="text-xs text-muted-foreground">
              CRM automotriz
            </span>
          </Link>
        </div>
        <Separator />
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "justify-start",
                )}
              >
                <Icon aria-hidden="true" data-icon="inline-start" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <div className="rounded-lg border bg-background p-3">
            <Badge variant="secondary">Fundacion</Badge>
            <p className="mt-2 text-sm font-medium">Base protegida de la app</p>
            <p className="mt-1 text-xs text-muted-foreground">
              La autenticacion real se agregara en una fase posterior.
            </p>
          </div>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b bg-background/95">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
            <div>
              <p className="text-sm font-medium">Operacion del taller</p>
              <p className="text-xs text-muted-foreground">
                Navegacion de espacios reservados para los modulos del MVP.
              </p>
            </div>
            <nav className="flex gap-2 overflow-x-auto md:hidden">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "shrink-0",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export { navigationItems };
