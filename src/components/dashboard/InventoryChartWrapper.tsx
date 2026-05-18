'use client';

import dynamic from 'next/dynamic';

/**
 * A client-side wrapper for the InventoryChart component.
 * This is necessary because Recharts components must be loaded with ssr: false,
 * which is only allowed within a Client Component in Next.js App Router.
 */
const InventoryChart = dynamic(
  () => import('./InventoryChart').then((mod) => mod.InventoryChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-muted/10 animate-pulse rounded-xl flex items-center justify-center text-xs text-muted-foreground uppercase tracking-widest">
        Loading Analytics...
      </div>
    ),
  }
);

interface InventoryChartWrapperProps {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
}

export function InventoryChartWrapper({ data }: InventoryChartWrapperProps) {
  return <InventoryChart data={data} />;
}
