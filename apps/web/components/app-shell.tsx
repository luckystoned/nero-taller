import Link from "next/link";
import {
  Bot,
  Building2,
  CalendarDays,
  Car,
  ClipboardCheck,
  FileText,
  Gauge,
  Package,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

import { logoutAction } from "@/app/login/actions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/dashboard", label: "Panel", icon: Gauge },
  { href: "/appointments", label: "Turnos", icon: CalendarDays },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/companies", label: "Empresas", icon: Building2 },
  { href: "/vehicles", label: "Vehículos", icon: Car },
  { href: "/work-orders", label: "Órdenes de trabajo", icon: Wrench },
  { href: "/quotes", label: "Presupuestos", icon: FileText },
  { href: "/approvals", label: "Aprobaciones", icon: ClipboardCheck },
  { href: "/parts", label: "Repuestos", icon: Package },
  { href: "/suppliers", label: "Proveedores", icon: Truck },
  { href: "/ai-assistant", label: "Asistente IA", icon: Bot },
];

type AppShellProps = {
  children: React.ReactNode;
  userEmail?: string;
};

export function AppShell({ children, userEmail }: AppShellProps) {
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
            <Badge variant="secondary">Sesión activa</Badge>
            <p className="mt-2 break-words text-sm font-medium">
              {userEmail ?? "Usuario autenticado"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Acceso interno protegido con Supabase Auth.
            </p>
            <form action={logoutAction} className="mt-3">
              <button
                type="submit"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "w-full",
                )}
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b bg-background/95">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
            <div>
              <p className="text-sm font-medium">Operación del taller</p>
              <p className="text-xs text-muted-foreground">
                Navegación de espacios reservados para los módulos del MVP.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:hidden">
              <nav className="flex gap-2 overflow-x-auto">
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
              <form action={logoutAction}>
                <button
                  type="submit"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "w-full justify-start",
                  )}
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export { navigationItems };
