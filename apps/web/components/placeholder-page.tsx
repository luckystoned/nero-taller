import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Esta ruta queda reservada para un modulo futuro del MVP. Todavia no
          implementa logica de negocio, modelo de dominio, acceso a base de
          datos ni flujo de autenticacion.
        </p>
      </CardContent>
    </Card>
  );
}
