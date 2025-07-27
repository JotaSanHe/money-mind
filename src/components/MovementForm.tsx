'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function MovementForm() {
  const [type, setType] = useState('gasto');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario enviado');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 p-6 bg-white shadow rounded-xl">
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
        <Select name="category">
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
        <Input name="description" placeholder="Descripción del movimiento" required />
      </div>

      {/* Monto */}
      <div>
        <Label htmlFor="amount">Monto (€)</Label>
        <Input name="amount" type="number" step="0.01" min="0" placeholder="0.00" required />
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

      <Button type="submit" className="w-full">
        ➕ Agregar movimiento
      </Button>
    </form>
  );
}
