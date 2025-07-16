import { Movimiento } from '@/data/mockData';

export function ExpenseList({ gastos }: { gastos: Movimiento[] }) {
  return (
    <div className="mt-6 bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2">Gastos por Categoría</h3>
      {gastos.length === 0 ? (
        <p>No hay gastos registrados este mes</p>
      ) : (
        <ul className="space-y-1">
          {gastos
            .sort((a, b) => b.total - a.total)
            .map((gasto, idx) => (
              <li key={idx} className="flex justify-between text-sm">
                <span>{gasto.categoria}</span>
                <span>{gasto.total.toFixed(2)}€</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
