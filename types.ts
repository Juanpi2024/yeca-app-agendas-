
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

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  minWarning: number;
}

export interface ProductConfig {
  id: string;
  name: string;
  materials: { materialId: string; quantity: number }[];
  productionCost: number;
  profitMargin: number;
  salePrice: number;
}

export interface InventoryLog {
  id: string;
  date: string;
  materialId: string;
  quantityChange: number;
  reason: string;
}

export interface BusinessState {
  transactions: Transaction[];
  orders: Order[];
  materials: Material[];
  products: ProductConfig[];
  inventoryLogs: InventoryLog[];
}

export const CATEGORIES = {
  VENTA: ['Agenda Personalizada', 'Agenda Stock', 'Planner Semanal', 'Accesorios', 'Libreta', 'Otro'],
  GASTO: ['Papelería/Insumos', 'Herramientas', 'Marketing', 'Envío', 'Servicios', 'Otros']
};
