import React, { useState } from 'react';
import { Material, ProductConfig } from '../types';
import { Plus, Trash2, Edit, Save, X, PackageOpen, Calculator, Info } from 'lucide-react';

interface CatalogProps {
    materials: Material[];
    products: ProductConfig[];
    onAddMaterial: (m: Omit<Material, 'id'>) => Promise<void>;
    onUpdateMaterial: (m: Material) => Promise<void>;
    onDeleteMaterial: (id: string) => Promise<void>;
    onAddProduct: (p: Omit<ProductConfig, 'id'>) => Promise<void>;
    onUpdateProduct: (p: ProductConfig) => Promise<void>;
    onDeleteProduct: (id: string) => Promise<void>;
}

export default function Catalog({
    materials,
    products,
    onAddMaterial,
    onUpdateMaterial,
    onDeleteMaterial,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct
}: CatalogProps) {
    const [activeTab, setActiveTab] = useState<'materials' | 'products'>('materials');

    // States for Material Form
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
    const [showMaterialForm, setShowMaterialForm] = useState(false);
    const [matName, setMatName] = useState('');
    const [matUnit, setMatUnit] = useState('Unidad');
    const [matCost, setMatCost] = useState('');

    // States for Product Form
    const [editingProduct, setEditingProduct] = useState<ProductConfig | null>(null);
    const [showProductForm, setShowProductForm] = useState(false);
    const [prodName, setProdName] = useState('');
    const [prodProfitMargin, setProdProfitMargin] = useState('70'); // Default 70% as in excel
    const [prodMaterials, setProdMaterials] = useState<{ materialId: string, quantity: number }[]>([]);

    // ---------------- MATERIALS ----------------
    const handleSaveMaterial = async () => {
        if (!matName || !matCost) return;
        const materialData = {
            name: matName,
            unit: matUnit,
            costPerUnit: Number(matCost),
            quantity: editingMaterial ? editingMaterial.quantity : 0,
            minWarning: 0
        };

        if (editingMaterial) {
            await onUpdateMaterial({ ...editingMaterial, ...materialData });
        } else {
            await onAddMaterial(materialData);
        }

        setShowMaterialForm(false);
        setEditingMaterial(null);
        setMatName('');
        setMatCost('');
    };

    const openMaterialForm = (m?: Material) => {
        if (m) {
            setEditingMaterial(m);
            setMatName(m.name);
            setMatUnit(m.unit);
            setMatCost(String(m.costPerUnit));
        } else {
            setEditingMaterial(null);
            setMatName('');
            setMatUnit('Unidad');
            setMatCost('');
        }
        setShowMaterialForm(true);
    };

    // ---------------- PRODUCTS ----------------
    const calculateProdCost = () => {
        return prodMaterials.reduce((total, pm) => {
            const mat = materials.find(m => m.id === pm.materialId);
            if (mat) return total + (mat.costPerUnit * pm.quantity);
            return total;
        }, 0);
    };

    const handleSaveProduct = async () => {
        if (!prodName || prodMaterials.length === 0) return;

        const productionCost = calculateProdCost();
        const margin = Number(prodProfitMargin) / 100;
        // Prevent division by zero if margin is >= 100
        const salePrice = margin >= 1 ? productionCost * (1 + margin) : Math.round(productionCost / (1 - margin));

        const productData = {
            name: prodName,
            materials: prodMaterials,
            productionCost,
            profitMargin: Number(prodProfitMargin),
            salePrice
        };

        if (editingProduct) {
            await onUpdateProduct({ ...editingProduct, ...productData });
        } else {
            await onAddProduct(productData);
        }

        setShowProductForm(false);
        setEditingProduct(null);
        setProdName('');
        setProdMaterials([]);
        setProdProfitMargin('70');
    };

    const openProductForm = (p?: ProductConfig) => {
        if (p) {
            setEditingProduct(p);
            setProdName(p.name);
            setProdMaterials(p.materials);
            setProdProfitMargin(String(p.profitMargin));
        } else {
            setEditingProduct(null);
            setProdName('');
            setProdMaterials([]);
            setProdProfitMargin('70');
        }
        setShowProductForm(true);
    };

    const toggleMaterialInProduct = (matId: string) => {
        const existing = prodMaterials.find(pm => pm.materialId === matId);
        if (existing) {
            setProdMaterials(prodMaterials.filter(pm => pm.materialId !== matId));
        } else {
            setProdMaterials([...prodMaterials, { materialId: matId, quantity: 1 }]);
        }
    };

    const updateProductMaterialQty = (matId: string, qty: number) => {
        setProdMaterials(prodMaterials.map(pm => pm.materialId === matId ? { ...pm, quantity: qty } : pm));
    };


    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header and Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <Calculator className="text-rose-500" />
                        Catálogo y Costos
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Configura tus insumos y calcula precios de venta automáticamente.</p>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-xl">
                    <button
                        onClick={() => setActiveTab('materials')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'materials' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        1. Insumos
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        2. Recetas (Productos)
                    </button>
                </div>
            </div>

            {/* MATERIALS TAB */}
            {activeTab === 'materials' && (
                <div className="animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-700">Tus Materiales Base</h3>
                        <button
                            onClick={() => openMaterialForm()}
                            className="flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl font-bold transition-colors text-sm"
                        >
                            <Plus size={16} /> Nuevo Insumo
                        </button>
                    </div>

                    {showMaterialForm && (
                        <div className="bg-slate-50 p-6 rounded-2xl mb-6 border border-slate-200">
                            <h4 className="font-bold text-slate-700 mb-4">{editingMaterial ? 'Editar' : 'Agregar'} Insumo</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Nombre</label>
                                    <input type="text" value={matName} onChange={(e) => setMatName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none" placeholder="Ej: Laminado frío corazón" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Medida</label>
                                    <input type="text" value={matUnit} onChange={(e) => setMatUnit(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none" placeholder="Ej: Hoja, Metro, Tira" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Costo ($ por medida)</label>
                                    <input type="number" value={matCost} onChange={(e) => setMatCost(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none" placeholder="Ej: 500" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setShowMaterialForm(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-bold text-sm">Cancelar</button>
                                <button onClick={handleSaveMaterial} disabled={!matName || !matCost} className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-900 transition-colors disabled:opacity-50 text-sm">
                                    <Save size={16} /> Guardar Insumo
                                </button>
                            </div>
                        </div>
                    )}

                    {materials.length === 0 && !showMaterialForm ? (
                        <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <PackageOpen className="mx-auto mb-2 opacity-50" size={32} />
                            <p>Aún no has agregado materias primas.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {materials.map(m => (
                                <div key={m.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
                                    <div>
                                        <h5 className="font-bold text-slate-800">{m.name}</h5>
                                        <p className="text-rose-600 font-bold mt-1 text-lg">${Number(m.costPerUnit).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ {m.unit}</span></p>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button title="Editar" onClick={() => openMaterialForm(m)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit size={14} /></button>
                                        <button title="Eliminar" onClick={() => confirm('¿Eliminar insumo?') && onDeleteMaterial(m.id)} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
                <div className="animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-700">Catálogo de Productos</h3>
                        <button
                            onClick={() => openProductForm()}
                            className="flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl font-bold transition-colors text-sm"
                            disabled={materials.length === 0}
                        >
                            <Plus size={16} /> Crear Producto
                        </button>
                    </div>

                    {materials.length === 0 && (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-700 flex gap-3 text-sm mb-6">
                            <Info className="shrink-0" size={20} />
                            <p>Primero debes agregar <strong>Insumos</strong> en la pestaña anterior para poder armar las recetas de tus productos.</p>
                        </div>
                    )}

                    {showProductForm && (
                        <div className="bg-slate-50 p-6 rounded-2xl mb-6 border border-slate-200">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-700">{editingProduct ? 'Editar' : 'Armar Nuevo'} Producto</h4>
                                <button title="Cerrar" onClick={() => setShowProductForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Nombre del Producto</label>
                                    <input type="text" value={prodName} onChange={(e) => setProdName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none" placeholder="Ej: Agenda Personalizada A5" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Porcentaje de Ganancia (%)</label>
                                    <input type="number" value={prodProfitMargin} onChange={(e) => setProdProfitMargin(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none" placeholder="Ej: 70" />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-500 mb-3">Materiales utilizados (Receta)</label>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Material Selection List */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-3 max-h-60 overflow-y-auto">
                                        {materials.map(m => {
                                            const isSelected = prodMaterials.some(pm => pm.materialId === m.id);
                                            return (
                                                <div key={m.id} onClick={() => toggleMaterialInProduct(m.id)} className={`flex justify-between items-center p-2 rounded-lg cursor-pointer mb-1 transition-colors ${isSelected ? 'bg-rose-50 border border-rose-200' : 'hover:bg-slate-50 border border-transparent'}`}>
                                                    <div>
                                                        <p className={`text-sm font-bold ${isSelected ? 'text-rose-700' : 'text-slate-700'}`}>{m.name}</p>
                                                        <p className="text-[10px] text-slate-400">${m.costPerUnit} / {m.unit}</p>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-300'}`}>
                                                        {isSelected && <Check size={12} />}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Quantities & Formula Preview */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                                        <div>
                                            <h5 className="text-sm font-bold text-slate-700 mb-3">Cantidades</h5>
                                            {prodMaterials.length === 0 ? (
                                                <p className="text-xs text-slate-400 italic">Selecciona materiales a la izquierda.</p>
                                            ) : (
                                                <div className="space-y-3 max-h-40 overflow-y-auto">
                                                    {prodMaterials.map(pm => {
                                                        const mat = materials.find(m => m.id === pm.materialId);
                                                        if (!mat) return null;
                                                        return (
                                                            <div key={pm.materialId} className="flex items-center justify-between gap-3 text-sm">
                                                                <span className="text-slate-600 truncate flex-1">{mat.name}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <input aria-label="Cantidad" type="number" min="0.1" step="any" value={pm.quantity} onChange={(e) => updateProductMaterialQty(pm.materialId, Number(e.target.value))} className="w-16 border border-slate-200 rounded px-2 py-1 text-center" />
                                                                    <span className="text-xs text-slate-400 w-8">{mat.unit}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {prodMaterials.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-slate-100">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-slate-500 font-medium">Costo Producción:</span>
                                                    <span className="font-bold text-slate-700">${Math.round(calculateProdCost()).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-slate-500 font-medium">+ Ganancia ({prodProfitMargin}%):</span>
                                                    <span className="font-bold text-emerald-600">${Math.round(calculateProdCost() * (Number(prodProfitMargin) / 100)).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-lg mt-2 pt-2 border-t border-slate-100">
                                                    <span className="text-slate-800 font-black">Precio Sugerido:</span>
                                                    <span className="font-black text-rose-600">
                                                        ${Math.round(calculateProdCost() / (1 - (Number(prodProfitMargin) / 100))).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button onClick={handleSaveProduct} disabled={!prodName || prodMaterials.length === 0} className="flex items-center gap-2 bg-rose-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200 disabled:opacity-50 text-sm">
                                    <Save size={16} /> Guardar Producto
                                </button>
                            </div>
                        </div>
                    )}

                    {products.length === 0 && !showProductForm ? (
                        <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Calculator className="mx-auto mb-2 opacity-50" size={32} />
                            <p>Aún no has creado productos. Agrega una receta.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {products.map(p => (
                                <div key={p.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex justify-between mb-4">
                                        <div>
                                            <h5 className="font-bold text-lg text-slate-800">{p.name}</h5>
                                            <span className="inline-block bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 uppercase tracking-wide">Ganancia: {p.profitMargin}%</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Precio Sugerido</p>
                                            <p className="font-black text-2xl text-slate-800">${p.salePrice.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-3 mb-4">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Costos Estimados</p>
                                        <div className="flex justify-between items-end">
                                            <p className="font-bold text-slate-600">${Math.round(p.productionCost).toLocaleString()}</p>
                                            <p className="text-xs text-emerald-600 font-bold">Utilidad: ${(p.salePrice - p.productionCost).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md font-medium">{p.materials.length} Insumos en la receta</span>
                                        <div className="flex gap-2">
                                            <button title="Editar" onClick={() => openProductForm(p)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"><Edit size={16} /></button>
                                            <button title="Eliminar" onClick={() => confirm('¿Eliminar producto?') && onDeleteProduct(p.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}

// Pequeño Icono faltante exportado globalmente arriba, lo agrego aquí para limpieza
const Check = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
