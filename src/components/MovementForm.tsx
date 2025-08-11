'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

type Props = {
  onAdded?: () => void; // para refrescar la tabla
};

export default function MovementForm({ onAdded }: Props) {
  const [type, setType] = useState('gasto');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const nuevoMovimiento = {
      tipo: type,
      categoria: formData.get('category') as string,
      descripcion: formData.get('description') as string,
      monto: parseFloat(formData.get('amount') as string),
      fecha: formData.get('date') as string,
      esFijo: formData.get('es_fijo') === 'on'
    };

    try {
      setLoading(true);
      const res = await fetch('/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoMovimiento)
      });

      if (!res.ok) throw new Error('Error al guardar el movimiento');

      form.reset();
      setType('gasto');

      if (onAdded) onAdded();
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar el movimiento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto space-y-4 p-6 bg-white shadow rounded-xl"
    >
      <h2 className="text-xl font-semibold mb-4">Agregar Movimiento</h2>

      {/* Tipo */}
      <div>
        <Label htmlFor="type">Tipo de movimiento</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ingreso">Ingreso</SelectItem>
            <SelectItem value="gasto">Gasto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categoría */}
      <div>
        <Label htmlFor="category">Categoría</Label>
        <Select name="category" required>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            {type === 'gasto' ? (
              <>
                <SelectItem value="Ocio">Ocio</SelectItem>
                <SelectItem value="Comida">Comida</SelectItem>
                <SelectItem value="Vivienda">Vivienda</SelectItem>
                <SelectItem value="Transporte">Transporte</SelectItem>
                <SelectItem value="Educacion">Educación</SelectItem>
                <SelectItem value="Salud y Bienestar">Salud y Bienestar</SelectItem>
                <SelectItem value="Ropa y calzado">Ropa y calzado</SelectItem>
                <SelectItem value="Seguros">Seguros</SelectItem>
                <SelectItem value="Tecnología">Tecnología</SelectItem>
                <SelectItem value="Otros">Otros</SelectItem>
              </>
            ) : (
              <SelectItem value="Ingreso">Ingreso</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Descripción */}
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Input
          name="description"
          placeholder="Descripción del movimiento"
          required
        />
      </div>

      {/* Monto */}
      <div>
        <Label htmlFor="amount">Monto (€)</Label>
        <Input
          name="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          required
        />
      </div>

      {/* Fecha */}
      <div>
        <Label htmlFor="date">Fecha</Label>
        <Input name="date" type="date" required />
      </div>

      {/* ¿Es fijo? */}
      {type === 'gasto' && (
        <div className="flex items-center gap-2">
          <Checkbox name="es_fijo" id="es_fijo" />
          <Label htmlFor="es_fijo">¿Es un gasto fijo?</Label>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Guardando...' : '➕ Agregar movimiento'}
      </Button>
    </form>
  );
}
