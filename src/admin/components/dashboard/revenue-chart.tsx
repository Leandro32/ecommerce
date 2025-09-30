import React from "react";
import { Spinner } from "@heroui/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface RevenueChartProps {
  isLoading?: boolean;
}

const data = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 2780 },
  { month: "May", revenue: 1890 },
  { month: "Jun", revenue: 2390 },
  { month: "Jul", revenue: 3490 },
  { month: "Aug", revenue: 4000 },
  { month: "Sep", revenue: 2780 },
  { month: "Oct", revenue: 1890 },
  { month: "Nov", revenue: 3578 },
  { month: "Dec", revenue: 5800 },
];

export const RevenueChart: React.FC<RevenueChartProps> = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="month" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'hsl(var(--heroui-foreground-500))' }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'hsl(var(--heroui-foreground-500))' }}
          tickFormatter={(value) => `$${value}`}
        />
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke="hsl(var(--heroui-foreground-200))" 
        />
        <Tooltip 
          formatter={(value) => [`$${value}`, "Revenue"]}
          contentStyle={{
            backgroundColor: 'hsl(var(--heroui-content1))',
            border: '1px solid hsl(var(--heroui-divider))',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="hsl(var(--heroui-primary))"
          fillOpacity={1}
          fill="url(#colorRevenue)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};