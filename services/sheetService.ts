import { Transaction } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbzN0EOa-oniymHlKJbfv2MvLH5Z5QNPFisCAYxbMtSjqIWY7YKw0wtAB7VcMA7nD0cN/exec';

export const sheetService = {
    async getTransactions(): Promise<Transaction[]> {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener datos');
            const data = await response.json();
            // Asegurarse de que amount sea número
            return data.map((t: any) => ({
                ...t,
                amount: Number(t.amount)
            }));
        } catch (error) {
            console.error('Error in getTransactions:', error);
            return [];
        }
    },

    async addTransaction(transaction: Transaction): Promise<boolean> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify(transaction),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in addTransaction:', error);
            return false;
        }
    }
};
