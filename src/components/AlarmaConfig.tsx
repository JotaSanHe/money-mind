'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

type Alarma = {
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

  const categoriasConAlarma = alarmas.map((a) => a.categoria);
  const categoriasRestantes = categoriasDisponibles.filter((c) => !categoriasConAlarma.includes(c));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoria || !importe) return;

    const nuevaAlarma: Alarma = {
      categoria,
      importe: parseFloat(importe),
    };

    setAlarmas((prev) => [...prev, nuevaAlarma]);
    setCategoria('');
    setImporte('');
  };

  const eliminarAlarma = (cat: string) => {
    if (confirm(`¿Eliminar la alarma para ${cat}?`)) {
      setAlarmas((prev) => prev.filter((a) => a.categoria !== cat));
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-xl font-bold mb-4">Configuración de Alarmas</h1>

      {/* Formulario */}
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

      {/* Lista de alarmas */}
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
                  onClick={() => eliminarAlarma(alarma.categoria)}
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
