
export type TransactionType = 'VENTA' | 'GASTO';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface Order {
  id: string;
  clientName: string;
  productType: string;
  value: number;
  details: string;
  deliveryDate: string;
  status: 'PENDIENTE' | 'ENTREGADO' | 'CANCELADO';
  paid: boolean;
  createdAt: string;
}

export interface BusinessState {
  transactions: Transaction[];
  orders: Order[];
}

export const CATEGORIES = {
  VENTA: ['Agenda Personalizada', 'Agenda Stock', 'Planner Semanal', 'Accesorios', 'Libreta', 'Otro'],
  GASTO: ['Papelería/Insumos', 'Herramientas', 'Marketing', 'Envío', 'Servicios', 'Otros']
};
