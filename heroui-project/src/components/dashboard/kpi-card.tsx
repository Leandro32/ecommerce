import React from "react";
import { Card, CardBody, Skeleton } from "@heroui/react";
import { Icon } from "@iconify/react";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: string;
  isLoading?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  isLoading = false
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "lucide:trending-up";
      case "down":
        return "lucide:trending-down";
      default:
        return "lucide:minus";
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div>
            <Skeleton isLoaded={!isLoading} className="rounded-md">
              <p className="text-sm text-gray-500">{title}</p>
            </Skeleton>
            
            <div className="mt-1">
              <Skeleton isLoaded={!isLoading} className="h-8 rounded-md">
                <h3 className="text-2xl font-semibold">{value}</h3>
              </Skeleton>
            </div>
            
            <div className="mt-1">
              <Skeleton isLoaded={!isLoading} className="h-5 w-24 rounded-md">
                <div className={`flex items-center text-xs ${getTrendColor()}`}>
                  <Icon icon={getTrendIcon()} className="mr-1" />
                  <span>{change} from last month</span>
                </div>
              </Skeleton>
            </div>
          </div>
          
          <Skeleton isLoaded={!isLoading} className="rounded-full w-10 h-10">
            <div className="p-2 rounded-full bg-primary/10">
              <Icon icon={icon} className="text-primary text-xl" />
            </div>
          </Skeleton>
        </div>
      </CardBody>
    </Card>
  );
};