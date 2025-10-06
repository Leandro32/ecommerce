import React from 'react';
import { Chip } from '@heroui/react';
import { OrderStatus } from '../../types/order';

interface StatusBadgeProps {
  status: OrderStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let color: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
  let text: string;

  switch (status) {
    case OrderStatus.SOLICITUD_NUEVO:
      color = 'primary';
      text = 'Solicitud / Nuevo';
      break;
    case OrderStatus.ENVIADO_EN_PROCESO:
      color = 'warning';
      text = 'Enviado / En Proceso';
      break;
    case OrderStatus.ACEPTADO:
      color = 'success';
      text = 'Aceptado';
      break;
    case OrderStatus.CANCELADO:
      color = 'danger';
      text = 'Cancelado';
      break;
    case OrderStatus.ENVIADO_CUMPLIDO:
      color = 'secondary';
      text = 'Enviado / Cumplido';
      break;
    case OrderStatus.RECIBIDO_CONFORME:
      color = 'success'; // Teal is not a direct heroui color, using success for now
      text = 'Recibido / Conforme';
      break;
    case OrderStatus.FACTURADO_PAGADO:
      color = 'success'; // Dark Green is not a direct heroui color, using success for now
      text = 'Facturado / Pagado';
      break;
    case OrderStatus.CERRADO:
      color = 'default';
      text = 'Cerrado';
      break;
    default:
      color = 'default';
      text = status;
  }

  return (
    <Chip color={color} size="sm" variant="flat">
      {text}
    </Chip>
  );
};

export default StatusBadge;
