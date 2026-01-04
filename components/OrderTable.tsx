import React from 'react';
import { Order } from '../types';
import { CheckCircle2, Trash2, Clock, X, Info } from 'lucide-react';

interface OrderTableProps {
    orders: Order[];
    onUpdateStatus: (id: string, status: Order['status']) => void;
    onDeleteOrder: (id: string) => void;
}

export function OrderTable({ orders, onUpdateStatus, onDeleteOrder }: OrderTableProps) {
    const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
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
        <>
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
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-left group"
                                                >
                                                    <div className="text-sm font-bold text-rose-600 group-hover:underline flex items-center gap-1">
                                                        {order.clientName}
                                                        <Info size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div className="text-xs text-slate-500">{order.productType}</div>
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-sm font-bold text-slate-800">${order.value.toLocaleString()}</div>
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

            {/* MODAL DE DETALLES */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
                        <div className="bg-rose-500 p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">{selectedOrder.clientName}</h3>
                                <p className="text-rose-100 text-sm">{selectedOrder.productType}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Detalle del Encargo</h4>
                                <div className="bg-slate-50 p-4 rounded-2xl text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100 italic">
                                    {selectedOrder.details || 'Sin detalles especificados.'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Valor</p>
                                    <p className="text-lg font-bold text-rose-600">${selectedOrder.value.toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Entrega</p>
                                    <p className="text-lg font-bold text-slate-800">
                                        {new Date(selectedOrder.deliveryDate).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all shadow-md active:scale-95"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default OrderTable;
