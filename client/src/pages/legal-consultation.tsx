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
          <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-500">Legal Consultations</h1>
          <p className="text-gray-600 max-w-3xl">
            Get expert legal advice from qualified professionals or use our AI-powered assistant for instant guidance. Browse by specialty, book appointments, or start an AI consultation right away.
          </p>
        </div>
      </div>
      
      <Tabs 
        defaultValue="experts" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="experts" className="text-sm">
            <Users className="h-4 w-4 mr-2" />
            Legal Experts
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-sm">
            <Bot className="h-4 w-4 mr-2" />
            AI Assistance
          </TabsTrigger>
          <TabsTrigger value="consultations" className="text-sm">
            <MessagesSquare className="h-4 w-4 mr-2" />
            My Consultations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="experts" className="space-y-6">
          {selectedExpert ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-5">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 border-2 border-black/10">
                          <AvatarImage src={selectedExpert.image} alt={selectedExpert.name} />
                          <AvatarFallback className="bg-black/5">{selectedExpert.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{selectedExpert.name}</CardTitle>
                          <CardDescription className="text-sm">{selectedExpert.title} • {selectedExpert.specialization}</CardDescription>
                          <div className="flex items-center mt-1 gap-2">
                            <div className="flex items-center">
                              <Star className="h-3.5 w-3.5 fill-black text-black" />
                              <span className="text-sm ml-1 font-medium">{selectedExpert.rating}</span>
                              <span className="text-xs text-gray-500 ml-1">({selectedExpert.reviews} reviews)</span>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 font-medium">{selectedExpert.rate}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white border-black/10 hover:bg-black/5"
                        onClick={() => setSelectedExpert(null)}
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Back to List
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">About</h3>
                      <p className="text-sm text-gray-600">{selectedExpert.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Experience</h3>
                        <p className="text-sm text-gray-600">{selectedExpert.experience}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Languages</h3>
                        <div className="flex flex-wrap gap-1">
                          {selectedExpert.languages.map((lang, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-black/5">{lang}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Availability</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedExpert.availability.map((day, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-black/5">{day}s</span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Schedule Consultation</CardTitle>
                    <CardDescription>Book a session with {selectedExpert.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Select Date</h3>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="border rounded-md p-3"
                        disabled={(date) => {
                          // Disable past dates and days the expert isn't available
                          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                          return date < new Date() || !selectedExpert.availability.includes(dayName);
                        }}
                      />
                    </div>
                    
                    {selectedDay && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Available Times on {selectedDay}</h3>
                        {timeSlots.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map((time, idx) => (
                              <Button
                                key={idx}
                                variant={selectedTimeSlot === time ? "default" : "outline"}
                                className={`text-xs py-1 px-2 h-auto ${selectedTimeSlot === time ? 'bg-black text-white' : 'bg-white text-black border-black/10'}`}
                                onClick={() => setSelectedTimeSlot(time)}
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No time slots available on this day.</p>
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Consultation Topic</h3>
                      <Textarea
                        placeholder="Briefly describe what you'd like to discuss"
                        value={consultationTopic}
                        onChange={(e) => setConsultationTopic(e.target.value)}
                        className="resize-none h-20 bg-white border-black/10"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full gap-2 bg-black text-white hover:bg-black/90"
                      onClick={handleBookConsultation}
                      disabled={!selectedTimeSlot || !consultationTopic}
                    >
                      <Calendar className="h-4 w-4" />
                      Book Consultation
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/5 p-4 rounded-lg">
                <div>
                  <h2 className="text-lg font-medium mb-1 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Find a Legal Expert
                  </h2>
                  <p className="text-sm text-gray-600 max-w-xl">
                    Browse our network of qualified legal professionals and book a personalized consultation.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full md:w-[180px] bg-white border-black/10">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      <SelectItem value="Business Law">Business Law</SelectItem>
                      <SelectItem value="Intellectual Property">Intellectual Property</SelectItem>
                      <SelectItem value="Tax Law">Tax Law</SelectItem>
                      <SelectItem value="Employment Law">Employment Law</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredExperts.map((expert) => (
                  <Card key={expert.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 border-2 border-black/10">
                          <AvatarImage src={expert.image} alt={expert.name} />
                          <AvatarFallback className="bg-black/5">{expert.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-semibold">{expert.name}</CardTitle>
                          <CardDescription className="text-xs">{expert.title} • {expert.specialization}</CardDescription>
                          <div className="flex items-center mt-1 gap-2">
                            <div className="flex items-center">
                              <Star className="h-3.5 w-3.5 fill-black text-black" />
                              <span className="text-sm ml-1 font-medium">{expert.rating}</span>
                              <span className="text-xs text-gray-500 ml-1">({expert.reviews})</span>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 font-medium">{expert.rate}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p className="text-gray-600">{expert.description.substring(0, 150)}...</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {expert.experience}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 flex items-center gap-1">
                          <Clock3 className="h-3 w-3" />
                          {expert.availability.length} days/week
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        className="w-full shadow-sm bg-white border border-black/10 hover:bg-black/5 text-black"
                        onClick={() => setSelectedExpert(expert)}
                      >
                        View Profile & Book
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2 bg-gradient-to-br from-black/5 to-black/10 border-black/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-black/10 p-3 rounded-lg">
                    <Bot className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      AI Legal Assistant
                      <Badge variant="outline" className="ml-2 text-xs font-normal bg-black/5 text-black border-black/20">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Confidential
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Get instant answers to your legal questions powered by artificial intelligence
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-black/10">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-black" />
                    How It Works
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-black/5 p-3 rounded-lg">
                      <div className="bg-black/10 w-8 h-8 flex items-center justify-center rounded-full mb-2">
                        <MessagesSquare className="h-4 w-4 text-black" />
                      </div>
                      <h4 className="font-medium mb-1">Ask Questions</h4>
                      <p className="text-xs text-gray-600">Type your legal questions in natural language</p>
                    </div>
                    <div className="bg-black/5 p-3 rounded-lg">
                      <div className="bg-black/10 w-8 h-8 flex items-center justify-center rounded-full mb-2">
                        <Bot className="h-4 w-4 text-black" />
                      </div>
                      <h4 className="font-medium mb-1">Instant Analysis</h4>
                      <p className="text-xs text-gray-600">Our AI analyzes your questions using legal knowledge</p>
                    </div>
                    <div className="bg-black/5 p-3 rounded-lg">
                      <div className="bg-black/10 w-8 h-8 flex items-center justify-center rounded-full mb-2">
                        <FileText className="h-4 w-4 text-black" />
                      </div>
                      <h4 className="font-medium mb-1">Clear Guidance</h4>
                      <p className="text-xs text-gray-600">Receive informative answers with relevant legal context</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  onClick={startAiConsultation} 
                  className="w-full gap-2 bg-black text-white hover:bg-black/90"
                >
                  <Bot className="h-4 w-4" />
                  Start AI Consultation
                </Button>
                <p className="text-xs text-center text-gray-500 max-w-lg mx-auto">
                  While our AI provides legal information based on its training, it does not replace professional legal advice. For specific legal matters, consider booking a consultation with one of our experts.
                </p>
              </CardFooter>
            </Card>
            
            <Card className="bg-white overflow-hidden">
              <CardHeader className="bg-black/5 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-black" />
                  Popular Legal Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-black/5">
                  {[
                    "Business Formation & Structures",
                    "Contract Review & Negotiation",
                    "Intellectual Property Protection",
                    "Employment Law & Regulations",
                    "Tax Planning & Compliance"
                  ].map((topic, idx) => (
                    <Button
                      key={idx}
                      variant="ghost"
                      className="w-full justify-start rounded-none h-auto py-3 px-4 text-left text-black hover:bg-black/5"
                      onClick={() => {
                        startAiConsultation();
                        setNewMessage(`I have a question about ${topic}`);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Plus className="h-3.5 w-3.5 text-black" />
                        <span>{topic}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white overflow-hidden">
              <CardHeader className="bg-black/5 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4 text-black" />
                  User Testimonials
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-black/5">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-black/5 text-black">JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">James D.</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-black text-black" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      "The AI assistant helped me understand the basics of trademark registration before I spoke with a specialist. Saved me time and money."
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-black/5 text-black">MT</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Michelle T.</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < 4 ? 'fill-black text-black' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
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
              <Card className="overflow-hidden shadow-sm border-black/10">
                <CardHeader className="pb-3 flex flex-row items-center justify-between border-b bg-white">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${activeConsultation.type === 'ai' ? 'bg-black/5' : 'bg-black/5'}`}>
                      {activeConsultation.type === 'ai' ? (
                        <Bot className="h-5 w-5 text-black" />
                      ) : (
                        <User className="h-5 w-5 text-black" />
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
                              {activeConsultation.date} at {activeConsultation.time}
                            </span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 border-black/10 bg-white" 
                    onClick={() => setActiveConsultation(null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[500px] flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/5">
                      {activeConsultation.messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6">
                          <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-black/10">
                            {activeConsultation.type === 'ai' ? (
                              <Bot className="h-8 w-8 text-black" />
                            ) : (
                              <User className="h-8 w-8 text-black" />
                            )}
                          </div>
                          <h3 className="text-lg font-medium text-black mb-2">
                            {activeConsultation.type === 'ai' 
                              ? 'Chat with our AI Legal Assistant' 
                              : `Chat with ${activeConsultation.expertName}`
                            }
                          </h3>
                          <p className="text-gray-600 mb-6 max-w-md text-sm">
                            {activeConsultation.type === 'ai'
                              ? 'Ask any legal question to get instant information and guidance based on legal knowledge and best practices.'
                              : 'Send a message to begin your consultation. You can share documents and ask specific questions about your legal matters.'
                            }
                          </p>
                          {activeConsultation.type === 'ai' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                              {[
                                "How do I register a trademark?",
                                "What should be in my privacy policy?",
                                "What's the process for forming an LLC?",
                                "What are my rights as a tenant?"
                              ].map((question, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  className="h-auto py-2 px-3 text-sm text-left justify-start border-black/10 bg-white hover:bg-black/5"
                                  onClick={() => setNewMessage(question)}
                                >
                                  <Plus className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                  <span className="truncate">{question}</span>
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        activeConsultation.messages.map(message => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`
                                max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 space-y-2
                                ${message.sender === 'user' 
                                  ? 'bg-black text-white rounded-tr-none' 
                                  : message.sender === 'ai'
                                    ? 'bg-white border border-black/10 rounded-tl-none' 
                                    : 'bg-white border border-black/10 rounded-tl-none'
                                }
                              `}
                            >
                              {message.sender !== 'user' && (
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-black/5 flex items-center justify-center">
                                    {message.sender === 'ai' ? (
                                      <Bot className="h-3.5 w-3.5 text-black" />
                                    ) : (
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage 
                                          src={experts.find(e => e.id === activeConsultation.expertId)?.image} 
                                          alt={activeConsultation.expertName} 
                                        />
                                        <AvatarFallback className="text-[10px] bg-black/5 text-black">
                                          {activeConsultation.expertName?.substring(0, 2)}
                                        </AvatarFallback>
                                      </Avatar>
                                    )}
                                  </div>
                                  <span className="text-xs font-medium text-black">
                                    {message.sender === 'ai' ? 'AI Assistant' : activeConsultation.expertName}
                                  </span>
                                </div>
                              )}
                              <div className="space-y-2">
                                <div className={`text-sm ${message.sender === 'user' ? 'text-white' : 'text-black'} whitespace-pre-line`}>
                                  {message.content}
                                </div>
                                {message.attachments && message.attachments.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {message.attachments.map((file, idx) => (
                                      <div 
                                        key={idx} 
                                        className="text-xs flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/10 text-gray-800"
                                      >
                                        <FileText className="h-3 w-3" />
                                        {file.name}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="flex justify-between items-center">
                                  <span className="text-xs opacity-70">
                                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                                  {message.status && (
                                    <span className="text-xs opacity-70">
                                      {message.status === 'sending' ? 'Sending...' : message.status === 'sent' ? 'Delivered' : message.status}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                      
                      {isLoading && activeConsultation.type === 'ai' && (
                        <div className="flex justify-start">
                          <div className="max-w-[85%] md:max-w-[70%] bg-white border border-black/10 rounded-2xl rounded-tl-none px-4 py-3 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-black/5 flex items-center justify-center">
                                <Bot className="h-3.5 w-3.5 text-black" />
                              </div>
                              <span className="text-xs font-medium text-black">AI Assistant</span>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="flex space-x-1">
                                  <div className="h-2 w-2 bg-black/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                  <div className="h-2 w-2 bg-black/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                  <div className="h-2 w-2 bg-black/40 rounded-full animate-bounce"></div>
                                </div>
                                <span className="text-xs text-gray-500">AI is drafting a response</span>
                              </div>
                              <Progress value={aiProgress} className="h-1 w-[200px]" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border-t border-black/10 bg-white">
                      <div className="flex items-end gap-2">
                        <Textarea 
                          placeholder={`Type your message to ${activeConsultation.type === 'ai' ? 'AI Assistant' : activeConsultation.expertName}...`}
                          className="min-h-10 resize-none bg-white border-black/10"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="icon"
                            variant="outline"
                            className="rounded-full h-10 w-10 shrink-0 bg-white border-black/10"
                          >
                            <Paperclip className="h-5 w-5 text-black/70" />
                          </Button>
                          <Button 
                            size="icon"
                            className="rounded-full h-10 w-10 shrink-0 bg-black text-white"
                            onClick={sendMessage}
                            disabled={isLoading || !newMessage.trim()}
                          >
                            <Send className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      {activeConsultation.type === 'ai' && (
                        <div className="mt-2 text-xs text-center text-gray-500">
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
              <div className="bg-gradient-to-br from-black/5 to-black/10 p-6 rounded-xl border border-black/10 mb-6 relative overflow-hidden">
                <div className="absolute -right-24 -top-16 w-64 h-48 bg-black/5 rounded-full blur-3xl"></div>
                <div className="absolute -left-24 -bottom-16 w-64 h-48 bg-black/5 rounded-full blur-3xl"></div>
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-black/10 to-black/20 p-3.5 rounded-xl shadow-md hidden md:flex">
                      <MessagesSquare className="h-7 w-7 text-black" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-black mb-2 tracking-tight flex items-center gap-2 md:gap-0">
                        <MessagesSquare className="h-5 w-5 text-black md:hidden mr-1" />
                        My Legal Consultations
                      </h2>
                      <p className="text-sm text-gray-600 max-w-xl leading-relaxed font-light">
                        Access your past and upcoming consultations with AI assistants and legal experts. Continue active conversations or schedule new consultations.
                      </p>
                      
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-30"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                          </div>
                          <span>{consultations.filter(c => c.status === 'active').length} Active</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-black/30"></div>
                          <span>{consultations.filter(c => c.status === 'scheduled').length} Scheduled</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-black/20"></div>
                          <span>{consultations.filter(c => c.status === 'completed').length} Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 md:pl-4 md:border-l md:border-black/10">
                        <Button 
                          onClick={startAiConsultation} 
                          className="gap-2 shadow-md bg-black hover:bg-black/90 text-white font-medium px-4"
                        >
                          <Bot className="h-4 w-4" />
                          New AI Consultation
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2 bg-white shadow-md border-black/10 hover:border-black/30 text-black font-medium px-4">
                              <Calendar className="h-4 w-4" />
                              Schedule With Expert
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle className="text-xl flex items-center gap-2 font-semibold text-black tracking-tight">
                                <Users className="h-5 w-5 text-black" />
                                Select Legal Expert
                              </DialogTitle>
                              <DialogDescription className="text-gray-600 font-light">
                                Choose a legal professional to schedule a personalized consultation
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              {experts.map((expert) => (
                                <Button 
                                  key={expert.id} 
                                  variant="outline" 
                                  className="justify-start h-auto p-3 hover:border-black/30 hover:bg-black/5 transition-all border-black/10 bg-white"
                                  onClick={() => {
                                    setSelectedExpert(expert);
                                    setActiveTab("experts");
                                  }}
                                >
                                  <Avatar className="h-10 w-10 mr-3 border border-black/10">
                                    <AvatarImage src={expert.image} alt={expert.name} />
                                    <AvatarFallback className="bg-black/5 text-black">{expert.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <div className="text-left">
                                    <p className="font-semibold text-black">{expert.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                      <span className="text-black font-medium">{expert.specialization}</span>
                                      <span>•</span>
                                      <span className="flex items-center gap-0.5">
                                        <Star className="h-3 w-3 fill-black text-black" />
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
                      
                      {/* Mini Calendar */}
                      <div className="hidden md:block bg-white rounded-lg border border-black/10 shadow-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-medium text-black">Upcoming Consultations</div>
                          <div className="text-[10px] text-gray-500">{new Date().toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2 mt-1">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                            <div key={i} className="text-[10px] text-center text-gray-500 font-medium">{day}</div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: 14 }, (_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() + i);
                            const hasConsultation = consultations.some(c => 
                              c.date && new Date(c.date).toDateString() === date.toDateString()
                            );
                            return (
                              <div 
                                key={i} 
                                className={`
                                  text-[10px] flex items-center justify-center rounded-full 
                                  aspect-square w-6 font-medium transition-all
                                  ${hasConsultation 
                                    ? 'bg-black text-white shadow-sm' 
                                    : i < 3 
                                      ? 'text-gray-700 hover:bg-black/5 cursor-pointer bg-black/5'
                                      : 'text-gray-700 hover:bg-black/5 cursor-pointer'}
                                `}
                              >
                                {date.getDate()}
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-black/5">
                          <div className="flex items-center justify-between text-[10px] text-gray-700">
                            <div className="font-medium">Next consultation</div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Tomorrow, 10:00 AM</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {consultations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-black/10 rounded-lg bg-white">
                  <div className="bg-black/5 p-3 rounded-full mb-4">
                    <MessagesSquare className="h-8 w-8 text-black/70" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-black">No consultations yet</h3>
                  <p className="text-gray-600 text-center max-w-md mb-6 leading-relaxed font-light">
                    You haven't started any legal consultations. Begin with an AI consultation for instant assistance or schedule time with a legal expert.
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={startAiConsultation} className="gap-2 bg-black hover:bg-black/90 text-white">
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
                      className={`overflow-hidden transition-all hover:shadow-md relative ${
                        consultation.status === 'active' 
                          ? 'border-black/20 bg-gradient-to-b from-white to-black/5' 
                          : consultation.status === 'scheduled' 
                            ? 'border-black/15 bg-white'
                            : 'border-black/10 bg-white'
                      }`}
                    >
                      {consultation.status === 'active' && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-black" />
                      )}
                      <CardHeader className="pb-3 border-b border-black/10">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            {consultation.type === 'ai' ? (
                              <div className={`p-2 rounded-lg shadow-sm ${consultation.status === 'active' ? 'bg-black' : 'bg-black/80'}`}>
                                <Bot className="h-5 w-5 text-white" />
                              </div>
                            ) : (
                              <Avatar className="h-10 w-10 border-2 border-black/10">
                                <AvatarImage 
                                  src={experts.find(e => e.id === consultation.expertId)?.image} 
                                  alt={consultation.expertName} 
                                />
                                <AvatarFallback className="bg-black/5 text-black">{consultation.expertName?.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <CardTitle className="text-base font-semibold text-black flex items-center gap-2">
                                {consultation.type === 'ai' ? 'AI Legal Assistant' : `Consultation with ${consultation.expertName}`}
                                {consultation.status === 'active' && (
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-30"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                                  </span>
                                )}
                              </CardTitle>
                              <CardDescription className="text-xs flex items-center gap-1.5 text-gray-600">
                                <FileText className="h-3 w-3" />
                                {consultation.topic || 'Legal Consultation'}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant="outline"
                            className={`
                              ${consultation.status === 'active' ? 'bg-black text-white border-0' : ''}
                              ${consultation.status === 'scheduled' ? 'bg-black/10 text-black border-black/20' : ''}
                              ${consultation.status === 'completed' ? 'bg-gray-100 text-gray-700 border-gray-200' : ''}
                              ${consultation.status === 'cancelled' ? 'bg-gray-100 text-gray-700 border-gray-200' : ''}
                            `}
                          >
                            {consultation.status === 'active' ? 'Active Now' : (
                              <span className="capitalize">{consultation.status}</span>
                            )}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {consultation.type === 'expert' && (
                            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-black/5 rounded-full border border-black/5">
                              <CalendarIcon className="h-3.5 w-3.5 text-black/70" />
                              <span className="text-gray-700 font-medium">
                                {new Date(consultation.date || '').toLocaleDateString()} at {consultation.time}
                              </span>
                            </div>
                          )}
                          
                          {consultation.documents && consultation.documents.length > 0 && (
                            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-black/5 rounded-full border border-black/5">
                              <FileText className="h-3.5 w-3.5 text-black/70" />
                              <span className="text-gray-700 font-medium">
                                {consultation.documents.length} document{consultation.documents.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-black/5 rounded-full border border-black/5">
                            <Clock className="h-3.5 w-3.5 text-black/70" />
                            <span className="text-gray-700 font-medium">
                              {new Date(consultation.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`border rounded-lg p-3 max-h-20 overflow-hidden relative
                          ${consultation.status === 'active' 
                            ? 'border-black/20 bg-black/10' 
                            : 'border-black/10 bg-black/5'}`}
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <div className={`min-w-fit mt-0.5 flex items-center justify-center rounded-full 
                              ${consultation.messages.length > 0 && consultation.messages[consultation.messages.length - 1].sender === 'user' 
                                ? 'h-5 w-5 bg-black' 
                                : 'h-5 w-5 bg-black/80'}`}
                            >
                              {consultation.messages.length > 0 && consultation.messages[consultation.messages.length - 1].sender === 'user' ? (
                                <User className="h-3 w-3 text-white" />
                              ) : (
                                <Bot className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-gray-700 leading-relaxed">
                                {consultation.messages.length > 0 
                                  ? consultation.messages[consultation.messages.length - 1].content.substring(0, 150) + 
                                    (consultation.messages[consultation.messages.length - 1].content.length > 150 ? '...' : '')
                                  : 'No messages yet'
                                }
                              </p>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/90 to-transparent" />
                        </div>
                        
                        {consultation.type === 'expert' && consultation.status === 'scheduled' && (
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                            <div className="flex items-center gap-1">
                              <Video className="h-3.5 w-3.5" />
                              <span>Video consultation</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>60 minutes</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="px-4 pb-4 pt-1">
                        <Button 
                          className="w-full shadow-sm transition-all font-medium" 
                          variant={consultation.status === 'active' ? "default" : "outline"}
                          onClick={() => setActiveConsultation(consultation)}
                          style={{
                            backgroundColor: consultation.status === 'active' ? '#000000' : 'transparent',
                            borderColor: consultation.status === 'active' ? 'transparent' : '#00000033',
                            color: consultation.status === 'active' ? '#FFFFFF' : '#000000'
                          }}
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