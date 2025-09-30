import React from "react";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { KpiCard } from "../components/dashboard/kpi-card";
import { RevenueChart } from "../components/dashboard/revenue-chart";
import { mockKpiData, mockRecentOrders } from "../data/mock-data";

export const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            color="primary"
            startContent={<Icon icon="lucide:plus" />}
            as={Link}
            to="/admin/orders/new"
          >
            New Order
          </Button>
          <Button 
            color="primary"
            variant="flat"
            startContent={<Icon icon="lucide:plus" />}
            as={Link}
            to="/admin/products/new"
          >
            New Product
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockKpiData.map((kpi) => (
          <KpiCard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
            icon={kpi.icon}
            isLoading={isLoading}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardBody>
            <h2 className="text-lg font-medium mb-4">Revenue Overview</h2>
            <RevenueChart isLoading={isLoading} />
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Recent Orders</h2>
              <Button 
                variant="light" 
                color="primary" 
                size="sm"
                as={Link}
                to="/admin/orders"
                endContent={<Icon icon="lucide:chevron-right" className="text-xs" />}
              >
                View All
              </Button>
            </div>
            
            <Table 
              aria-label="Recent orders" 
              removeWrapper 
              isHeaderSticky
              classNames={{
                base: "max-h-[400px]",
              }}
            >
              <TableHeader>
                <TableColumn>ORDER</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>TOTAL</TableColumn>
              </TableHeader>
              <TableBody 
                isLoading={isLoading}
                loadingContent={<div className="p-3">Loading recent orders...</div>}
                emptyContent={<div className="p-3">No recent orders found</div>}
              >
                {mockRecentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link to={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                        #{order.id}
                      </Link>
                      <div className="text-xs text-gray-500">{order.date}</div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string): "primary" | "success" | "warning" | "danger" | "secondary" | "default" => {
    switch (status.toLowerCase()) {
      case "solicitud":
      case "nuevo":
        return "primary";
      case "enviado":
      case "en proceso":
        return "warning";
      case "aceptado":
        return "success";
      case "cancelado":
        return "danger";
      case "enviado / cumplido":
        return "secondary";
      case "recibido / conforme":
        return "primary";
      case "facturado / pagado":
        return "success";
      case "cerrado":
      default:
        return "default";
    }
  };

  return (
    <Badge color={getStatusColor(status)} variant="flat">
      {status}
    </Badge>
  );
};