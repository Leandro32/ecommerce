import { Product } from './product';

export enum OrderStatus {
  SOLICITUD_NUEVO = 'SOLICITUD_NUEVO',
  ENVIADO_EN_PROCESO = 'ENVIADO_EN_PROCESO',
  ACEPTADO = 'ACEPTADO',
  CANCELADO = 'CANCELADO',
  ENVIADO_CUMPLIDO = 'ENVIADO_CUMPLIDO',
  RECIBIDO_CONFORME = 'RECIBIDO_CONFORME',
  FACTURADO_PAGADO = 'FACTURADO_PAGADO',
  CERRADO = 'CERRADO',
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product; // Optional, can be populated via relation
}

export interface Order {
  id: string;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
