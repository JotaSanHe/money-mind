'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

type Alarma = {
  _id?: string;
  categoria: string;
  importe: number;
};

const categoriasDisponibles = [
  'Ocio',
  'Comida',
  'Vivienda',
  'Transporte',
  'Educación',
  'Salud y Bienestar',
  'Ropa y calzado',
  'Seguros',
  'Tecnología',
  'Otros',
];

export default function AlarmaConfig() {
  const [alarmas, setAlarmas] = useState<Alarma[]>([]);
  const [categoria, setCategoria] = useState('');
  const [importe, setImporte] = useState('');

  const fetchAlarmas = async () => {
    try {
      const res = await fetch('/api/alarmas');
      const data = await res.json();
      setAlarmas(data);
    } catch (error) {
      console.error('Error al cargar las alarmas:', error);
    }
  };

  useEffect(() => {
    fetchAlarmas();
  }, []);

  const categoriasConAlarma = alarmas.map((a) => a.categoria);
  const categoriasRestantes = categoriasDisponibles.filter((c) => !categoriasConAlarma.includes(c));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoria || !importe) return;

    const nuevaAlarma: Alarma = {
      categoria,
      importe: parseFloat(importe),
    };

    try {
      await fetch('/api/alarmas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaAlarma),
      });
      fetchAlarmas();
      setCategoria('');
      setImporte('');
    } catch (error) {
      console.error('Error al guardar la alarma:', error);
    }
  };

  const eliminarAlarma = async (id?: string) => {
    if (!id) return;
    if (confirm(`¿Eliminar la alarma?`)) {
      try {
        await fetch('/api/alarmas', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        fetchAlarmas();
      } catch (error) {
        console.error('Error al eliminar la alarma:', error);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-xl font-bold mb-4">Configuración de Alarmas</h1>

      <Card className="mb-6">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Nueva Alarma</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Categoría</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasRestantes.length === 0 ? (
                    <SelectItem value="" disabled>No quedan categorías</SelectItem>
                  ) : (
                    categoriasRestantes.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Importe Límite (€)</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={importe}
                onChange={(e) => setImporte(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              ➕ Guardar Alarma
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-base font-semibold mb-2">Tus Alarmas</h3>
        {alarmas.length === 0 ? (
          <p className="text-gray-500">No hay alarmas configuradas.</p>
        ) : (
          <ul className="space-y-2">
            {alarmas.map((alarma) => (
              <li
                key={alarma.categoria}
                className="flex justify-between items-center border rounded px-4 py-2 bg-gray-50"
              >
                <span>
                  <strong>{alarma.categoria}</strong>: {alarma.importe.toFixed(2)} €
                </span>
                <button
                  className="text-red-600 hover:underline text-sm"
                  onClick={() => eliminarAlarma(alarma._id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}