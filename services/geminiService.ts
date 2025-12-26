
import OpenAI from 'openai';
import { Transaction } from "../types";

let aiInstance: OpenAI | null = null;

const getAI = () => {
  if (aiInstance) return aiInstance;
  const apiKey = (import.meta as any).env.VITE_OPENAI_API_KEY;
  if (!apiKey || apiKey === '') {
    console.warn("OpenAI API Key no configurada.");
    return null;
  }
  aiInstance = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Necesario para calls desde el cliente
  });
  return aiInstance;
};

export const getBusinessInsights = async (transactions: Transaction[], agendasInProgress?: number): Promise<string> => {
  if (transactions.length === 0) return "Registra algunas transacciones para obtener consejos personalizados.";

  const summary = transactions.map(t => `${t.date}: ${t.type} - ${t.amount} (${t.description})`).join('\n');
  const agendasContext = agendasInProgress ? `Actualmente Yessica está confeccionando ${agendasInProgress} agendas con los materiales comprados.` : "";

  const ai = getAI();
  if (!ai) return "Análisis no disponible (API Key de OpenAI faltante).";

  try {
    const response = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un experto consultor de negocios especializado en productos artesanales premium para "Agendes Yeca 2025".
                    CONTEXTO: Precios de mercado $13.000 - $18.000 CLP. No compite por precio bajo, sino por exclusividad.`
        },
        {
          role: 'user',
          content: `Proporciona 3 consejos estratégicos basados en esto:
                    ${agendasContext}
                    DATOS:
                    ${summary}
                    
                    Calcula utilidad esperada, justifica el precio de $18k y sé motivador. Máximo 150 palabras.`
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "No se pudo generar el análisis.";
  } catch (error) {
    console.error("Error fetching insights:", error);
    return "Error al conectar con la inteligencia de OpenAI.";
  }
};

export const generateEmailReport = async (transactions: Transaction[]): Promise<string> => {
  if (transactions.length === 0) return "No hay datos para reportar.";

  const summary = transactions.map(t => `${t.date} | ${t.type} | $${t.amount} | ${t.description} (${t.category})`).join('\n');
  const totalSales = transactions.filter(t => t.type === 'VENTA').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'GASTO').reduce((sum, t) => sum + t.amount, 0);

  const ai = getAI();
  if (!ai) return "Reporte no disponible (API Key faltante).";

  try {
    const response = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente contable profesional para "Agendes Yeca 2025".'
        },
        {
          role: 'user',
          content: `Genera un REPORTE DE NEGOCIO elegante:
                    Ventas: $${totalSales}
                    Gastos: $${totalExpenses}
                    Utilidad: $${totalSales - totalExpenses}
                    DETALLE:
                    ${summary}`
        }
      ],
      temperature: 0.5,
    });

    return response.choices[0].message.content || "Reporte generado para Agendes Yeca 2025.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Error al generar el reporte detallado.";
  }
};
