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
import { useState } from 'react';
import Card from '@/components/Card';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const fakeDataPorMes: Record<string, {
  ingresos: number;
  gastosFijos: number;
  gastos: { categoria: string; total: number }[];
  prevision: number;
}> = {
  '2025-07': {
    ingresos: 1200,
    gastosFijos: 300,
    gastos: [
      { categoria: 'Comida', total: 200 },
      { categoria: 'Vivienda', total: 150 },
      { categoria: 'Transporte', total: 100 },
      { categoria: 'Ocio', total: 50 },
    ],
    prevision: 600,
  },
  '2025-06': {
    ingresos: 1000,
    gastosFijos: 250,
    gastos: [
      { categoria: 'Comida', total: 180 },
      { categoria: 'Vivienda', total: 140 },
      { categoria: 'Transporte', total: 90 },
    ],
    prevision: 580,
  },
};

export default function HomePage() {
  const fechaActual = new Date();
  const mesActual = fechaActual.toISOString().slice(0, 7);

  const [mesSeleccionado, setMesSeleccionado] = useState(mesActual);
  const datos = fakeDataPorMes[mesSeleccionado] || fakeDataPorMes[mesActual];

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
        categoryPercentage: 1.0,
        barPercentage: 0.9
      },
      {
        label: 'Ingresos',
        data: [0, datos.ingresos, 0, 0],
        backgroundColor: '#32CD32',
        stack: 'stack2',
        categoryPercentage: 1.0,
        barPercentage: 0.9
      },
      ...datos.gastos.map(gasto => ({
        label: gasto.categoria,
        data: [0, 0, gasto.total, 0],
        backgroundColor: coloresCategorias[gasto.categoria] || '#795548',
        stack: 'stack3',
        categoryPercentage: 1.0,
        barPercentage: 0.9
      })),
      {
        label: 'Previsión',
        data: [0, 0, 0, datos.prevision],
        backgroundColor: '#CD5C5C',
        stack: 'stack4',
        categoryPercentage: 1.0,
        barPercentage: 0.9
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
      ...datos.gastos.map(gasto => ({
        label: gasto.categoria,
        data: [0, gasto.total],
        backgroundColor: coloresCategorias[gasto.categoria] || '#795548',
        stack: 'stackB',
      }))
    );
  }

  const chartData: ChartData<'bar'> = {
    labels,
    datasets,
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: function (value: string | number) {
            return `${value}€`;
          },
        },
      },
    },
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <section className="max-w-6xl mx-auto">
        {/*
        Utilizar el username de la sesión para personalizar el saludo.
        A implementar
        */}
        <h1 className="text-4xl font-bold mb-10 text-blue-700">
          
          Bienvenido, Jota
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
              onChange={e => setMesSeleccionado(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <Bar data={chartData} options={chartOptions} height={100} />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Gastos por Categoría</h2>
          <ul className="space-y-2">
            {datos.gastos.map((gasto, i) => (
              <li key={i} className="flex justify-between text-gray-700">
                <span>{gasto.categoria}</span>
                <span>{gasto.total.toFixed(2)} €</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

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
