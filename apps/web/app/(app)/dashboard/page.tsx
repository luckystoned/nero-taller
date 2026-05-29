import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const placeholderMetrics = [
  "Work Orders",
  "Vehicle History",
  "Quotes",
  "Approvals",
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <Badge variant="secondary">Protected placeholder</Badge>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            Foundation route for the internal workshop workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page is intentionally static until real access control,
            database access, and domain services are introduced.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {placeholderMetrics.map((label) => (
          <Card key={label} size="sm">
            <CardHeader>
              <CardTitle>{label}</CardTitle>
              <CardDescription>Pending implementation</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
