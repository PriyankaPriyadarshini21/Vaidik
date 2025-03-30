import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, ChevronRight, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NextConsultationProps {
  id: number;
  title: string;
  time: string;
  date: string;
  type: "ai" | "expert";
  expert?: {
    name: string;
    image?: string;
  };
  isToday: boolean;
}

// Sample data - in a real app, this would come from API
const nextConsultation: NextConsultationProps = {
  id: 1,
  title: "Contract Review Discussion",
  time: "14:00",
  date: "Today, March 30, 2025",
  type: "expert",
  expert: {
    name: "Emily Johnson",
    image: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  isToday: true
};

export function NextConsultation() {
  return (
    <Card className="overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-md dark:from-blue-900/20 dark:to-indigo-900/20 dark:bg-gray-800">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-7">
          {/* Left side - Consultation details */}
          <div className="p-6 md:col-span-3 lg:col-span-5 space-y-4">
            <div className="flex items-center gap-1.5">
              <div className="relative h-1.5 w-1.5 rounded-full bg-green-500">
                <div className="absolute inset-0 h-1.5 w-1.5 rounded-full bg-green-500 animate-ping opacity-75"></div>
              </div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Next scheduled consultation</p>
            </div>
            
            <h2 className="text-xl font-bold tracking-tight dark:text-white">{nextConsultation.title}</h2>
            
            <div className="flex items-start gap-5">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">{nextConsultation.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CalendarClock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">{nextConsultation.date}</span>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all dark:bg-blue-700 dark:hover:bg-blue-800"
                size="sm"
              >
                {nextConsultation.isToday ? "Join Now" : "View Details"}
              </Button>
            </div>
          </div>
          
          {/* Right side - Expert profile or decoration */}
          <div className={cn(
            "relative bg-gradient-to-tr overflow-hidden md:col-span-2 lg:col-span-2",
            nextConsultation.type === "expert" 
              ? "from-orange-100 to-red-50 dark:from-orange-900/30 dark:to-red-900/30" 
              : "from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30"
          )}>
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4F46E5" d="M37.9,-65.6C47.7,-56.3,53.2,-42.5,59.4,-29.5C65.6,-16.4,72.5,-4,71.1,7.5C69.7,19.1,60,29.9,49.4,38.5C38.8,47,27.2,53.2,13.6,58.9C0,64.7,-15.7,69.8,-30.2,67.3C-44.8,64.8,-58.2,54.7,-67.4,41.3C-76.6,27.9,-81.5,11.1,-79.5,-4.6C-77.4,-20.3,-68.3,-35,-56.6,-44.9C-44.9,-54.9,-30.7,-60.1,-17.3,-65.8C-3.9,-71.5,8.6,-77.6,21.8,-76.1C35,-74.5,48.9,-65.4,37.9,-65.6Z" transform="translate(100 100)" />
              </svg>
            </div>
            
            {nextConsultation.type === "expert" && nextConsultation.expert ? (
              <div className="h-full flex flex-col items-center justify-center p-6 relative">
                <div className="rounded-full h-16 w-16 bg-white shadow-md mb-3 overflow-hidden border-2 border-white">
                  {nextConsultation.expert.image ? (
                    <img 
                      src={nextConsultation.expert.image} 
                      alt={nextConsultation.expert.name}
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-blue-100">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{nextConsultation.expert.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Legal Expert</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-0 mt-2 font-medium"
                  >
                    View Profile <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6 relative">
                <div className="rounded-full bg-blue-100 p-8">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}