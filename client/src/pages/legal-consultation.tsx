import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { 
  Bot, 
  Calendar as CalendarIcon, 
  Clock, 
  FileText, 
  MessagesSquare, 
  Plus, 
  Send, 
  ShieldCheck, 
  Star, 
  Upload, 
  User, 
  Users,
  Video,
  Paperclip,
  Briefcase,
  BookOpen,
  Clock3,
  XCircle
} from "lucide-react";

// Expert Interface
interface Expert {
  id: number;
  name: string;
  title: string;
  specialization: string;
  rating: number;
  reviews: number;
  rate: string;
  image: string;
  availability: string[];
  availableTimeSlots: {
    day: string;
    slots: string[];
  }[];
  experience: string;
  description: string;
  languages: string[];
}

// Message Interface
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'expert';
  timestamp: Date;
  attachments?: {name: string, url: string}[];
  status?: 'sending' | 'sent' | 'error' | string;
}

// Consultation Interface
interface Consultation {
  id: number;
  expertId?: number;
  expertName?: string;
  date?: string;
  time?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'active';
  type: 'ai' | 'expert' | 'combined';
  topic?: string;
  messages: Message[];
  documents?: {name: string, url: string}[];
  createdAt: Date;
}

// Sample Experts Data
const experts: Expert[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Legal Advisor",
    specialization: "Business Law",
    rating: 4.8,
    reviews: 120,
    rate: "$150/hour",
    image: "https://i.pravatar.cc/150?img=1",
    availability: ["Monday", "Wednesday", "Friday"],
    availableTimeSlots: [
      { day: "Monday", slots: ["9:00 AM", "1:00 PM", "3:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "2:00 PM"] },
      { day: "Friday", slots: ["11:00 AM", "4:00 PM"] }
    ],
    experience: "10+ years",
    description: "Specialized in commercial contracts, mergers & acquisitions, and corporate governance. Advised over 50 startups and established companies on legal compliance and business structuring.",
    languages: ["English", "Spanish"]
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "IP Law Specialist",
    specialization: "Intellectual Property",
    rating: 5.0,
    reviews: 95,
    rate: "$180/hour",
    image: "https://i.pravatar.cc/150?img=2",
    availability: ["Tuesday", "Thursday"],
    availableTimeSlots: [
      { day: "Tuesday", slots: ["8:00 AM", "11:00 AM", "2:00 PM"] },
      { day: "Thursday", slots: ["9:00 AM", "1:00 PM", "5:00 PM"] }
    ],
    experience: "8 years",
    description: "Expert in trademarks, patents, and copyright law. Helped numerous technology companies protect their intellectual property and navigate complex licensing agreements.",
    languages: ["English", "Mandarin"]
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Tax Law Expert",
    specialization: "Tax Law",
    rating: 4.9,
    reviews: 150,
    rate: "$165/hour",
    image: "https://i.pravatar.cc/150?img=3",
    availability: ["Monday", "Tuesday", "Friday"],
    availableTimeSlots: [
      { day: "Monday", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
      { day: "Tuesday", slots: ["9:00 AM", "1:00 PM"] },
      { day: "Friday", slots: ["11:00 AM", "3:00 PM", "5:00 PM"] }
    ],
    experience: "12 years",
    description: "Specializes in corporate taxation, international tax planning, and tax compliance. Former senior tax advisor for a Big Four accounting firm with extensive experience in tax optimization strategies.",
    languages: ["English", "Portuguese", "Spanish"]
  },
  {
    id: 4,
    name: "David Patel",
    title: "Employment Law Specialist",
    specialization: "Employment Law",
    rating: 4.7,
    reviews: 88,
    rate: "$145/hour",
    image: "https://i.pravatar.cc/150?img=4",
    availability: ["Wednesday", "Thursday", "Friday"],
    availableTimeSlots: [
      { day: "Wednesday", slots: ["8:00 AM", "11:00 AM", "3:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "2:00 PM"] },
      { day: "Friday", slots: ["9:00 AM", "1:00 PM", "4:00 PM"] }
    ],
    experience: "9 years",
    description: "Expert in employment contracts, workplace regulations, and handling employment disputes. Provides guidance on HR policies, terminations, and compliance with labor laws.",
    languages: ["English", "Hindi"]
  }
];

// Sample Consultations Data
const sampleConsultations: Consultation[] = [
  {
    id: 1,
    expertId: 1,
    expertName: "Sarah Johnson",
    date: "2025-03-22",
    time: "10:00 AM",
    status: 'completed',
    type: 'expert',
    topic: "Business Contract Review",
    messages: [
      {
        id: "m1",
        content: "Hello, I need help reviewing my business partnership agreement.",
        sender: 'user',
        timestamp: new Date('2025-03-22T10:00:00')
      },
      {
        id: "m2",
        content: "Hello! I'd be happy to review your partnership agreement. Can you share the document and let me know what specific concerns you have?",
        sender: 'expert',
        timestamp: new Date('2025-03-22T10:02:00')
      }
    ],
    documents: [
      {name: "Partnership_Agreement_Draft.pdf", url: "#"}
    ],
    createdAt: new Date('2025-03-20T14:30:00')
  },
  {
    id: 2,
    status: 'active',
    type: 'ai',
    topic: "Trademark Registration Question",
    messages: [
      {
        id: "m1",
        content: "I want to understand the process for trademark registration for my new product.",
        sender: 'user',
        timestamp: new Date('2025-03-25T15:10:00')
      },
      {
        id: "m2",
        content: "Trademark registration typically follows these steps:\n\n1. Conduct a trademark search to ensure your mark is available\n2. Prepare and file a trademark application with the relevant office (e.g., USPTO in the US)\n3. Respond to any office actions or examiner inquiries\n4. Publication for opposition\n5. Registration if no opposition is filed\n\nWould you like more specific information about any of these steps?",
        sender: 'ai',
        timestamp: new Date('2025-03-25T15:11:00')
      }
    ],
    createdAt: new Date('2025-03-25T15:10:00')
  }
];

export default function LegalConsultation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("experts");
  const [category, setCategory] = useState<string>("all");
  const [experienceLevel, setExperienceLevel] = useState<string>("all");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [consultationTopic, setConsultationTopic] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>(sampleConsultations);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiProgress, setAiProgress] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update available time slots when date is selected
  useEffect(() => {
    if (selectedExpert && selectedDate) {
      const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
      setSelectedDay(dayName);
      
      const availableDaySlots = selectedExpert.availableTimeSlots.find(
        item => item.day === dayName
      );
      
      setTimeSlots(availableDaySlots?.slots || []);
    }
  }, [selectedExpert, selectedDate]);

  // Scroll to bottom of messages when a new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConsultation]);

  // Filter experts based on selected filters
  const filteredExperts = experts.filter(expert => {
    if (category !== "all" && expert.specialization !== category) return false;
    // Additional filters could be applied here
    return true;
  });

  // Handle booking a new consultation
  const handleBookConsultation = () => {
    if (!selectedExpert || !selectedDate || !selectedTimeSlot || !consultationTopic) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields",
        variant: "destructive"
      });
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    // Create a new consultation
    const newConsultation: Consultation = {
      id: consultations.length + 1,
      expertId: selectedExpert.id,
      expertName: selectedExpert.name,
      date: formattedDate,
      time: selectedTimeSlot,
      status: 'scheduled',
      type: 'expert',
      topic: consultationTopic,
      messages: [],
      createdAt: new Date()
    };

    // In a real app, this would send data to the API
    // For now, just update the local state
    setConsultations([...consultations, newConsultation]);
    
    toast({
      title: "Consultation Scheduled",
      description: `Your consultation with ${selectedExpert.name} has been scheduled for ${formattedDate} at ${selectedTimeSlot}`,
    });
    
    // Reset selection
    setSelectedExpert(null);
    setConsultationTopic("");
    setSelectedTimeSlot("");
  };

  // Start a new AI consultation
  const startAiConsultation = () => {
    // Create a new AI consultation
    const newAiConsultation: Consultation = {
      id: consultations.length + 1,
      status: 'active',
      type: 'ai',
      messages: [],
      createdAt: new Date()
    };
    
    setConsultations([...consultations, newAiConsultation]);
    setActiveConsultation(newAiConsultation);
    setActiveTab("consultations");
  };

  // Send a message in a consultation
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConsultation) return;
    
    // Create a new message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };
    
    // Add user message to the active consultation
    const updatedConsultation = {
      ...activeConsultation,
      messages: [...activeConsultation.messages, userMessage]
    };
    
    setActiveConsultation(updatedConsultation);
    setNewMessage("");
    
    // Simulate sending message to the API
    setIsLoading(true);
    
    if (activeConsultation.type === 'ai') {
      // Simulate AI progress
      const interval = setInterval(() => {
        setAiProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);
      
      try {
        // In a real app, this would be an API call
        // Simulate AI response after a delay
        setTimeout(() => {
          // AI response
          const aiResponse: Message = {
            id: `msg-${Date.now() + 1}`,
            content: generateAIResponse(newMessage),
            sender: 'ai',
            timestamp: new Date(),
          };
          
          // Update the conversation with AI response
          const finalConsultation = {
            ...updatedConsultation,
            messages: [...updatedConsultation.messages, aiResponse]
          };
          
          setActiveConsultation(finalConsultation);
          
          // Update consultations list
          setConsultations(
            consultations.map(c => 
              c.id === activeConsultation.id ? finalConsultation : c
            )
          );
          
          setIsLoading(false);
          setAiProgress(100);
          
          // Reset progress after a short delay
          setTimeout(() => setAiProgress(0), 500);
          clearInterval(interval);
        }, 2000);
      } catch (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to get a response. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
        clearInterval(interval);
      }
    } else {
      // For expert consultations, just echo the message (in a real app, this would be handled differently)
      setTimeout(() => {
        // Update message status
        const updatedMessages = updatedConsultation.messages.map(msg => 
          msg.id === userMessage.id ? {...msg, status: 'sent'} : msg
        );
        
        const finalConsultation = {
          ...updatedConsultation,
          messages: updatedMessages
        };
        
        setActiveConsultation(finalConsultation);
        
        // Update consultations list
        setConsultations(
          consultations.map(c => 
            c.id === activeConsultation.id ? finalConsultation : c
          )
        );
        
        setIsLoading(false);
      }, 1000);
    }
  };

  // Generate a simple AI response (in a real app, this would come from the API)
  const generateAIResponse = (query: string): string => {
    if (query.toLowerCase().includes('contract')) {
      return "To review your contract effectively, I'd need more details about what type of contract it is. The key elements to focus on in most contracts include: party identification, obligations of each party, payment terms, termination conditions, and dispute resolution mechanisms. Would you like me to elaborate on any specific part of contract review?";
    } else if (query.toLowerCase().includes('trademark') || query.toLowerCase().includes('copyright')) {
      return "Intellectual property protection is essential for businesses. Trademarks protect brand identifiers like names and logos, while copyrights protect creative works. The registration process varies by country, but generally involves application, examination, and registration phases. What specific aspect of IP protection are you interested in?";
    } else if (query.toLowerCase().includes('business') || query.toLowerCase().includes('company')) {
      return "When setting up a business, you'll need to consider the legal structure (LLC, corporation, partnership, etc.), regulatory compliance, tax obligations, employment laws, and contractual relationships. Each of these aspects has different implications for liability and taxation. Could you tell me more about your business so I can provide more targeted guidance?";
    } else {
      return "Thank you for your legal question. To provide you with the most accurate information, I'd need a few more details about your specific situation. Could you tell me more about the context and your specific concerns?";
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Legal Consultation</h1>
          <p className="text-muted-foreground max-w-3xl">
            Get expert legal advice through AI-powered consultations or schedule sessions with verified legal professionals. Our platform offers personalized guidance for your legal needs.
          </p>
        </div>
        <div className="absolute -right-10 -top-8 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-8 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="grid grid-cols-3 w-[450px] p-1 shadow-sm bg-muted/40">
            <TabsTrigger value="experts" className="gap-2 data-[state=active]:shadow-sm">
              <Users className="h-4 w-4" />
              <span className="font-medium">Expert Advisors</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2 data-[state=active]:shadow-sm">
              <Bot className="h-4 w-4" />
              <span className="font-medium">AI Consultation</span>
            </TabsTrigger>
            <TabsTrigger value="consultations" className="gap-2 data-[state=active]:shadow-sm">
              <MessagesSquare className="h-4 w-4" />
              <span className="font-medium">My Consultations</span>
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "experts" && (
            <div className="flex gap-4">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Business Law">Business Law</SelectItem>
                  <SelectItem value="Intellectual Property">Intellectual Property</SelectItem>
                  <SelectItem value="Tax Law">Tax Law</SelectItem>
                  <SelectItem value="Employment Law">Employment Law</SelectItem>
                </SelectContent>
              </Select>

              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                  <SelectItem value="mid">Mid-Level (4-7 years)</SelectItem>
                  <SelectItem value="senior">Senior (8+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <TabsContent value="experts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert) => (
              <Card key={expert.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border border-primary/10">
                      <AvatarImage src={expert.image} alt={expert.name} />
                      <AvatarFallback>{expert.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <CardTitle className="text-base">{expert.name}</CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {expert.title} • {expert.experience}
                      </CardDescription>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-medium">{expert.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({expert.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                      <BookOpen className="h-3.5 w-3.5" />
                      {expert.specialization}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {expert.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Available: {expert.availability.join(", ")}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {expert.languages.map(lang => (
                        <Badge key={lang} variant="outline" className="text-xs font-normal">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm font-medium mt-1">{expert.rate}</p>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedExpert(expert)}
                      >
                        Schedule Consultation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Schedule Consultation with {selectedExpert?.name}</DialogTitle>
                        <DialogDescription>
                          Fill in the details below to book your legal consultation
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-6 py-4">
                        <div className="grid gap-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-14 w-14 border">
                              <AvatarImage src={selectedExpert?.image} alt={selectedExpert?.name} />
                              <AvatarFallback>{selectedExpert?.name?.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{selectedExpert?.name}</h3>
                              <p className="text-sm text-muted-foreground">{selectedExpert?.title}</p>
                              <p className="text-sm text-primary">{selectedExpert?.specialization}</p>
                              <p className="text-sm">{selectedExpert?.rate}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Consultation Topic</label>
                          <Input 
                            placeholder="e.g., Contract Review, Legal Advice for Startup" 
                            value={consultationTopic}
                            onChange={(e) => setConsultationTopic(e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Select Date</label>
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              className="rounded-md border p-3 mx-auto"
                              disabled={(date) => {
                                const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                                return !selectedExpert?.availability.includes(day);
                              }}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Available Time Slots ({selectedDay})</label>
                            {timeSlots.length > 0 ? (
                              <div className="grid grid-cols-1 gap-2 h-[220px] overflow-y-auto p-2">
                                {timeSlots.map((slot) => (
                                  <Button 
                                    key={slot} 
                                    variant={selectedTimeSlot === slot ? "default" : "outline"} 
                                    className="w-full justify-start"
                                    onClick={() => setSelectedTimeSlot(slot)}
                                  >
                                    <Clock className="mr-2 h-4 w-4" />
                                    {slot}
                                  </Button>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-[220px] border rounded-md">
                                <p className="text-sm text-muted-foreground">
                                  Please select a date to see available time slots
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Upload Documents (Optional)</label>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" className="flex-1">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Files
                            </Button>
                            <Button variant="outline">
                              <Paperclip className="mr-2 h-4 w-4" />
                              Attach from Documents
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            You can upload relevant documents for review before the consultation
                          </p>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedExpert(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleBookConsultation}>
                          Confirm Booking
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Legal Assistant Card */}
            <Card className="md:col-span-2 overflow-hidden relative border-primary/10">
              <div className="absolute -right-24 -top-24 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>
              <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>
              
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-primary to-primary/80 p-3 rounded-lg shadow-md">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">AI Legal Assistant</CardTitle>
                    <CardDescription className="text-sm">
                      Get instant legal guidance and document analysis from our AI assistant
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center p-5 border rounded-lg hover:border-primary/30 hover:bg-muted/30 transition-all group">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-all">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">Document Analysis</h3>
                    <p className="text-xs text-muted-foreground">
                      Upload and analyze legal documents instantly
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-5 border rounded-lg hover:border-primary/30 hover:bg-muted/30 transition-all group">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-all">
                      <MessagesSquare className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">Legal Q&A</h3>
                    <p className="text-xs text-muted-foreground">
                      Ask questions and get immediate legal insights
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-5 border rounded-lg hover:border-primary/30 hover:bg-muted/30 transition-all group">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-all">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">Private & Secure</h3>
                    <p className="text-xs text-muted-foreground">
                      Your information is encrypted and confidential
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center pt-3">
                  <Button 
                    onClick={startAiConsultation} 
                    size="lg" 
                    className="gap-2 px-8 py-6 shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-primary/90"
                  >
                    <Bot className="h-5 w-5" />
                    Start AI Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* FAQ Section */}
            <Card className="border-muted/50 hover:border-primary/20 transition-colors">
              <CardHeader className="pb-3 border-b border-muted/30">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2 p-3 border border-transparent hover:border-muted/60 hover:bg-muted/5 rounded-lg transition-all">
                  <h3 className="font-medium text-sm flex items-center gap-1.5">
                    <span className="text-primary">•</span>
                    What legal topics can the AI assistant help with?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI can assist with business law, contracts, intellectual property, employment law, and many other legal areas. It provides guidance but not legal representation.
                  </p>
                </div>
                <div className="space-y-2 p-3 border border-transparent hover:border-muted/60 hover:bg-muted/5 rounded-lg transition-all">
                  <h3 className="font-medium text-sm flex items-center gap-1.5">
                    <span className="text-primary">•</span>
                    How accurate is the AI legal advice?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The AI provides general information based on legal principles. For specific legal advice tailored to your situation, we recommend consulting with our human experts.
                  </p>
                </div>
                <div className="space-y-2 p-3 border border-transparent hover:border-muted/60 hover:bg-muted/5 rounded-lg transition-all">
                  <h3 className="font-medium text-sm flex items-center gap-1.5">
                    <span className="text-primary">•</span>
                    Is my information confidential?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, all conversations and documents shared with our AI are encrypted and kept confidential in accordance with our privacy policy.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonials */}
            <Card className="border-muted/50 hover:border-primary/20 transition-colors">
              <CardHeader className="pb-3 border-b border-muted/30">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  What Users Say
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="p-3 border border-transparent hover:border-muted/60 bg-muted/5 rounded-lg transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">John Doe</p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative pl-2 border-l-2 border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      "The AI assistant helped me understand my contract terms quickly. I followed up with an expert consultation for detailed advice."
                    </p>
                  </div>
                </div>
                
                <div className="p-3 border border-transparent hover:border-muted/60 bg-muted/5 rounded-lg transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarFallback className="bg-primary/10 text-primary">AS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Amy Smith</p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative pl-2 border-l-2 border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      "Being able to chat with the AI about my legal questions saved me time and money before hiring a lawyer."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="consultations" className="space-y-6">
          {activeConsultation ? (
            <div className="grid grid-cols-1 gap-4">
              <Card className="overflow-hidden shadow-sm border-primary/10">
                <CardHeader className="pb-3 flex flex-row items-center justify-between border-b bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${activeConsultation.type === 'ai' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                      {activeConsultation.type === 'ai' ? (
                        <Bot className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5 text-secondary" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {activeConsultation.type === 'ai' ? 'AI Legal Consultation' : `Consultation with ${activeConsultation.expertName}`}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1.5">
                        <span className="inline-flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          {activeConsultation.topic || 'Legal Consultation'}
                        </span>
                        {activeConsultation.type === 'expert' && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(activeConsultation.date || '').toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {activeConsultation.time}
                            </span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setActiveConsultation(null)}
                    className="rounded-full hover:bg-muted"
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[450px] flex flex-col relative">
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-muted/20 to-transparent opacity-60 h-8 z-10"></div>
                    <div className="flex-1 p-4 overflow-y-auto">
                      {activeConsultation.messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex mb-6 ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          } group`}
                        >
                          {message.sender !== 'user' && (
                            <div className="mr-2 mt-1">
                              {message.sender === 'ai' ? (
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Bot className="h-4 w-4 text-primary" />
                                </div>
                              ) : (
                                <Avatar className="h-8 w-8 border-2 border-primary/10">
                                  <AvatarImage src={experts.find(e => e.name === activeConsultation.expertName)?.image} />
                                  <AvatarFallback className="bg-secondary/10 text-secondary">{activeConsultation.expertName?.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          )}
                          
                          <div 
                            className={`max-w-[75%] rounded-2xl p-3.5 shadow-sm ${
                              message.sender === 'user' 
                                ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground' 
                                : message.sender === 'ai'
                                  ? 'bg-muted/70 border'
                                  : 'bg-secondary/10'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-medium">
                                {message.sender === 'user' 
                                  ? 'You' 
                                  : message.sender === 'ai' 
                                    ? 'AI Legal Assistant' 
                                    : activeConsultation.expertName
                                }
                              </span>
                              <span className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: '2-digit', 
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="whitespace-pre-line text-sm">
                              {message.content}
                            </div>
                            {message.status === 'sending' && (
                              <div className="text-xs opacity-70 mt-1 text-right">
                                Sending...
                              </div>
                            )}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-3 space-y-1.5">
                                {message.attachments.map((attachment, index) => (
                                  <div 
                                    key={index} 
                                    className="flex items-center gap-2 text-xs p-2 rounded bg-background/50 border border-muted hover:border-primary/20 transition-colors cursor-pointer"
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                    <span className="flex-1 truncate">{attachment.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {message.sender === 'user' && (
                            <div className="ml-2 mt-1">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && activeConsultation.type === 'ai' && (
                        <div className="flex justify-start mb-4">
                          <div className="mr-2 mt-1">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                          <div className="max-w-[75%] rounded-2xl p-3.5 bg-muted/70 border shadow-sm">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-medium">AI Legal Assistant</span>
                              <span className="text-xs opacity-70">
                                {new Date().toLocaleTimeString([], {
                                  hour: '2-digit', 
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 h-8">
                              <div className="flex gap-1">
                                <div className="bg-primary/20 h-2 w-2 rounded-full animate-pulse"></div>
                                <div className="bg-primary/30 h-2 w-2 rounded-full animate-pulse delay-150"></div>
                                <div className="bg-primary/40 h-2 w-2 rounded-full animate-pulse delay-300"></div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                Processing your legal question...
                              </span>
                            </div>
                            {aiProgress > 0 && (
                              <div className="mt-2 space-y-1.5">
                                <Progress value={aiProgress} className="h-1.5 rounded-full bg-primary/10" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                                    Analyzing legal context
                                  </span>
                                  <span>{aiProgress}%</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t bg-muted/30">
                      <div className="flex gap-3">
                        <Textarea 
                          placeholder="Type your legal question..." 
                          className="min-h-[50px] px-4 py-3 resize-none rounded-xl border-muted bg-background focus-visible:ring-primary"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                        />
                        <div className="flex flex-col gap-2">
                          <Button 
                            onClick={sendMessage} 
                            disabled={!newMessage.trim() || isLoading}
                            size="icon"
                            className={`rounded-xl ${!newMessage.trim() || isLoading ? '' : 'bg-primary hover:bg-primary/90'}`}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="rounded-xl border-muted">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {activeConsultation.type === 'ai' && (
                        <div className="mt-2 text-xs text-center text-muted-foreground">
                          AI responses are generated based on legal knowledge but should not replace professional legal advice
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              <div className="bg-muted/20 p-6 rounded-lg border border-muted/30 mb-6 relative overflow-hidden">
                <div className="absolute -right-24 -top-16 w-64 h-48 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -left-24 -bottom-16 w-64 h-48 bg-primary/5 rounded-full blur-3xl"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
                      <MessagesSquare className="h-5 w-5 text-primary" />
                      My Legal Consultations
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-xl">
                      Access your past and upcoming consultations with AI assistants and legal experts. Continue active conversations or schedule new consultations.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={startAiConsultation} 
                      className="gap-2 shadow-sm bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90"
                    >
                      <Bot className="h-4 w-4" />
                      New AI Consultation
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2 bg-background shadow-sm border-primary/20 hover:border-primary/30">
                          <Calendar className="h-4 w-4" />
                          Schedule With Expert
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="text-xl flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Select Legal Expert
                          </DialogTitle>
                          <DialogDescription>
                            Choose a legal professional to schedule a personalized consultation
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {experts.map((expert) => (
                            <Button 
                              key={expert.id} 
                              variant="outline" 
                              className="justify-start h-auto p-3 hover:border-primary/30 hover:bg-muted/30 transition-all"
                              onClick={() => {
                                setSelectedExpert(expert);
                                setActiveTab("experts");
                              }}
                            >
                              <Avatar className="h-10 w-10 mr-3 border border-primary/10">
                                <AvatarImage src={expert.image} alt={expert.name} />
                                <AvatarFallback className="bg-primary/10 text-primary">{expert.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="text-left">
                                <p className="font-medium">{expert.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="text-primary">{expert.specialization}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    {expert.rating}
                                  </span>
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              {consultations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg bg-muted/10">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <MessagesSquare className="h-8 w-8 text-primary/70" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No consultations yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    You haven't started any legal consultations. Begin with an AI consultation for instant assistance or schedule time with a legal expert.
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={startAiConsultation} className="gap-2">
                      <Bot className="h-4 w-4" />
                      Start AI Consultation
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {consultations.map((consultation) => (
                    <Card 
                      key={consultation.id} 
                      className={`overflow-hidden transition-all hover:shadow-md ${
                        consultation.status === 'active' 
                          ? 'border-primary/30' 
                          : consultation.status === 'scheduled' 
                            ? 'border-blue-200/70'
                            : 'border-muted/50'
                      }`}
                    >
                      <CardHeader className="pb-3 border-b border-muted/30">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            {consultation.type === 'ai' ? (
                              <div className="bg-gradient-to-br from-primary/90 to-primary/70 p-2 rounded-lg shadow-sm">
                                <Bot className="h-5 w-5 text-white" />
                              </div>
                            ) : (
                              <Avatar className="h-10 w-10 border-2 border-primary/10">
                                <AvatarImage 
                                  src={experts.find(e => e.id === consultation.expertId)?.image} 
                                  alt={consultation.expertName} 
                                />
                                <AvatarFallback className="bg-secondary/10 text-secondary">{consultation.expertName?.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <CardTitle className="text-base">
                                {consultation.type === 'ai' ? 'AI Legal Assistant' : `Consultation with ${consultation.expertName}`}
                              </CardTitle>
                              <CardDescription className="text-xs flex items-center gap-1.5">
                                <FileText className="h-3 w-3" />
                                {consultation.topic || 'Legal Consultation'}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant="outline"
                            className={`
                              ${consultation.status === 'active' ? 'bg-green-500/10 text-green-600 border-green-200' : ''}
                              ${consultation.status === 'scheduled' ? 'bg-blue-500/10 text-blue-600 border-blue-200' : ''}
                              ${consultation.status === 'completed' ? 'bg-muted text-muted-foreground' : ''}
                              ${consultation.status === 'cancelled' ? 'bg-red-500/10 text-red-600 border-red-200' : ''}
                            `}
                          >
                            {consultation.status === 'active' && (
                              <span className="flex items-center gap-1">
                                <span className="relative flex h-2 w-2 mr-0.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Active
                              </span>
                            )}
                            {consultation.status !== 'active' && consultation.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex flex-wrap gap-3">
                          {consultation.type === 'expert' && (
                            <div className="flex items-center gap-1.5 text-xs px-2 py-1 bg-muted/30 rounded-full">
                              <CalendarIcon className="h-3.5 w-3.5 text-primary/70" />
                              <span>
                                {new Date(consultation.date || '').toLocaleDateString()} at {consultation.time}
                              </span>
                            </div>
                          )}
                          
                          {consultation.documents && consultation.documents.length > 0 && (
                            <div className="flex items-center gap-1.5 text-xs px-2 py-1 bg-muted/30 rounded-full">
                              <FileText className="h-3.5 w-3.5 text-primary/70" />
                              <span>
                                {consultation.documents.length} document{consultation.documents.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1.5 text-xs px-2 py-1 bg-muted/30 rounded-full">
                            <Clock className="h-3.5 w-3.5 text-primary/70" />
                            <span>
                              {new Date(consultation.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-3 bg-muted/10 max-h-20 overflow-hidden relative">
                          <div className="flex items-start gap-2 mb-1">
                            <div className="min-w-fit mt-0.5">
                              {consultation.messages.length > 0 && consultation.messages[consultation.messages.length - 1].sender === 'user' ? (
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                              ) : (
                                <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {consultation.messages.length > 0 
                                  ? consultation.messages[consultation.messages.length - 1].content.substring(0, 150) + 
                                    (consultation.messages[consultation.messages.length - 1].content.length > 150 ? '...' : '')
                                  : 'No messages yet'
                                }
                              </p>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/90 to-transparent" />
                        </div>
                      </CardContent>
                      <CardFooter className="px-4 pb-4 pt-1">
                        <Button 
                          className="w-full shadow-sm transition-all" 
                          variant={consultation.status === 'active' ? "default" : "outline"}
                          onClick={() => setActiveConsultation(consultation)}
                        >
                          {consultation.status === 'active' ? (
                            <>
                              <MessagesSquare className="mr-2 h-4 w-4" />
                              Continue Consultation
                            </>
                          ) : consultation.status === 'scheduled' ? (
                            <>
                              <Video className="mr-2 h-4 w-4" />
                              Join Meeting
                            </>
                          ) : (
                            <>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}