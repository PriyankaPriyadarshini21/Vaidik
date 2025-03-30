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
      <div>
        <h1 className="text-2xl font-semibold mb-2">Legal Consultation</h1>
        <p className="text-muted-foreground">
          Get expert legal advice through AI-powered consultations or schedule sessions with verified legal professionals
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="experts">
              <Users className="mr-2 h-4 w-4" />
              Expert Advisors
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Bot className="mr-2 h-4 w-4" />
              AI Consultation
            </TabsTrigger>
            <TabsTrigger value="consultations">
              <MessagesSquare className="mr-2 h-4 w-4" />
              My Consultations
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
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>AI Legal Assistant</CardTitle>
                    <CardDescription>
                      Get instant legal guidance and document analysis from our AI assistant
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm">Document Analysis</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload and analyze legal documents instantly
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                      <MessagesSquare className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm">Legal Q&A</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ask questions and get immediate legal insights
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm">Private & Secure</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your information is encrypted and confidential
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center pt-2">
                  <Button onClick={startAiConsultation} size="lg" className="gap-2">
                    <Bot className="h-5 w-5" />
                    Start AI Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">What legal topics can the AI assistant help with?</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI can assist with business law, contracts, intellectual property, employment law, and many other legal areas. It provides guidance but not legal representation.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">How accurate is the AI legal advice?</h3>
                  <p className="text-sm text-muted-foreground">
                    The AI provides general information based on legal principles. For specific legal advice tailored to your situation, we recommend consulting with our human experts.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Is my information confidential?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, all conversations and documents shared with our AI are encrypted and kept confidential in accordance with our privacy policy.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What Users Say</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>JD</AvatarFallback>
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
                  <p className="text-sm text-muted-foreground italic">
                    "The AI assistant helped me understand my contract terms quickly. I followed up with an expert consultation for detailed advice."
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AS</AvatarFallback>
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
                  <p className="text-sm text-muted-foreground italic">
                    "Being able to chat with the AI about my legal questions saved me time and money before hiring a lawyer."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="consultations" className="space-y-6">
          {activeConsultation ? (
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {activeConsultation.type === 'ai' ? (
                        <Bot className="h-5 w-5" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                      {activeConsultation.type === 'ai' ? 'AI Consultation' : `Consultation with ${activeConsultation.expertName}`}
                    </CardTitle>
                    <CardDescription>
                      {activeConsultation.topic || 'Legal Consultation'} • 
                      {activeConsultation.type === 'expert' && 
                        ` ${new Date(activeConsultation.date || '').toLocaleDateString()} at ${activeConsultation.time}`
                      }
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setActiveConsultation(null)}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border-t border-b h-[400px] flex flex-col">
                    <div className="flex-1 p-4 overflow-y-auto">
                      {activeConsultation.messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex mb-4 ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.sender === 'user' 
                                ? 'bg-primary text-primary-foreground ml-12' 
                                : message.sender === 'ai'
                                  ? 'bg-muted border mr-12'
                                  : 'bg-secondary text-secondary-foreground mr-12'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {message.sender === 'user' ? (
                                <User className="h-4 w-4" />
                              ) : message.sender === 'ai' ? (
                                <Bot className="h-4 w-4" />
                              ) : (
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={experts.find(e => e.name === activeConsultation.expertName)?.image} />
                                  <AvatarFallback>{activeConsultation.expertName?.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                              )}
                              <span className="text-xs font-medium">
                                {message.sender === 'user' 
                                  ? 'You' 
                                  : message.sender === 'ai' 
                                    ? 'AI Assistant' 
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
                            <div className="whitespace-pre-line">
                              {message.content}
                            </div>
                            {message.status === 'sending' && (
                              <div className="text-xs opacity-70 mt-1 text-right">
                                Sending...
                              </div>
                            )}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {message.attachments.map((attachment, index) => (
                                  <div 
                                    key={index} 
                                    className="flex items-center gap-2 text-xs p-1.5 rounded bg-background/50"
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                    <span>{attachment.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {isLoading && activeConsultation.type === 'ai' && (
                        <div className="flex justify-start mb-4">
                          <div className="max-w-[80%] rounded-lg p-3 bg-muted border mr-12">
                            <div className="flex items-center gap-2 mb-1">
                              <Bot className="h-4 w-4" />
                              <span className="text-xs font-medium">AI Assistant</span>
                              <span className="text-xs opacity-70">
                                {new Date().toLocaleTimeString([], {
                                  hour: '2-digit', 
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 h-10">
                              <div className="bg-primary/10 h-2 w-2 rounded-full animate-pulse"></div>
                              <div className="bg-primary/10 h-2 w-2 rounded-full animate-pulse delay-150"></div>
                              <div className="bg-primary/10 h-2 w-2 rounded-full animate-pulse delay-300"></div>
                              <span className="text-xs text-muted-foreground ml-1">
                                AI is thinking...
                              </span>
                            </div>
                            {aiProgress > 0 && (
                              <div className="mt-1 space-y-1">
                                <Progress value={aiProgress} className="h-1" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Analyzing your question</span>
                                  <span>{aiProgress}%</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="p-3 border-t">
                      <div className="flex gap-2">
                        <Textarea 
                          placeholder="Type your message..." 
                          className="min-h-10 resize-none"
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
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              <div className="flex gap-4 items-center">
                <h2 className="text-lg font-medium">My Consultations</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={startAiConsultation}>
                    <Bot className="mr-2 h-4 w-4" />
                    New AI Consultation
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule With Expert
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Select Expert</DialogTitle>
                        <DialogDescription>
                          Choose a legal expert to schedule a consultation
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {experts.map((expert) => (
                          <Button 
                            key={expert.id} 
                            variant="outline" 
                            className="justify-start h-auto py-2"
                            onClick={() => {
                              setSelectedExpert(expert);
                              setActiveTab("experts");
                            }}
                          >
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={expert.image} alt={expert.name} />
                              <AvatarFallback>{expert.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <p className="font-medium">{expert.name}</p>
                              <p className="text-xs text-muted-foreground">{expert.specialization}</p>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {consultations.map((consultation) => (
                  <Card key={consultation.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          {consultation.type === 'ai' ? (
                            <div className="bg-primary/10 p-1.5 rounded-full">
                              <Bot className="h-4 w-4 text-primary" />
                            </div>
                          ) : (
                            <Avatar className="h-8 w-8">
                              <AvatarImage 
                                src={experts.find(e => e.id === consultation.expertId)?.image} 
                                alt={consultation.expertName} 
                              />
                              <AvatarFallback>{consultation.expertName?.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <CardTitle className="text-base">
                              {consultation.type === 'ai' ? 'AI Consultation' : `Expert: ${consultation.expertName}`}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {consultation.topic || 'Legal Consultation'}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge 
                          variant={
                            consultation.status === 'active' ? 'default' :
                            consultation.status === 'scheduled' ? 'outline' :
                            consultation.status === 'completed' ? 'secondary' :
                            'destructive'
                          }
                        >
                          {consultation.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        {consultation.type === 'expert' && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>
                              {new Date(consultation.date || '').toLocaleDateString()} at {consultation.time}
                            </span>
                          </div>
                        )}
                        <div className="border rounded-md p-2 bg-muted/30 max-h-16 overflow-hidden relative">
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {consultation.messages.length > 0 
                              ? consultation.messages[consultation.messages.length - 1].content.substring(0, 120) + '...'
                              : 'No messages yet'
                            }
                          </p>
                          {consultation.messages.length > 2 && (
                            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-muted/80 to-transparent" />
                          )}
                        </div>
                        
                        {consultation.documents && consultation.documents.length > 0 && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>
                              {consultation.documents.length} document{consultation.documents.length > 1 ? 's' : ''} attached
                            </span>
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          Created: {consultation.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button 
                        className="w-full" 
                        variant={consultation.status === 'active' ? "default" : "secondary"}
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
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}