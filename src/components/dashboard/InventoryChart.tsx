'use client';

import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';

interface InventoryChartProps {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
}

export function InventoryChart({ data }: InventoryChartProps) {
  const chartConfig = {
    value: {
      label: "Books",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full pt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
