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
    <div className="flex justify-between rounded-lg bg-black text-white p-6">
      <div className="flex items-center gap-4">
        <div className="bg-white p-3 rounded-lg">
          <MessageSquare className="h-6 w-6 text-black" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Legal Consultations</h2>
          <p className="text-sm text-white/80 max-w-md">
            Access your consultations with AI assistants and legal experts. Continue active conversations or schedule new consultations.
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          onClick={onNewAIConsultation}
          className="bg-white text-black hover:bg-white/90"
        >
          New AI Consultation
        </Button>
        <Button 
          onClick={onScheduleWithExpert}
          variant="outline"
          className="border-white text-white hover:bg-white/10"
        >
          Schedule With Expert
        </Button>
      </div>
    </div>
  );
}