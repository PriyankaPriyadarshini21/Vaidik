import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MyConsultationsHeaderProps {
  onNewAIConsultation: () => void;
  onScheduleWithExpert: () => void;
}

export function MyConsultationsHeader({ 
  onNewAIConsultation, 
  onScheduleWithExpert 
}: MyConsultationsHeaderProps) {
  // Current month and year state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Days of the week for the mini calendar
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    // Month is 0-indexed in JS Date
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Get month name
  const getMonthName = (month: number) => {
    return new Date(0, month).toLocaleString('default', { month: 'long' });
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Create calendar grid
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  // Calculate if a day is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };
  
  // Dummy data for consultation dates (in a real app, this would come from the API)
  const consultationDates = [5, 10]; // Example dates with consultations

  return (
    <div className="flex justify-between rounded-lg bg-black text-white p-6">
      <div className="flex items-center gap-4">
        <div className="bg-white p-3 rounded-lg">
          <MessageSquare className="h-6 w-6 text-black" />
        </div>
        <div>
          <h2 className="text-xl font-bold">My Legal Consultations</h2>
          <p className="text-sm text-white/80 max-w-md">
            Access your past and upcoming consultations with AI assistants and legal experts. Continue active conversations or schedule new consultations.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 justify-end">
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
            <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded">March 2025</span>
          </Button>
        </div>
        
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs text-white/70">Next Consultation</div>
            <div className="text-xs text-white/70">In 22 hours</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-white/10">
              <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="Sarah Johnson" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">Consultation with Sarah Johnson</div>
              <div className="flex items-center text-xs text-white/70">
                <span>Tomorrow, 10:00 AM</span>
                <span className="mx-2">•</span>
                <span>March 2025</span>
              </div>
            </div>
            <div className="ml-auto flex">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-white/70 hover:text-white hover:bg-transparent">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-white/70 hover:text-white hover:bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">March 2025</div>
            <div className="flex">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-white/70 hover:text-white hover:bg-transparent">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-white/70 hover:text-white hover:bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Days of week headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {daysOfWeek.map((day, i) => (
              <div key={i} className="text-xs text-center text-white/50 font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Previous month days */}
            <div className="text-xs flex items-center justify-center aspect-square w-6 text-white/30">30</div>
            <div className="text-xs flex items-center justify-center aspect-square w-6 text-white/30">31</div>
            
            {/* Current month days */}
            <div className="text-xs flex items-center justify-center rounded-full aspect-square w-6 text-white bg-white/20">1</div>
            <div className="text-xs flex items-center justify-center aspect-square w-6 text-white">2</div>
            <div className="text-xs flex items-center justify-center aspect-square w-6 text-white">3</div>
            <div className="text-xs flex items-center justify-center aspect-square w-6 text-white">4</div>
            <div className="text-xs flex items-center justify-center aspect-square w-6 text-white bg-white/10">5</div>
            
            <div className="text-xs flex items-center justify-center aspect-square w-6 text-white">6</div>
            <div className="text-xs flex items-center justify-center aspect-square w-6 text-white">7</div>
            <div className="text-xs flex items-center justify-center aspect-square w-6 text-white">8</div>
            <div className="text-xs flex items-center justify-center aspect-square w-6 text-white">9</div>
            <div className="text-xs flex items-center justify-center aspect-square w-6 text-white bg-white/10">10</div>
            <div className="text-xs flex items-center justify-center aspect-square w-6 text-white">11</div>
            <div className="text-xs flex items-center justify-center aspect-square w-6 text-white">12</div>
          </div>
        </div>
      </div>
    </div>
  );
}