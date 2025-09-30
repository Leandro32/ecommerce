import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardBody, Button, Divider, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { Icon } from "@iconify/react";
import { mockOrders } from "../data/mock-data";
import { StatusBadge } from "./dashboard-page";
import { StatusUpdater } from "../components/orders/status-updater";
import { InternalNotes } from "../components/orders/internal-notes";

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [order, setOrder] = React.useState<any>(null);
  
  React.useEffect(() => {
    // Simulate API call to get order data
    setTimeout(() => {
      const foundOrder = mockOrders.find(o => o.id.toString() === id);
      if (foundOrder) {
        setOrder(foundOrder);
      }
      setIsLoading(false);
    }, 1000);
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <Icon icon="lucide:loader" className="text-primary text-2xl animate-spin" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <Card>
        <CardBody className="flex flex-col items-center justify-center py-12">
          <Icon icon="lucide:alert-circle" className="text-danger text-4xl mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6">The order you're looking for doesn't exist or has been removed.</p>
          <Button as={Link} to="/admin/orders" color="primary">
            Back to Orders
          </Button>
        </CardBody>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Order #{order.id}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-gray-500 text-sm">
            Placed on {order.date} by {order.customer}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="flat" 
            as={Link} 
            to="/admin/orders"
            startContent={<Icon icon="lucide:arrow-left" />}
          >
            Back to Orders
          </Button>
          <Button 
            color="primary"
            startContent={<Icon icon="lucide:printer" />}
          >
            Print Invoice
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody>
              <h2 className="text-lg font-medium mb-4">Order Items</h2>
              <Table removeWrapper aria-label="Order items">
                <TableHeader>
                  <TableColumn>PRODUCT</TableColumn>
                  <TableColumn>QUANTITY</TableColumn>
                  <TableColumn>PRICE</TableColumn>
                  <TableColumn>TOTAL</TableColumn>
                </TableHeader>
                <TableBody items={order.items}>
                  {(item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                            <Icon icon="lucide:image" className="text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              <Divider className="my-4" />
              
              <div className="flex flex-col items-end gap-1 text-sm">
                <div className="flex justify-between w-48">
                  <span className="text-gray-500">Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-48">
                  <span className="text-gray-500">Shipping:</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-48">
                  <span className="text-gray-500">Tax:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-48 font-semibold text-base mt-2">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardBody>
                <h2 className="text-lg font-medium mb-4">Shipping Information</h2>
                <div className="space-y-2">
                  <p className="font-medium">{order.shipping_address.name}</p>
                  <p>{order.shipping_address.street}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                  <p>{order.shipping_address.country}</p>
                  <p className="text-gray-500">{order.shipping_address.phone}</p>
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <h2 className="text-lg font-medium mb-4">Billing Information</h2>
                <div className="space-y-2">
                  <p className="font-medium">{order.billing_address.name}</p>
                  <p>{order.billing_address.street}</p>
                  <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip}</p>
                  <p>{order.billing_address.country}</p>
                  <p className="text-gray-500">{order.billing_address.phone}</p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardBody>
              <h2 className="text-lg font-medium mb-4">Order Status</h2>
              <StatusUpdater 
                orderId={order.id} 
                currentStatus={order.status} 
              />
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <h2 className="text-lg font-medium mb-4">Internal Notes</h2>
              <InternalNotes 
                orderId={order.id} 
                initialNotes={order.notes || []} 
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};