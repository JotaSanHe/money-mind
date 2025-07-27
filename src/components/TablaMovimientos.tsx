// components/TablaMovimientos.tsx

type Movimiento = {
  tipo: 'ingreso' | 'gasto';
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: string;
  esFijo: boolean;
};

const movimientosFicticios: Movimiento[] = [
  {
    tipo: 'gasto',
    categoria: 'Comida',
    descripcion: 'Cena con amigos',
    monto: 32.5,
    fecha: '2025-07-01',
    esFijo: false,
  },
  {
    tipo: 'ingreso',
    categoria: 'Ingreso',
    descripcion: 'Nómina',
    monto: 1200,
    fecha: '2025-07-01',
    esFijo: false,
  },
  {
    tipo: 'gasto',
    categoria: 'Vivienda',
    descripcion: 'Alquiler',
    monto: 550,
    fecha: '2025-07-01',
    esFijo: true,
  },
];

export default function TablaMovimientos() {
  return (
    <div className="mt-12 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4 text-blue-700">Movimientos recientes</h2>
      <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden text-sm">
        <thead className="bg-blue-100 text-gray-800">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Tipo</th>
            <th className="px-3 py-2 text-left font-semibold">Categoría</th>
            <th className="px-3 py-2 text-left font-semibold">Descripción</th>
            <th className="px-3 py-2 text-left font-semibold">Monto</th>
            <th className="px-3 py-2 text-left font-semibold">Fecha</th>
            <th className="px-3 py-2 text-left font-semibold">Fijo</th>
          </tr>
        </thead>
        <tbody>
          {movimientosFicticios.map((mov, idx) => (
            <tr key={idx} className="odd:bg-white even:bg-gray-50 border-t border-gray-200">
              <td className="px-3 py-2 capitalize text-blue-600">{mov.tipo}</td>
              <td className="px-3 py-2">{mov.categoria}</td>
              <td className="px-3 py-2 text-gray-700">{mov.descripcion}</td>
              <td className="px-3 py-2 font-semibold">{mov.monto.toFixed(2)} €</td>
              <td className="px-3 py-2">{mov.fecha}</td>
              <td className="px-3 py-2 text-center">{mov.esFijo ? '✔️' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
