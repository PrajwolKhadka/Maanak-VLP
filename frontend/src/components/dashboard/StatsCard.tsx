interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
}

export default function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-2">
      <span className="text-2xl">{icon}</span>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}