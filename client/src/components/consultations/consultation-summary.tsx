import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, MessageSquare, MoreHorizontal, Plus, Users } from "lucide-react";

// Sample data for the summary - in a real app, this would be fetched from API
const consultationData = [
  { name: "AI Consultations", value: 12, color: "#3B82F6" },
  { name: "Expert Consultations", value: 8, color: "#F59E0B" },
  { name: "Document Reviews", value: 15, color: "#10B981" },
];

const recentConsultations = [
  { 
    id: 1, 
    title: "IP Rights Discussion", 
    date: "March 28, 2025", 
    type: "expert",
    status: "completed"
  },
  { 
    id: 2, 
    title: "Contract Review", 
    date: "March 25, 2025", 
    type: "ai",
    status: "completed"
  },
  { 
    id: 3, 
    title: "Legal Compliance Check", 
    date: "March 23, 2025", 
    type: "ai",
    status: "completed"
  },
  { 
    id: 4, 
    title: "Employment Contract", 
    date: "March 20, 2025", 
    type: "expert",
    status: "completed"
  },
];

export function ConsultationSummary() {
  return (
    <div className="space-y-5">
      {/* Activity Stats Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Consultation Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={consultationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                >
                  {consultationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-2">
            {consultationData.map((item, index) => (
              <div key={index} className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
                <div className="text-xl font-bold" style={{ color: item.color }}>{item.value}</div>
                <div className="text-xs text-gray-500 text-center">{item.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Consultations */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Consultations</CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            View All
          </Button>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <ScrollArea className="h-[300px]">
            <div className="px-6 divide-y">
              {recentConsultations.map((consultation) => (
                <div key={consultation.id} className="py-3.5 flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center ${
                      consultation.type === "expert" 
                        ? "bg-orange-100" 
                        : "bg-blue-100"
                    }`}>
                      {consultation.type === "expert" ? (
                        <Users className={`h-4 w-4 ${consultation.type === "expert" ? "text-orange-600" : "text-blue-600"}`} />
                      ) : (
                        <MessageSquare className={`h-4 w-4 ${consultation.type === "expert" ? "text-orange-600" : "text-blue-600"}`} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{consultation.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{consultation.date}</span>
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                          {consultation.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-gray-100">
                      <FileText className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-gray-100">
                      <MessageCircle className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-gray-100">
                      <MoreHorizontal className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="py-5 flex justify-center">
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                  <Plus className="h-3.5 w-3.5" />
                  New Consultation
                </Button>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}