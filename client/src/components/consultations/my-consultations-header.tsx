import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

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
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
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
  const consultationDates = [5, 12, 18, 25]; // Example dates with consultations

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 p-6 bg-gray-50 rounded-lg">
      <div className="space-y-2 flex-1">
        <h2 className="text-2xl font-bold">My Legal Consultations</h2>
        <p className="text-gray-600 max-w-2xl">
          Access your past and upcoming consultations with AI assistants and legal experts. Continue active conversations or schedule new consultations.
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mini Calendar */}
        <div className="hidden md:block bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">
              {getMonthName(currentMonth)} {currentYear}
            </div>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-6 w-6 p-0"
                onClick={goToPreviousMonth}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-6 w-6 p-0"
                onClick={goToNextMonth}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {/* Days of week headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {daysOfWeek.map((day, i) => (
              <div key={i} className="text-xs text-center text-gray-500 font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (day === null) {
                // Empty cell
                return <div key={`empty-${i}`} className="aspect-square" />;
              }
              
              const hasConsultation = consultationDates.includes(day);
              
              return (
                <div 
                  key={`day-${day}`} 
                  className={`
                    text-xs flex items-center justify-center rounded-full 
                    aspect-square w-6 font-medium transition-all
                    ${isToday(day) ? 'bg-black text-white' : ''}
                    ${hasConsultation && !isToday(day) ? 'bg-gray-100 text-black' : ''}
                    ${!hasConsultation && !isToday(day) ? 'text-gray-900 hover:bg-gray-100' : ''}
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>
          
          {/* Next consultation info */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Next consultation:</div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-gray-700" />
              <span className="text-xs font-medium">March 5, 10:00 AM</span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={onNewAIConsultation}
            className="bg-black text-white hover:bg-black/90"
          >
            New AI Consultation
          </Button>
          <Button 
            onClick={onScheduleWithExpert}
            variant="outline"
            className="border-gray-300"
          >
            Schedule With Expert
          </Button>
        </div>
      </div>
    </div>
  );
}