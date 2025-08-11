'use client';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import type { ChartData, ChartOptions } from 'chart.js';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Movimiento = {
  categoria: string;
  total: number;
};

type DatosDashboard = {
  ingresos: number;
  gastosFijos: number;
  gastos: Movimiento[];
  prevision: number;
};

// colores fuera del componente para evitar re-renderizados
const coloresCategorias: Record<string, string> = {
  'Ocio': '#FF6347',
  'Comida': '#FF9800',
  'Vivienda': '#4C6650',
  'Transporte': '#2196F3',
  'Educacion': '#9C27B0',
  'Salud y Bienestar': '#F44336',
  'Ropa y calzado': '#E91E63',
  'Seguros': '#009688',
  'Tecnología': '#3F51B5',
  'Otros': '#795548',
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const fechaActual = new Date();
  const mesActual = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}`;
  const [mesSeleccionado, setMesSeleccionado] = useState(mesActual);
  const [datos, setDatos] = useState<DatosDashboard>({
    ingresos: 0,
    gastosFijos: 0,
    gastos: [],
    prevision: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchDatos = async () => {
        try {
          const res = await fetch(`/api/dashboard?mes=${mesSeleccionado}`);
          if (!res.ok) throw new Error('Error al obtener datos');
          const data = await res.json();
          setDatos({
            ingresos: data.ingresos ?? 0,
            gastosFijos: data.gastosFijos ?? 0,
            gastos: data.gastos ?? [],
            prevision: data.prevision ?? 0,
          });
        } catch (error) {
          console.error('Error cargando datos del dashboard', error);
          setDatos({
            ingresos: 0,
            gastosFijos: 0,
            gastos: [],
            prevision: 0,
          });
        }
      };
      fetchDatos();
    }
  }, [mesSeleccionado, status]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-bold text-blue-700">Cargando...</h1>
      </div>
    );
  }

  if (status === 'authenticated') {
    const esMesActual = mesSeleccionado === mesActual;
    const totalGastos = datos.gastos.reduce((sum, g) => sum + g.total, 0);
    const saldo = datos.ingresos - totalGastos - datos.gastosFijos;
    const labels = esMesActual
      ? ['Gastos Fijos', 'Ingresos', 'Gastos', 'Previsión']
      : ['Ingresos', 'Gastos'];

    const datasets = [];
    if (esMesActual) {
      datasets.push(
        {
          label: 'Gastos Fijos',
          data: [datos.gastosFijos, 0, 0, 0],
          backgroundColor: '#8B4513',
          stack: 'stack1',
        },
        {
          label: 'Ingresos',
          data: [0, datos.ingresos, 0, 0],
          backgroundColor: '#32CD32',
          stack: 'stack2',
        },
        ...datos.gastos.map((gasto) => ({
          label: gasto.categoria,
          data: [0, 0, gasto.total, 0],
          backgroundColor: coloresCategorias[gasto.categoria] || '#795548',
          stack: 'stack3',
        })),
        {
          label: 'Previsión',
          data: [0, 0, 0, datos.prevision],
          backgroundColor: '#CD5C5C',
          stack: 'stack4',
        }
      );
    } else {
      datasets.push(
        {
          label: 'Ingresos',
          data: [datos.ingresos, 0],
          backgroundColor: '#32CD32',
          stack: 'stackA',
        },
        ...datos.gastos.map((gasto) => ({
          label: gasto.categoria,
          data: [0, gasto.total],
          backgroundColor: coloresCategorias[gasto.categoria] || '#795548',
          stack: 'stackB',
        }))
      );
    }

    const chartData: ChartData<'bar'> = { labels, datasets };
    const chartOptions: ChartOptions<'bar'> = {
      responsive: true,
      plugins: { legend: { position: 'top' as const } },
      scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
    };

    return (
      <main className="min-h-screen bg-gray-50 text-gray-900 p-8">
        <section className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-10 text-blue-700">
            {session?.user?.name ? `Bienvenido, ${session.user.name}` : 'Cargando...'}
          </h1>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-10">
            <Card title="Ingresos" amount={`${datos.ingresos} €`} type="income" />
            <Card title="Gastos" amount={`${totalGastos + datos.gastosFijos} €`} type="expense" />
            <Card title="Saldo" amount={`${saldo} €`} type="balance" />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Gráfico de Ingresos y Gastos</h2>
              <input
                type="month"
                value={mesSeleccionado}
                max={mesActual}
                onChange={(e) => setMesSeleccionado(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>
            {datos.ingresos === 0 && datos.gastos.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No hay datos para este mes.
              </p>
            ) : (
              <Bar data={chartData} options={chartOptions} height={100} />
            )}
          </div>
        </section>
      </main>
    );
  }

  return null;
}