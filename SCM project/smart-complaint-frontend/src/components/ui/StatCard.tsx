import { LucideIcon } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl shadow-md bg-white hover:shadow-xl transition">
      <div>
        <p className="text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="text-white" />
      </div>
    </div>
  );
}