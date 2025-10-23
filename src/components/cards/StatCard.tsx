interface StatCardProps {
  title: string;
  value: string;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="p-5 rounded-2xl shadow border">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-xs text-gray-500">1 month indicator</p>
    </div>
  );
}
