import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  colorClass?: string;
}

export function StatCard({ label, value, icon: Icon, trend, colorClass = "text-primary" }: StatCardProps) {
  return (
    <Card className="glass-card p-6 flex items-start gap-4">
      <div className={`p-3 rounded-2xl bg-muted/50 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <h3 className="text-3xl font-bold font-headline mt-1">{value}</h3>
        {trend && (
          <p className="text-xs text-secondary font-medium mt-1">
            {trend}
          </p>
        )}
      </div>
    </Card>
  );
}