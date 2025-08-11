'use client';

import { useState } from 'react';
import MovementForm from '@/components/MovementForm';
import TablaMovimientos from '@/components/TablaMovimientos';

export default function FormularioPage() {
  // Usamos el estado 'key' para forzar la recarga de la tabla.
  const [key, setKey] = useState(0);

  const handleMovementAdded = () => {
    // Al añadir un movimiento, incrementamos el 'key'.
    // Esto hace que React monte una nueva instancia de TablaMovimientos.
    setKey((prevKey) => prevKey + 1);
  };

  return (
    <main className="py-8 px-4 space-y-8">
      {/* El formulario llama a 'handleMovementAdded' al enviar. */}
      <MovementForm onAdded={handleMovementAdded} />

      {/* La tabla se recargará automáticamente cada vez que 'key' cambie. */}
      <TablaMovimientos key={key} />
    </main>
  );
}