import crypto from 'crypto';

const API_URL = 'https://script.google.com/macros/s/AKfycbztGCKg5Sqz2Bl7QqSecB_4JXyTHK_vNWXHbm4hL5egDs5WfWMG2UWCHrcMDE_rRq-I/exec';

const materialsToLoad = [
    { name: 'Cartón A5', unit: 'Unidad', costPerUnit: 0, quantity: 0, minWarning: 10 },
    { name: 'Cartón B5', unit: 'Unidad', costPerUnit: 0, quantity: 0, minWarning: 10 },
    { name: 'Hojas bond A5 (100gr)', unit: 'Hoja', costPerUnit: 0, quantity: 0, minWarning: 10 },
    { name: 'Hojas bond B5 (120gr)', unit: 'Hoja', costPerUnit: 0, quantity: 0, minWarning: 10 },
    { name: 'Espiral de 16mm', unit: 'Unidad', costPerUnit: 0, quantity: 0, minWarning: 5 },
    { name: 'Espiral de 22mm', unit: 'Unidad', costPerUnit: 0, quantity: 0, minWarning: 5 },
    { name: 'Papel fotográfico adhesivo', unit: 'Hoja', costPerUnit: 0, quantity: 0, minWarning: 10 },
    { name: 'Papel holográfico transparente', unit: 'Hoja', costPerUnit: 0, quantity: 0, minWarning: 10 },
    { name: 'Papel holográfico con diseño', unit: 'Hoja', costPerUnit: 0, quantity: 0, minWarning: 10 },
    { name: 'Elástico', unit: 'Unidad', costPerUnit: 0, quantity: 0, minWarning: 5 },
    { name: 'Pasa elástico con círculo de resina', unit: 'Unidad', costPerUnit: 0, quantity: 0, minWarning: 5 },
    { name: 'Esquineros', unit: 'Unidad', costPerUnit: 0, quantity: 0, minWarning: 20 },
];

async function run() {
    console.log("Creando materiales base...");
    const materialMap = {};
    for (const m of materialsToLoad) {
        const id = crypto.randomUUID();
        materialMap[m.name] = id;

        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'addMaterial',
                data: {
                    id: id,
                    name: m.name,
                    quantity: m.quantity,
                    unit: m.unit,
                    costperunit: m.costPerUnit,
                    minwarning: m.minWarning
                }
            })
        });
        console.log("Material agregado:", m.name);
    }

    const productsToLoad = [
        {
            name: 'Libreta escolar (A5)',
            materials: [
                { materialId: materialMap['Cartón A5'], quantity: 2 },
                { materialId: materialMap['Hojas bond A5 (100gr)'], quantity: 50 },
                { materialId: materialMap['Espiral de 16mm'], quantity: 1 },
                { materialId: materialMap['Papel fotográfico adhesivo'], quantity: 4 },
                { materialId: materialMap['Papel holográfico transparente'], quantity: 2 },
            ]
        },
        {
            name: 'Agenda A5',
            materials: [
                { materialId: materialMap['Cartón A5'], quantity: 2 },
                { materialId: materialMap['Hojas bond A5 (100gr)'], quantity: 100 },
                { materialId: materialMap['Espiral de 22mm'], quantity: 1 },
                { materialId: materialMap['Papel fotográfico adhesivo'], quantity: 4 },
                { materialId: materialMap['Papel holográfico con diseño'], quantity: 2 },
                { materialId: materialMap['Elástico'], quantity: 1 },
            ]
        },
        {
            name: 'Agenda B5',
            materials: [
                { materialId: materialMap['Cartón B5'], quantity: 2 },
                { materialId: materialMap['Hojas bond B5 (120gr)'], quantity: 100 },
                { materialId: materialMap['Espiral de 22mm'], quantity: 1 }, // Default a 22mm, puede cambiar luego a 25.
                { materialId: materialMap['Papel fotográfico adhesivo'], quantity: 4 },
                { materialId: materialMap['Papel holográfico con diseño'], quantity: 2 },
                { materialId: materialMap['Elástico'], quantity: 1 },
                { materialId: materialMap['Pasa elástico con círculo de resina'], quantity: 1 },
                { materialId: materialMap['Esquineros'], quantity: 4 },
            ]
        }
    ];

    console.log("Creando productos base...");
    for (const p of productsToLoad) {
        const id = crypto.randomUUID();
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'addProduct',
                data: {
                    id: id,
                    name: p.name,
                    materials: JSON.stringify(p.materials),
                    productioncost: 0,
                    profitmargin: 70,
                    saleprice: 0
                }
            })
        });
        console.log("Producto agregado:", p.name);
    }

    console.log("HECHO!");
}

run().catch(console.error);
