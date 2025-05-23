import { DocumentList } from "@/components/documents/document-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { ArrowRight, LayoutDashboard, File, FileText, Plus, Upload, UserCircle } from "lucide-react";
import { NextConsultation } from "@/components/consultations/next-consultation";
import { ConsultationSummary } from "@/components/consultations/consultation-summary";
import { ConsultationCalendar } from "@/components/ui/consultation-calendar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [mounted, setMounted] = useState(true); // Changed to default true to avoid returning null
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);
  const [consultationTitle, setConsultationTitle] = useState("");
  const [consultationType, setConsultationType] = useState("ai");
  const [consultationDetails, setConsultationDetails] = useState("");
  const consultationSummaryRef = useRef<any>(null);
  const { toast } = useToast();

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

    // Close the dialog and reset form
    setShowConsultationDialog(false);
    
    // Show success message
    toast({
      title: "Consultation Created",
      description: "Your new consultation has been added to your recent consultations.",
    });

    // Reset form
    setConsultationTitle("");
    setConsultationType("ai");
    setConsultationDetails("");
  };

  // This is needed to ensure component only renders client-side to prevent SSR hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render an empty div at minimum
  if (!mounted) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 transition-colors duration-300 dark:bg-gray-900">
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
      
      {/* Top navigation & theme toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-lg shadow-md">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight dark:text-white">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome to your legal workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="dashboard" className="mr-4">
            <TabsList className="grid w-full grid-cols-3 h-9">
              <TabsTrigger value="dashboard" className="text-xs flex items-center gap-1.5">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-xs flex items-center gap-1.5">
                <File className="h-3.5 w-3.5" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-xs flex items-center gap-1.5">
                <UserCircle className="h-3.5 w-3.5" />
                Profile
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <ThemeToggle />
        </div>
      </div>

      {/* Next Consultation Highlight */}
      <NextConsultation />

      {/* System Status */}
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg flex gap-4 items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div className="w-2 h-2 bg-green-500 rounded-full absolute inset-0 animate-ping opacity-75" />
          </div>
          <span className="text-sm dark:text-white">AI System Status: Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-sm dark:text-white">Processing Documents: 2</span>
        </div>
      </div>

      {/* Main Layout: Two-column with consultation summary and calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Consultation Summary */}
        <div className="space-y-6 lg:col-span-2">
          {/* Quick Actions */}
          <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="dark:text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/ai-documents">
                  <Button className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all shadow-sm hover:shadow">
                    <Plus className="h-4 w-4" />
                    New Document
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:border-blue-600 dark:hover:bg-blue-900/30 transition-all"
                  onClick={() => setShowConsultationDialog(true)}
                >
                  <Upload className="h-4 w-4" />
                  Book Consultation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Consultation Summary */}
          <ConsultationSummary />
        </div>

        {/* Right Column - Calendar */}
        <div className="space-y-6 lg:col-span-3">
          <ConsultationCalendar />
          
          {/* Recent Documents */}
          <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="dark:text-white">Recent Documents</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1.5">
                View All 
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="bg-gray-50 dark:bg-gray-800 shadow-none hover:shadow-sm transition-all cursor-pointer border dark:border-gray-700">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm dark:text-white">
                          {i === 0 ? "Employment Contract" : i === 1 ? "NDA Agreement" : "Service Contract"}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Updated {i + 1} day{i > 0 ? "s" : ""} ago</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}