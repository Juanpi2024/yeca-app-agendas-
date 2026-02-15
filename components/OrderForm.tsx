
import React, { useState } from 'react';
import { Order } from '../types';

interface OrderFormProps {
    onSubmit: (data: Omit<Order, 'id' | 'status' | 'paid' | 'createdAt'>) => void;
    onCancel: () => void;
    initialData?: Order;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, onCancel, initialData }) => {
    const [clientName, setClientName] = useState(initialData?.clientName || '');
    const [productType, setProductType] = useState(initialData?.productType || '');
    const [value, setValue] = useState(initialData?.value?.toString() || '');
    const [details, setDetails] = useState(initialData?.details || '');
    const [deliveryDate, setDeliveryDate] = useState(initialData?.deliveryDate || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientName || !productType || !value || !deliveryDate) return;
        onSubmit({
            clientName,
            productType,
            value: parseFloat(value),
            details,
            deliveryDate
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Cliente</label>
                <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej: María González"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Producto</label>
                    <input
                        type="text"
                        required
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                        placeholder="Ej: Agenda Pro"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Valor Pedido ($)</label>
                    <input
                        type="number"
                        required
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                    />
                </div>
            </div>

            <div>
                <div>
                    <label htmlFor="details" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Detalles / Especificaciones</label>
                    <textarea
                        id="details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Ej: Portada color lila con nombre en dorado..."
                        rows={3}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha de Entrega</label>
                <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                />
            </div>

            <div className="pt-4 flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95"
                >
                    {initialData ? 'Actualizar Pedido' : 'Guardar Pedido'}
                </button>
            </div>
        </form>
    );
};

export default OrderForm;
