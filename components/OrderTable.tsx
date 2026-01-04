import React from 'react';
import { Order } from '../types';
import { CheckCircle2, Trash2, Clock } from 'lucide-react';

interface OrderTableProps {
    orders: Order[];
    onUpdateStatus: (id: string, status: Order['status']) => void;
    onDeleteOrder: (id: string) => void;
}

export function OrderTable({ orders, onUpdateStatus, onDeleteOrder }: OrderTableProps) {
    const sortedOrders = [...orders].sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());

    const getDaysRemaining = (dateStr: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const delivery = new Date(dateStr);
        delivery.setHours(0, 0, 0, 0);
        const diffTime = delivery.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getStatusDisplay = (order: Order) => {
        if (order.status === 'ENTREGADO') {
            return { label: 'Entregado', color: 'bg-emerald-100 text-emerald-700' };
        }
        const days = getDaysRemaining(order.deliveryDate);
        if (days < 0) return { label: 'Atrasado', color: 'bg-slate-100 text-slate-500' };
        if (days <= 3) return { label: '¡Urgente!', color: 'bg-rose-100 text-rose-700 animate-pulse' };
        if (days <= 7) return { label: 'A tiempo', color: 'bg-amber-100 text-amber-700' };
        return { label: 'A tiempo', color: 'bg-emerald-100 text-emerald-700' };
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Entrega</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Cliente / Producto</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Valor</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Acciones</th>
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
                                const status = getStatusDisplay(order);
                                const isDelivered = order.status === 'ENTREGADO';

                                return (
                                    <tr key={order.id} className={`hover:bg-slate-50/50 transition-colors ${isDelivered ? 'opacity-60' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-800">
                                                {isNaN(new Date(order.deliveryDate).getTime())
                                                    ? 'Sin fecha'
                                                    : new Date(order.deliveryDate).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })
                                                }
                                            </div>
                                            <div className="text-[10px] text-slate-400 uppercase font-semibold">
                                                {isDelivered ? 'Finalizado' : (days < 0 ? 'Vencido' : `En ${days} días`)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-800">{order.clientName}</div>
                                            <div className="text-xs text-slate-500">{order.productType}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-sm font-bold text-rose-600">${order.value.toLocaleString()}</div>
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {!isDelivered ? (
                                                    <button
                                                        onClick={() => onUpdateStatus(order.id, 'ENTREGADO')}
                                                        className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all border border-emerald-100 group shadow-sm"
                                                        title="Marcar como entregado"
                                                    >
                                                        <CheckCircle2 size={18} className="group-hover:scale-110" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => onUpdateStatus(order.id, 'PENDIENTE')}
                                                        className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all border border-slate-100 group"
                                                        title="Volver a pendiente"
                                                    >
                                                        <Clock size={18} className="group-hover:scale-110" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => onDeleteOrder(order.id)}
                                                    className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all border border-rose-100 group shadow-sm"
                                                    title="Eliminar pedido"
                                                >
                                                    <Trash2 size={18} className="group-hover:scale-110 text-rose-500" />
                                                </button>
                                            </div>
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
}

export default OrderTable;
