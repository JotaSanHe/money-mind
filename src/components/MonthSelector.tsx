export function MonthSelector({
  value,
  onChange
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="mb-4">
      <input
        type="month"
        className="border p-2 rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        max={new Date().toISOString().slice(0, 7)}
      />
    </div>
  );
}
