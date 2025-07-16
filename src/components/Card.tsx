type CardProps = {
  title: string;
  amount: string;
  type?: "income" | "expense" | "balance";
};

export default function Card({ title, amount, type }: CardProps) {
  const color =
    type === "income"
      ? "text-green-600"
      : type === "expense"
      ? "text-red-600"
      : "text-blue-600";

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 transition hover:shadow-2xl">
      <h2 className="text-sm text-gray-500 uppercase tracking-wider">
        {title}
      </h2>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{amount}</p>
    </div>
  );
}
