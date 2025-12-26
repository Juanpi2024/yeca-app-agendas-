
import React from 'react';
import { Order } from '../types';

interface OrderTableProps {
    orders: Order[];
}

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
    const sortedOrders = [...orders].sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());

    const getDaysRemaining = (dateStr: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const delivery = new Date(dateStr);
        delivery.setHours(0, 0, 0, 0);
        const diffTime = delivery.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getStatusColor = (days: number) => {
        if (days < 0) return 'bg-slate-100 text-slate-500';
        if (days <= 3) return 'bg-rose-100 text-rose-700 animate-pulse';
        if (days <= 7) return 'bg-amber-100 text-amber-700';
        return 'bg-emerald-100 text-emerald-700';
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Entrega</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Cliente / Producto</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Valor</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {sortedOrders.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">No hay pedidos pendientes</td>
                            </tr>
                        ) : (
                            sortedOrders.map((order) => {
                                const days = getDaysRemaining(order.deliveryDate);
                                return (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-800">{new Date(order.deliveryDate).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}</div>
                                            <div className="text-[10px] text-slate-400 uppercase font-semibold">
                                                {days < 0 ? 'Vencido' : `En ${days} días`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-800">{order.clientName}</div>
                                            <div className="text-xs text-slate-500">{order.productType}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-rose-600">${order.value.toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(days)}`}>
                                                {days < 0 ? 'Atrasado' : days <= 3 ? '¡Urgente!' : 'A tiempo'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderTable;
