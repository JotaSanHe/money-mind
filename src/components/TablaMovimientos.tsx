'use client';

import { useState, useMemo } from 'react';

type Movimiento = {
  _id?: string;
  tipo: 'ingreso' | 'gasto';
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: string;
  esFijo: boolean;
};

interface TablaMovimientosProps {
  movimientos: Movimiento[];
  refetch: () => void;
}

export default function TablaMovimientos({ movimientos, refetch }: TablaMovimientosProps) {
  const [sortBy, setSortBy] = useState<keyof Movimiento>('fecha');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const sortedMovimientos = useMemo(() => {
    return [...movimientos].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'monto') {
        return sortDir === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }

      if (sortBy === 'fecha') {
        return sortDir === 'asc'
          ? new Date(valA as string).getTime() - new Date(valB as string).getTime()
          : new Date(valB as string).getTime() - new Date(valA as string).getTime();
      }

      return sortDir === 'asc'
        ? (valA as string).toString().localeCompare(valB as string)
        : (valB as string).toString().localeCompare(valA as string);
    });
  }, [movimientos, sortBy, sortDir]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedMovimientos.slice(start, start + itemsPerPage);
  }, [sortedMovimientos, currentPage]);

  const toggleSort = (column: keyof Movimiento) => {
    if (column === sortBy) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
    setCurrentPage(1);
  };

  const onDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('¿Eliminar este movimiento?')) return;

    try {
      await fetch(`/api/movimientos/${id}`, { method: 'DELETE' });
      refetch();
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
    }
  };

  const onValidate = async (mov: Movimiento) => {
    if (!mov._id) return;

    try {
      await fetch(`/api/movimientos/${mov._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ esFijo: false })
      });

      const nuevoMov = {
        ...mov,
        fecha: new Date().toISOString().split('T')[0],
        esFijo: true
      };
      delete nuevoMov._id;

      await fetch(`/api/movimientos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoMov)
      });

      refetch();
    } catch (error) {
      console.error('Error al validar movimiento fijo:', error);
    }
  };

  const totalPages = Math.ceil(movimientos.length / itemsPerPage);

  return (
    <div className="mt-8 text-sm">
      <h2 className="text-base font-semibold mb-4 text-blue-700">Movimientos</h2>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-blue-100">
            <tr>
              {['fecha', 'categoria', 'descripcion', 'monto'].map((key) => (
                <th
                  key={key}
                  className="px-2 py-2 cursor-pointer text-left whitespace-nowrap"
                  onClick={() => toggleSort(key as keyof Movimiento)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}{' '}
                  {sortBy === key && (sortDir === 'asc' ? '▲' : '▼')}
                </th>
              ))}
              <th className="px-2 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((mov) => {
              const fecha = new Date(mov.fecha);
              const esMesAnterior =
                (fecha.getMonth() + 1 !== currentMonth || fecha.getFullYear() !== currentYear) &&
                mov.esFijo;

              return (
                <tr
                  key={mov._id}
                  className={`border-t ${esMesAnterior ? 'bg-yellow-50' : 'bg-white'} hover:bg-gray-100`}
                >
                  <td className="px-2 py-2">{fecha.toLocaleDateString()}</td>
                  <td className="px-2 py-2">{mov.categoria}</td>
                  <td className="px-2 py-2">{mov.descripcion}</td>
                  <td className="px-2 py-2 font-semibold">
                    {mov.monto.toFixed(2)} €
                  </td>
                  <td className="px-2 py-2 space-x-1">
                    {esMesAnterior && (
                      <button
                        className="text-green-600 hover:underline"
                        onClick={() => onValidate(mov)}
                      >
                        ✓ Validar
                      </button>
                    )}
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => onDelete(mov._id)}
                    >
                      🗑 Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-2 px-2 py-2 text-xs text-gray-700">
          <div>
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
            {Math.min(currentPage * itemsPerPage, movimientos.length)} de{' '}
            {movimientos.length}
          </div>
          <div className="space-x-2">
            <button
              className="px-2 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ◀ Anterior
            </button>
            <button
              className="px-2 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}