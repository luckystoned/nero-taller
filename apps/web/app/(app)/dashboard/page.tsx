import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const placeholderMetrics = [
  "Ordenes de trabajo",
  "Historial vehicular",
  "Presupuestos",
  "Aprobaciones",
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <Badge variant="secondary">Espacio reservado protegido</Badge>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            Ruta base para el espacio interno del taller.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Esta pagina es intencionalmente estatica hasta incorporar control de
            acceso real, base de datos y servicios de dominio.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {placeholderMetrics.map((label) => (
          <Card key={label} size="sm">
            <CardHeader>
              <CardTitle>{label}</CardTitle>
              <CardDescription>Implementacion pendiente</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
