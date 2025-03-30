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
    <div className="flex gap-6 mb-6">
      <StatCard 
        label="Active" 
        value={stats.active}
      />
      <StatCard 
        label="Scheduled" 
        value={stats.scheduled}
      />
      <StatCard 
        label="Completed" 
        value={stats.completed}
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex flex-col items-center bg-black/80 rounded-lg py-3 px-6 min-w-[100px]">
      <div className="flex">
        <span className="h-2 w-2 rounded-full bg-white/50 mr-1"></span>
        <span className="text-lg font-bold text-white">{value}</span>
      </div>
      <div className="text-xs text-white/70">{label}</div>
    </div>
  );
}