
import { Transaction, Order } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbxLE10gKyrvFiS0UjF1MoOUOPjXb91V-SBTSDZ_NdpeCLD4uEU_7vZvxdqXUG3BEi-G/exec';

export const sheetService = {
    async getTransactions(): Promise<Transaction[]> {
        try {
            const response = await fetch(`${API_URL}?action=getTransactions`);
            if (!response.ok) return [];
            const data = await response.json();
            // Mapeamos claves en minúsculas del Apps Script a camelCase
            return data.map((t: any) => ({
                id: t.id,
                type: t.type,
                amount: Number(t.amount),
                description: t.description,
                category: t.category,
                date: t.date
            }));
        } catch (error) {
            console.error('Error in getTransactions:', error);
            return [];
        }
    },

    async addTransaction(transaction: Transaction): Promise<boolean> {
        try {
            // Normalizamos data para asegurar consistencia con lo que espera el script
            const dataToSave = {
                id: transaction.id,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                category: transaction.category,
                date: transaction.date
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
            const response = await fetch(`${API_URL}?action=getOrders`);
            if (!response.ok) return [];
            const data = await response.json();
            // Mapeamos las claves en minúsculas del Apps Script a las camelCase de TypeScript
            return data.map((o: any) => ({
                id: o.id,
                clientName: o.clientname,
                productType: o.producttype,
                value: Number(o.value),
                details: o.details,
                deliveryDate: o.deliverydate,
                status: o.status,
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
                clientName: order.clientName,
                productType: order.productType,
                value: order.value,
                details: order.details,
                deliveryDate: order.deliveryDate,
                status: order.status,
                createdAt: order.createdAt
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
    }
};
