'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    });
    if (!res?.error) {
      router.push('/');
    } else {
      alert(res.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-lg font-bold">Iniciar sesión</h2>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="border p-2 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">Entrar</button>
        <p>
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="text-blue-500 hover:underline">
                Regístrate
            </Link>
        </p>
    </form>
  );
}
