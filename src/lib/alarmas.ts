import { useState, useEffect } from 'react';
import { Alarma } from '@/types/alarmas';

export function muestraAlarmas() {
  const [alarmas, setAlarmas] = useState<Alarma[]>([]);

  const fetchAlarmas = async () => {
    try {
      const res = await fetch('/api/alarmas');
      const data: Alarma[] = await res.json();
      setAlarmas(data);
    } catch (err) {
      console.error('Error al cargar las alarmas:', err);
    }
  };

  useEffect(() => {
    fetchAlarmas();
  }, []);

  return { alarmas, setAlarmas, fetchAlarmas };
}