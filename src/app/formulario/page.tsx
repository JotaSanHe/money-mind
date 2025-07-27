import MovementForm from '@/components/MovementForm';
import TablaMovimientos from '@/components/TablaMovimientos';

export default function FormularioPage() {
  return (
    <main className="py-8 px-4">
      <MovementForm />
      <TablaMovimientos />
    </main>
  );
}
