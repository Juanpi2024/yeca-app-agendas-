
import { Transaction, Order } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbxLE10gKyrvFiS0UjF1MoOUOPjXb91V-SBTSDZ_NdpeCLD4uEU_7vZvxdqXUG3BEi-G/exec';

export const sheetService = {
    async getTransactions(): Promise<Transaction[]> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'getTransactions' }),
            });
            if (!response.ok) return [];
            const data = await response.json();
            // Mapeamos claves en minúsculas del Apps Script a camelCase
            return data.map((t: any) => {
                const rawType = String(t.type || '').toUpperCase();
                let normalizedType = rawType;
                if (rawType.startsWith('VENTA') || rawType.startsWith('INGRE')) normalizedType = 'VENTA';
                else if (rawType.startsWith('GAST') || rawType.startsWith('EGRE') || rawType.startsWith('COMPR')) normalizedType = 'GASTO';

                return {
                    id: String(t.id),
                    type: normalizedType as 'VENTA' | 'GASTO',
                    amount: typeof t.amount === 'number' ? t.amount : Number(String(t.amount || '0').replace(/[^\d-]/g, '')),
                    description: t.description,
                    category: t.category,
                    date: t.date
                };
            });
        } catch (error) {
            console.error('Error in getTransactions:', error);
            return [];
        }
    },

    async addTransaction(transaction: Transaction): Promise<boolean> {
        try {
            // ALINEADO CON EXCEL: id, date, amount, type, category, description
            const dataToSave = {
                id: transaction.id,
                date: transaction.date,        // Columna B
                amount: transaction.amount,    // Columna C
                type: transaction.type,        // Columna D
                category: transaction.category,// Columna E
                description: transaction.description // Columna F
            };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'addTransaction', data: dataToSave }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in addTransaction:', error);
            return false;
        }
    },

    async getOrders(): Promise<Order[]> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'getOrders' }),
            });
            if (!response.ok) return [];
            const data = await response.json();
            // Mapeamos las claves en minúsculas del Apps Script a las camelCase de TypeScript
            return data.map((o: any) => ({
                id: String(o.id),
                clientName: o.clientname,
                productType: o.producttype,
                value: typeof o.value === 'number' ? o.value : Number(String(o.value || '0').replace(/[^\d-]/g, '')),
                details: o.details,
                deliveryDate: o.deliverydate,
                status: o.status,
                paid: o.paid === true || String(o.paid).toLowerCase() === 'true',
                createdAt: o.createdat
            }));
        } catch (error) {
            console.error('Error in getOrders:', error);
            return [];
        }
    },

    async addOrder(order: Order): Promise<boolean> {
        try {
            // Normalizamos data
            const dataToSave = {
                id: order.id,
                clientname: order.clientName,
                producttype: order.productType,
                value: order.value,
                details: order.details,
                deliverydate: order.deliveryDate,
                status: order.status,
                paid: order.paid,
                createdat: order.createdAt
            };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'addOrder', data: dataToSave }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in addOrder:', error);
            return false;
        }
    },

    async updateOrder(order: Order): Promise<boolean> {
        try {
            const dataToSave = {
                id: order.id,
                clientname: order.clientName,
                producttype: order.productType,
                value: order.value,
                details: order.details,
                deliverydate: order.deliveryDate,
                status: order.status,
                paid: order.paid,
                createdat: order.createdAt
            };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'updateOrder', data: dataToSave }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in updateOrder:', error);
            return false;
        }
    },

    async deleteOrder(id: string): Promise<boolean> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'deleteOrder', data: { id } }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in deleteOrder:', error);
            return false;
        }
    },

    async deleteTransaction(id: string): Promise<boolean> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'deleteTransaction', data: { id } }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in deleteTransaction:', error);
            return false;
        }
    }
};
