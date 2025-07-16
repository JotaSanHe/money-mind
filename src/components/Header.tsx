'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-slate-900 text-white py-4 shadow-md">
      <nav className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-lg font-bold tracking-wide">MoneyMind</h1>
        <ul className="flex gap-6 font-medium">
          <li><Link href="/">Dashboard</Link></li>
          <li><Link href="/formulario">Formulario</Link></li>
          <li><Link href="/alarmas">Alarmas</Link></li>
          <li><Link href="/logout">Cerrar sesión</Link></li>
        </ul>
      </nav>
    </header>
  );
}
