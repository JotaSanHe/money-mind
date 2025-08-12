'use client';

import { useState, useEffect } from 'react';
import MovementForm from '@/components/MovementForm';
import TablaMovimientos from '@/components/TablaMovimientos';
import AlarmaDisplay from '@/components/AlarmDisplay';
import { muestraAlarmas } from '@/lib/alarmas';
import { Movimiento } from '@/types/movimientos';

export default function FormularioPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const { alarmas } = muestraAlarmas();

  const fetchMovimientos = async () => {
    try {
      const res = await fetch('/api/movimientos');
      const data: Movimiento[] = await res.json();
      setMovimientos(data);
    } catch (err) {
      console.error('Error cargando movimientos:', err);
    }
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const handleMovementAdded = () => {
    fetchMovimientos();
  };

  return (
    <main className="py-8 px-4 space-y-8">
      <MovementForm onAdded={handleMovementAdded} />
      <AlarmaDisplay movimientos={movimientos} alarmas={alarmas} />
      <TablaMovimientos movimientos={movimientos} refetch={handleMovementAdded} />
    </main>
  );
}