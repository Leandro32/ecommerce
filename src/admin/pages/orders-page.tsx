import React from "react";
import { Button, Input, Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Badge, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link, useSearchParams } from "react-router-dom";
import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';

// Copied from dashboard-page.tsx - should be in a shared component
interface StatusBadgeProps {
  status: string;
}
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string): "primary" | "success" | "warning" | "danger" | "secondary" | "default" => {
    switch (status) {
      case "SOLICITUD_NUEVO": return "primary";
      case "ENVIADO_EN_PROCESO": return "warning";
      case "ACEPTADO": return "success";
      case "CANCELADO": return "danger";
      case "ENVIADO_CUMPLIDO": return "secondary";
      case "RECIBIDO_CONFORME": return "primary";
      case "FACTURADO_PAGADO": return "success";
      case "CERRADO":
      default: return "default";
    }
  };
  return (
    <Badge color={getStatusColor(status)} variant="flat">
      {status.replace(/_/g, ' ').toLowerCase()}
    </Badge>
  );
};

interface Order {
  id: string;
  customerName: string;
  status: string;
  items: { product: { price: number }, quantity: number }[];
  createdAt: string;
}

const ORDER_STATUSES = [
  "SOLICITUD_NUEVO",
  "ENVIADO_EN_PROCESO",
  "ACEPTADO",
  "CANCELADO",
  "ENVIADO_CUMPLIDO",
  "RECIBIDO_CONFORME",
  "FACTURADO_PAGADO",
  "CERRADO",
];

export const OrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: orders, error, isLoading } = useSWR<Order[]>('/api/v1/admin/orders', fetcher);

  const page = Number(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "";
  
  const rowsPerPage = 10;
  
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    setSearchParams(params);
  };
  
  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    setSearchParams(params);
  };
  
  const filteredOrders = React.useMemo(() => {
    if (!orders) return [];
    return orders.filter(order => {
      const matchesSearch = !searchQuery || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesStatus = !statusFilter || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);
  
  const paginatedOrders = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, page]);
  
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Button 
          color="primary"
          startContent={<Icon icon="lucide:plus" />}
          as={Link}
          to="/admin/orders/new"
        >
          New Order
        </Button>
      </div>
      
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="Search by ID or customer..."
              value={searchQuery}
              onValueChange={handleSearch}
              startContent={<Icon icon="lucide:search" className="text-default-400" />}
              isClearable
              className="w-full md:w-80"
            />
            
            <div className="flex gap-2 ml-auto">
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="flat" 
                    endContent={<Icon icon="lucide:chevron-down" className="text-small" />}
                  >
                    {statusFilter ? `Status: ${statusFilter.replace(/_/g, ' ').toLowerCase()}` : "All Statuses"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Status filter"
                  onAction={(key) => handleStatusFilter(key === 'all' ? '' : key.toString())}
                  selectedKeys={statusFilter ? [statusFilter] : []}
                  selectionMode="single"
                >
                  <DropdownItem key="all">All Statuses</DropdownItem>
                  {ORDER_STATUSES.map((status) => (
                    <DropdownItem key={status}>{status.replace(/_/g, ' ').toLowerCase()}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          
          <Table 
            aria-label="Orders table"
            removeWrapper
            isHeaderSticky
            bottomContent={
              totalPages > 1 && (
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={totalPages}
                    onChange={(p) => setSearchParams(new URLSearchParams({ ...Object.fromEntries(searchParams), page: p.toString() }))}
                  />
                </div>
              )
            }
          >
            <TableHeader>
              <TableColumn>ORDER ID</TableColumn>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>TOTAL</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody 
              isLoading={isLoading}
              loadingContent={<Spinner label="Loading orders..." />}
              emptyContent={!isLoading && "No orders found"}
              items={paginatedOrders}
            >
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link to={`/admin/orders/${item.id}`} className="text-primary hover:underline">
                      #{item.id.slice(-6)}
                    </Link>
                  </TableCell>
                  <TableCell>{item.customerName}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>${item.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light"
                        as={Link}
                        to={`/admin/orders/${item.id}`}
                      >
                        <Icon icon="lucide:eye" className="text-default-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};