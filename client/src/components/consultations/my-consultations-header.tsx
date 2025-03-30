import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface MyConsultationsHeaderProps {
  onNewAIConsultation: () => void;
  onScheduleWithExpert: () => void;
}

export function MyConsultationsHeader({ 
  onNewAIConsultation, 
  onScheduleWithExpert 
}: MyConsultationsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center rounded-lg bg-black text-white p-6">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="bg-white p-3 rounded-lg shadow-md">
          <MessageSquare className="h-6 w-6 text-black" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Legal Consultations</h2>
          <p className="text-sm text-white/80 max-w-md">
            Access your consultations with AI assistants and legal experts. Continue active conversations or schedule new consultations.
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          onClick={onNewAIConsultation}
          className="bg-white text-black hover:bg-white/90 font-medium shadow-md transition-all duration-200 px-5 py-2 h-auto"
        >
          New AI Consultation
        </Button>
        <Button 
          onClick={onScheduleWithExpert}
          variant="outline"
          className="bg-transparent border-white text-white hover:bg-white/20 font-medium shadow-md transition-all duration-200 px-5 py-2 h-auto"
        >
          Schedule With Expert
        </Button>
      </div>
    </div>
  );
}