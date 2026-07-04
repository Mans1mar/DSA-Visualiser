import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ComplexityCard({ label, value }: { label: string; value: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-lg font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
