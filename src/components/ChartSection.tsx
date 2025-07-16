import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DatosDashboard } from '@/data/mockData';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const coloresCategorias: Record<string, string> = {
  Ocio: '#FF6347',
  Comida: '#FF9800',
  Vivienda: '#4C6650',
  Transporte: '#2196F3',
  Educacion: '#9C27B0',
  'Salud y Bienestar': '#F44336',
  'Ropa y calzado': '#E91E63',
  Seguros: '#009688',
  Tecnología: '#3F51B5',
  Otros: '#795548'
};

export function ChartSection({ datos }: { datos: DatosDashboard }) {
  const data = {
    labels: datos.esMesActual ? ['Gastos Fijos', 'Ingresos', 'Gastos', 'Previsión'] : ['Ingresos', 'Gastos'],
    datasets: datos.esMesActual
      ? [
          {
            label: 'Gastos Fijos',
            data: [datos.gastosFijos, 0, 0, 0],
            backgroundColor: '#8B4513',
            stack: 'stack1'
          },
          {
            label: 'Ingresos',
            data: [0, datos.ingresos, 0, 0],
            backgroundColor: '#32CD32',
            stack: 'stack2'
          },
          ...datos.gastos.map(g => ({
            label: g.categoria,
            data: [0, 0, g.total, 0],
            backgroundColor: coloresCategorias[g.categoria] || '#795548',
            stack: 'stack3'
          })),
          {
            label: 'Previsión',
            data: [0, 0, 0, datos.prevision],
            backgroundColor: '#CD5C5C',
            stack: 'stack4'
          }
        ]
      : [
          {
            label: 'Ingresos',
            data: [datos.ingresos, 0],
            backgroundColor: '#32CD32',
            stack: 'stackA'
          },
          ...datos.gastos.map(g => ({
            label: g.categoria,
            data: [0, g.total],
            backgroundColor: coloresCategorias[g.categoria] || '#795548',
            stack: 'stackB'
          }))
        ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      }
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `${value}€`
        }
      }
    }
  };

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Gráfico de Ingresos y Gastos</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
