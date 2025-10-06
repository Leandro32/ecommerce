import React from "react";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import useSWR from 'swr';
import { KpiCard } from "../components/dashboard/kpi-card";
import { RevenueChart } from "../components/dashboard/revenue-chart";
import { fetcher } from "../lib/fetcher";

// Data types based on Prisma schema
interface Product {
  id: string;
  name: string;
  price: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  product: Product;
}

interface Order {
  id: string;
  customerName: string;
  status: string;
  items: OrderItem[];
  createdAt: string;
}

export const DashboardPage: React.FC = () => {
  const { data: orders, error, isLoading } = useSWR<Order[]>('/api/v1/admin/orders', fetcher);

  const kpiData = React.useMemo(() => {
    if (!orders) return [];

    const completedOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'RECIBIDO_CONFORME' || o.status === 'FACTURADO_PAGADO');
    const totalRevenue = completedOrders.reduce((acc, order) => {
      const orderTotal = order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return acc + orderTotal;
    }, 0);

    const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    return [
      {
        id: '1',
        title: 'Total Revenue',
        value: `$${totalRevenue.toFixed(2)}`,
        change: "+10.5%", // Mock change
        trend: "up" as const,
        icon: "lucide:dollar-sign",
      },
      {
        id: '2',
        title: 'New Orders',
        value: orders.length.toString(),
        change: "+5.2%", // Mock change
        trend: "up" as const,
        icon: "lucide:shopping-cart",
      },
      {
        id: '3',
        title: 'Avg. Order Value',
        value: `$${avgOrderValue.toFixed(2)}`,
        change: "-1.2%", // Mock change
        trend: "down" as const,
        icon: "lucide:receipt",
      },
      {
        id: '4',
        title: 'Conversion Rate',
        value: "1.8%", // Mock value
        change: "+0.5%", // Mock change
        trend: "up" as const,
        icon: "lucide:mouse-pointer-click",
      },
    ];
  }, [orders]);

  const recentOrders = orders?.slice(0, 5) || [];

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
        {kpiData.map((kpi) => (
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
                emptyContent={<div className="p-3">{error ? "Failed to load orders" : "No recent orders found"}</div>}
              >
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link to={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                        #{order.id.slice(-6)}
                      </Link>
                      <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>${order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}</TableCell>
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
    switch (status) {
      case "SOLICITUD_NUEVO":
        return "primary";
      case "ENVIADO_EN_PROCESO":
        return "warning";
      case "ACEPTADO":
        return "success";
      case "CANCELADO":
        return "danger";
      case "ENVIADO_CUMPLIDO":
        return "secondary";
      case "RECIBIDO_CONFORME":
        return "primary";
      case "FACTURADO_PAGADO":
        return "success";
      case "CERRADO":
      default:
        return "default";
    }
  };

  return (
    <Badge color={getStatusColor(status)} variant="flat">
      {status.replace(/_/g, ' ').toLowerCase()}
    </Badge>
  );
};