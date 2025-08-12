'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Movimiento } from '@/types/movimientos';
import { Alarma } from '@/types/alarmas';

interface Props {
  movimientos: Movimiento[];
  alarmas: Alarma[];
}

export default function AlarmaDisplay({ movimientos, alarmas }: Props) {
  const gastosPorCategoria = useMemo(() => {
    return movimientos.reduce((acc, mov) => {
      if (mov.tipo === 'gasto') {
        const currentAmount = acc[mov.categoria] || 0;
        acc[mov.categoria] = currentAmount + mov.monto;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [movimientos]);

  const alarmasSuperadas = useMemo(() => {
    return alarmas.filter((alarma) => {
      const gastoTotal = gastosPorCategoria[alarma.categoria] || 0;
      return gastoTotal > alarma.importe;
    });
  }, [alarmas, gastosPorCategoria]);

  if (alarmasSuperadas.length === 0) {
    return null;
  }

  return (
    <Card className="border-l-4 border-red-500 bg-red-50">
      <CardContent className="p-4">
        <h3 className="font-bold text-red-700">🚨 ¡Alarmas superadas!</h3>
        <ul className="mt-2 space-y-1 text-sm text-red-600">
          {alarmasSuperadas.map((alarma) => (
            <li key={alarma.categoria}>
              Has superado el límite de **{alarma.importe.toFixed(2)} €** para la categoría de **{alarma.categoria}**.
              (Gasto actual: {gastosPorCategoria[alarma.categoria]?.toFixed(2) || '0.00'} €)
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}