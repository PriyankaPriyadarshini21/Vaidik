import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, MessageSquare, MoreHorizontal, Plus, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define consultation type for TypeScript
interface Consultation {
  id: number;
  title: string;
  date: string;
  type: string;
  status: string;
}

// Default data for the consultation activity chart
const defaultActivityData = [
  { name: "AI Consultations", value: 12, color: "#3B82F6" },
  { name: "Expert Consultations", value: 8, color: "#F59E0B" },
  { name: "Document Reviews", value: 15, color: "#10B981" },
];

// Initial consultation data - in a real app, this would come from API
const initialConsultations = [
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
  // State for dialog and form
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);
  const [consultationTitle, setConsultationTitle] = useState("");
  const [consultationType, setConsultationType] = useState("ai");
  const [consultationDetails, setConsultationDetails] = useState("");
  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    // Check if consultations exist in localStorage
    const savedConsultations = localStorage.getItem('consultations');
    return savedConsultations ? JSON.parse(savedConsultations) : initialConsultations;
  });
  const [activityData, setActivityData] = useState(defaultActivityData);
  const { toast } = useToast();
  
  // Save consultations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('consultations', JSON.stringify(consultations));
    
    // Update activity data based on consultations
    const aiCount = consultations.filter(c => c.type === 'ai').length;
    const expertCount = consultations.filter(c => c.type === 'expert').length;
    
    setActivityData([
      { name: "AI Consultations", value: aiCount, color: "#3B82F6" },
      { name: "Expert Consultations", value: expertCount, color: "#F59E0B" },
      { name: "Document Reviews", value: 15, color: "#10B981" },
    ]);
  }, [consultations]);

  // Handle creating a new consultation
  const handleCreateConsultation = () => {
    if (!consultationTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your consultation",
        variant: "destructive"
      });
      return;
    }

    // Create a new consultation
    const newConsultation: Consultation = {
      id: consultations.length + 1,
      title: consultationTitle,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      type: consultationType,
      status: "scheduled"
    };

    // Add the new consultation to the top of the list
    setConsultations([newConsultation, ...consultations]);

    // Close the dialog and reset form
    setShowConsultationDialog(false);
    setConsultationTitle("");
    setConsultationType("ai");
    setConsultationDetails("");

    // Show success message
    toast({
      title: "Consultation Created",
      description: "Your new consultation has been added to your recent consultations.",
    });
  };

  return (
    <div className="space-y-5">
      {/* Consultation Dialog */}
      <Dialog open={showConsultationDialog} onOpenChange={setShowConsultationDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book a New Consultation</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new legal consultation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="consultation-title" className="text-right col-span-1">
                Title
              </Label>
              <Input
                id="consultation-title"
                placeholder="Enter consultation title"
                className="col-span-3"
                value={consultationTitle}
                onChange={(e) => setConsultationTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="consultation-type" className="text-right col-span-1">
                Type
              </Label>
              <Select
                value={consultationType}
                onValueChange={setConsultationType}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select consultation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai">AI Assistant</SelectItem>
                  <SelectItem value="expert">Legal Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="consultation-details" className="text-right col-span-1">
                Details
              </Label>
              <Textarea
                id="consultation-details"
                placeholder="Describe what you need help with..."
                className="col-span-3"
                value={consultationDetails}
                onChange={(e) => setConsultationDetails(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConsultationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateConsultation}>
              Create Consultation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
                  data={activityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                >
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-2">
            {activityData.map((item, index) => (
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
              {consultations.map((consultation) => (
                <div key={consultation.id} className="py-3.5 flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center ${
                      consultation.type === "expert" 
                        ? "bg-orange-100" 
                        : "bg-blue-100"
                    }`}>
                      {consultation.type === "expert" ? (
                        <Users className={`h-4 w-4 text-orange-600`} />
                      ) : (
                        <MessageSquare className={`h-4 w-4 text-blue-600`} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{consultation.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{consultation.date}</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          consultation.status === "scheduled" ? "bg-blue-50 text-blue-700" :
                          consultation.status === "completed" ? "bg-green-50 text-green-700" :
                          "bg-orange-50 text-orange-700"
                        }`}>
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setShowConsultationDialog(true)}
                >
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