interface ConsultationStats {
  active: number;
  scheduled: number;
  completed: number;
}

interface ConsultationStatsProps {
  stats: ConsultationStats;
}

export function ConsultationStats({ stats }: ConsultationStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6 max-w-md">
      <StatCard 
        label="Active" 
        value={stats.active}
        color="bg-blue-600"
      />
      <StatCard 
        label="Scheduled" 
        value={stats.scheduled}
        color="bg-orange-600"
      />
      <StatCard 
        label="Completed" 
        value={stats.completed}
        color="bg-green-600"
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="flex flex-col items-center bg-white rounded-lg py-3 px-2 shadow-sm border border-gray-100">
      <div className="flex items-center justify-center">
        <span className={`h-2 w-2 rounded-full ${color} mr-1`}></span>
        <span className="text-xl font-bold text-gray-800">{value}</span>
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}