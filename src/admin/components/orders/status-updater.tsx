import React from "react";
import { Select, SelectItem, Button } from "@heroui/react";
import { addToast } from "@heroui/react";
import { Icon } from "@iconify/react";

interface StatusUpdaterProps {
  orderId: string | number;
  currentStatus: string;
}

export const StatusUpdater: React.FC<StatusUpdaterProps> = ({ orderId, currentStatus }) => {
  const [status, setStatus] = React.useState(currentStatus);
  const [isUpdating, setIsUpdating] = React.useState(false);
  
  const statuses = [
    "Solicitud / Nuevo",
    "Enviado / En Proceso",
    "Aceptado",
    "Cancelado",
    "Enviado / Cumplido",
    "Recibido / Conforme",
    "Facturado / Pagado",
    "Cerrado"
  ];
  
  const handleStatusChange = (keys: Set<React.Key>) => {
    const selected = Array.from(keys)[0] as string;
    setStatus(selected);
  };
  
  const handleUpdateStatus = async () => {
    if (status === currentStatus) return;
    
    setIsUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addToast({
        title: "Status Updated",
        description: `Order #${orderId} status changed to ${status}`,
        severity: "success"
      });
      
      // In a real app, you would update the order in your state management
    } catch (error) {
      console.error("Error updating status:", error);
      addToast({
        title: "Update Failed",
        description: "Failed to update order status. Please try again.",
        severity: "danger"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Select
        label="Order Status"
        selectedKeys={[status]}
        onSelectionChange={handleStatusChange}
        className="w-full"
      >
        {statuses.map((statusOption) => (
          <SelectItem key={statusOption} value={statusOption}>
            {statusOption}
          </SelectItem>
        ))}
      </Select>
      
      <Button
        color="primary"
        className="w-full"
        isLoading={isUpdating}
        isDisabled={status === currentStatus || isUpdating}
        onPress={handleUpdateStatus}
        startContent={<Icon icon="lucide:check" />}
      >
        Update Status
      </Button>
    </div>
  );
};