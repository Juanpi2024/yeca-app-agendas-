
export type TransactionType = 'VENTA' | 'GASTO';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface BusinessState {
  transactions: Transaction[];
}

export const CATEGORIES = {
  VENTA: ['Agenda Personalizada', 'Agenda Stock', 'Planner Semanal', 'Accesorios', 'Libreta', 'Otro'],
  GASTO: ['Papelería/Insumos', 'Herramientas', 'Marketing', 'Envío', 'Servicios', 'Otros']
};
