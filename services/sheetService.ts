
import { Transaction, Order } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbxLE10gKyrvFiS0UjF1MoOUOPjXb91V-SBTSDZ_NdpeCLD4uEU_7vZvxdqXUG3BEi-G/exec';

export const sheetService = {
    async getTransactions(): Promise<Transaction[]> {
        try {
            const response = await fetch(`${API_URL}?action=getTransactions`);
            if (!response.ok) return [];
            const data = await response.json();
            return data.map((t: any) => ({ ...t, amount: Number(t.amount) }));
        } catch (error) {
            console.error('Error in getTransactions:', error);
            return [];
        }
    },

    async addTransaction(transaction: Transaction): Promise<boolean> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'addTransaction', data: transaction }),
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
            return data.map((o: any) => ({ ...o, value: Number(o.value) }));
        } catch (error) {
            console.error('Error in getOrders:', error);
            return [];
        }
    },

    async addOrder(order: Order): Promise<boolean> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'addOrder', data: order }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in addOrder:', error);
            return false;
        }
    }
};
