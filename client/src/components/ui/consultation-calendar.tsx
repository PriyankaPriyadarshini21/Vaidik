import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample consultation data - in a real app, this would be fetched from API
const consultationEvents = [
  { id: 1, title: "Contract Review", date: new Date(2025, 2, 30), time: "14:00", type: "expert" },
  { id: 2, title: "Legal Advisory", date: new Date(2025, 2, 31), time: "10:00", type: "ai" },
  { id: 3, title: "NDA Discussion", date: new Date(2025, 3, 2), time: "15:30", type: "expert" },
  { id: 4, title: "IP Rights Consultation", date: new Date(2025, 3, 5), time: "11:00", type: "expert" },
];

export function ConsultationCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  // Helper function to find consultations on a specific day
  const getConsultationsOnDay = (day: Date | undefined) => {
    if (!day) return [];
    return consultationEvents.filter(
      (event) => 
        event.date.getDate() === day.getDate() && 
        event.date.getMonth() === day.getMonth() && 
        event.date.getFullYear() === day.getFullYear()
    );
  };

  // Get consultations for the selected day
  const selectedDayEvents = getConsultationsOnDay(date);

  return (
    <Card className="border shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="dark:text-white">Upcoming Consultations</CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-0">
          <div className="col-span-1 lg:col-span-4 p-4 border-r border-gray-100 dark:border-gray-700">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
              classNames={{
                day_today: "bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/20 dark:text-blue-400",
                day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white dark:bg-blue-700",
                day: "dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
              }}
              components={{
                DayContent: (props) => {
                  const dayEvents = getConsultationsOnDay(props.date);
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div>{props.date.getDate()}</div>
                      {dayEvents.length > 0 && (
                        <div className="absolute -bottom-1">
                          <div className="flex gap-0.5">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div 
                                key={event.id}
                                className={cn(
                                  "h-1 w-1 rounded-full",
                                  event.type === "expert" ? "bg-orange-500" : "bg-blue-500"
                                )}
                              />
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="h-1 w-1 rounded-full bg-gray-300" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </div>
          
          <div className="col-span-1 lg:col-span-3 p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5 dark:text-white">
              <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              {date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
            </h3>
            
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDayEvents.map((event) => (
                  <div 
                    key={event.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      selectedEvent === event.id 
                        ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30" 
                        : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 dark:border-gray-700 dark:hover:border-blue-800 dark:hover:bg-blue-900/20",
                    )}
                    onClick={() => setSelectedEvent(event.id === selectedEvent ? null : event.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{event.time}</p>
                      </div>
                      <Badge 
                        className={cn(
                          "text-xs font-medium",
                          event.type === "expert" 
                            ? "bg-orange-100 text-orange-800 hover:bg-orange-200 border-transparent dark:bg-orange-900/50 dark:text-orange-300" 
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200 border-transparent dark:bg-blue-900/50 dark:text-blue-300"
                        )}
                      >
                        {event.type === "expert" ? "Expert" : "AI Assistant"}
                      </Badge>
                    </div>
                    
                    {selectedEvent === event.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between gap-2">
                          <Button size="sm" variant="outline" className="w-full text-xs dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                            Reschedule
                          </Button>
                          <Button size="sm" className="w-full text-xs bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                            Join
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-3 mb-3">
                  <CalendarIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No consultations scheduled</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-[200px]">There are no consultations scheduled for this date</p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
                  Schedule Consultation
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}