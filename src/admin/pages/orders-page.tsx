import React from "react";
import { Button, Input, Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link, useSearchParams } from "react-router-dom";
import { mockOrders } from "../data/mock-data";
import { StatusBadge } from "./dashboard-page";

export const OrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  
  const searchQuery = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "";
  
  const rowsPerPage = 10;
  
  React.useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    setSearchParams(params);
    setPage(1);
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
    setPage(1);
  };
  
  // Get unique statuses from orders
  const statuses = React.useMemo(() => {
    const uniqueStatuses = new Set<string>();
    mockOrders.forEach(order => uniqueStatuses.add(order.status));
    return Array.from(uniqueStatuses);
  }, []);
  
  // Filter orders based on search and status
  const filteredOrders = React.useMemo(() => {
    return mockOrders.filter(order => {
      const matchesSearch = !searchQuery || 
        order.id.toString().includes(searchQuery) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesStatus = !statusFilter || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);
  
  // Paginate orders
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
              placeholder="Search orders..."
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
                    {statusFilter ? `Status: ${statusFilter}` : "All Statuses"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Status filter"
                  onAction={(key) => handleStatusFilter(key.toString())}
                  selectedKeys={statusFilter ? [statusFilter] : []}
                  selectionMode="single"
                >
                  <DropdownItem key="">All Statuses</DropdownItem>
                  {statuses.map((status) => (
                    <DropdownItem key={status}>{status}</DropdownItem>
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
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
                />
              </div>
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
              loadingContent={<div className="p-3">Loading orders...</div>}
              emptyContent={<div className="p-3">No orders found</div>}
              items={paginatedOrders}
            >
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link to={`/admin/orders/${item.id}`} className="text-primary hover:underline">
                      #{item.id}
                    </Link>
                  </TableCell>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>${item.total.toFixed(2)}</TableCell>
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
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        color="danger"
                      >
                        <Icon icon="lucide:trash" />
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