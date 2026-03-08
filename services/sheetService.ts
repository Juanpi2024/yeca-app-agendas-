import { Transaction, Order, Material, ProductConfig, InventoryLog } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbztGCKg5Sqz2Bl7QqSecB_4JXyTHK_vNWXHbm4hL5egDs5WfWMG2UWCHrcMDE_rRq-I/exec';
const ORDERS_API_URL = 'https://script.google.com/macros/s/AKfycbxLE10gKyrvFiS0UjF1MoOUOPjXb91V-SBTSDZ_NdpeCLD4uEU_7vZvxdqXUG3BEi-G/exec';

export const sheetService = {
    // ---------------- TRANSACTIONS ----------------
    async getTransactions(): Promise<Transaction[]> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'getTransactions' }),
            });
            if (!response.ok) return [];
            const data = await response.json();
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
            const dataToSave = {
                id: transaction.id,
                date: transaction.date,
                amount: transaction.amount,
                type: transaction.type,
                category: transaction.category,
                description: transaction.description
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

    async deleteTransaction(id: string): Promise<boolean> {
        try {
            const idToSend = /^\d+$/.test(id) ? Number(id) : id;
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'deleteTransaction', data: { id: idToSend } }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in deleteTransaction:', error);
            return false;
        }
    },

    // ---------------- ORDERS ----------------
    async getOrders(): Promise<Order[]> {
        try {
            const response = await fetch(ORDERS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'getOrders' }),
            });
            if (!response.ok) return [];
            const data = await response.json();
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
            const response = await fetch(ORDERS_API_URL, {
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
                id: /^\d+$/.test(order.id) ? Number(order.id) : order.id,
                clientname: order.clientName,
                producttype: order.productType,
                value: order.value,
                details: order.details,
                deliverydate: order.deliveryDate,
                status: order.status,
                paid: order.paid,
                createdat: order.createdAt
            };
            const response = await fetch(ORDERS_API_URL, {
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
            const idToSend = /^\d+$/.test(id) ? Number(id) : id;
            const response = await fetch(ORDERS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'deleteOrder', data: { id: idToSend } }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in deleteOrder:', error);
            return false;
        }
    },

    // ---------------- MATERIALS ----------------
    async getMaterials(): Promise<Material[]> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'getMaterials' }),
            });
            if (!response.ok) return [];
            const data = await response.json();
            return data.map((m: any) => ({
                id: String(m.id),
                name: String(m.name || ''),
                quantity: Number(m.quantity || 0),
                unit: String(m.unit || ''),
                costPerUnit: Number(m.costperunit || 0),
                minWarning: Number(m.minwarning || 0)
            }));
        } catch (error) {
            console.error('Error in getMaterials:', error);
            return [];
        }
    },

    async addMaterial(material: Material): Promise<boolean> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    action: 'addMaterial', data: {
                        id: material.id,
                        name: material.name,
                        quantity: material.quantity,
                        unit: material.unit,
                        costperunit: material.costPerUnit,
                        minwarning: material.minWarning
                    }
                }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in addMaterial:', error);
            return false;
        }
    },

    async updateMaterial(material: Material): Promise<boolean> {
        try {
            const idToSend = /^\d+$/.test(material.id) ? Number(material.id) : material.id;
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    action: 'updateMaterial', data: {
                        id: idToSend,
                        name: material.name,
                        quantity: material.quantity,
                        unit: material.unit,
                        costperunit: material.costPerUnit,
                        minwarning: material.minWarning
                    }
                }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in updateMaterial:', error);
            return false;
        }
    },

    async deleteMaterial(id: string): Promise<boolean> {
        try {
            const idToSend = /^\d+$/.test(id) ? Number(id) : id;
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'deleteMaterial', data: { id: idToSend } }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in deleteMaterial:', error);
            return false;
        }
    },

    // ---------------- PRODUCTS (RECETAS) ----------------
    async getProducts(): Promise<ProductConfig[]> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'getProducts' }),
            });
            if (!response.ok) return [];
            const data = await response.json();
            return data.map((p: any) => ({
                id: String(p.id),
                name: String(p.name || ''),
                materials: Array.isArray(p.materials) ? p.materials : [],
                productionCost: Number(p.productioncost || 0),
                profitMargin: Number(p.profitmargin || 0),
                salePrice: Number(p.saleprice || 0)
            }));
        } catch (error) {
            console.error('Error in getProducts:', error);
            return [];
        }
    },

    async addProduct(product: ProductConfig): Promise<boolean> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    action: 'addProduct', data: {
                        id: product.id,
                        name: product.name,
                        materials: product.materials,
                        productioncost: product.productionCost,
                        profitmargin: product.profitMargin,
                        saleprice: product.salePrice
                    }
                }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in addProduct:', error);
            return false;
        }
    },

    async updateProduct(product: ProductConfig): Promise<boolean> {
        try {
            const idToSend = /^\d+$/.test(product.id) ? Number(product.id) : product.id;
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    action: 'updateProduct', data: {
                        id: idToSend,
                        name: product.name,
                        materials: product.materials,
                        productioncost: product.productionCost,
                        profitmargin: product.profitMargin,
                        saleprice: product.salePrice
                    }
                }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in updateProduct:', error);
            return false;
        }
    },

    async deleteProduct(id: string): Promise<boolean> {
        try {
            const idToSend = /^\d+$/.test(id) ? Number(id) : id;
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'deleteProduct', data: { id: idToSend } }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in deleteProduct:', error);
            return false;
        }
    },

    // ---------------- INVENTORY LOGS ----------------
    async getInventoryLogs(): Promise<InventoryLog[]> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'getInventoryLogs' }),
            });
            if (!response.ok) return [];
            const data = await response.json();
            return data.map((l: any) => ({
                id: String(l.id),
                date: String(l.date || ''),
                materialId: String(l.materialid || ''),
                quantityChange: Number(l.quantitychange || 0),
                reason: String(l.reason || '')
            }));
        } catch (error) {
            console.error('Error in getInventoryLogs:', error);
            return [];
        }
    },

    async addInventoryLog(log: InventoryLog): Promise<boolean> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    action: 'addInventoryLog', data: {
                        id: log.id,
                        date: log.date,
                        materialid: log.materialId,
                        quantitychange: log.quantityChange,
                        reason: log.reason
                    }
                }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error in addInventoryLog:', error);
            return false;
        }
    }
};
