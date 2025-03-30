import { 
  MessageCircle, 
  Calendar, 
  CheckCircle 
} from "lucide-react";

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
    <div className="grid grid-cols-3 gap-4 mb-6">
      <StatCard 
        label="Active" 
        value={stats.active} 
        icon={<MessageCircle className="h-4 w-4" />} 
        color="bg-blue-50 text-blue-700"
      />
      <StatCard 
        label="Scheduled" 
        value={stats.scheduled} 
        icon={<Calendar className="h-4 w-4" />} 
        color="bg-amber-50 text-amber-700"
      />
      <StatCard 
        label="Completed" 
        value={stats.completed} 
        icon={<CheckCircle className="h-4 w-4" />} 
        color="bg-green-50 text-green-700"
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md ${color}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  );
}