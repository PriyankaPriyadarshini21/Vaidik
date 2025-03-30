import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MyConsultationsHeader } from "@/components/consultations/my-consultations-header";
import { ConsultationStats } from "@/components/consultations/consultation-stats";
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
  ChevronLeft,
  ChevronRight,
  Clock, 
  FileText, 
  MessagesSquare, 
  MessageCircle,
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
      return "Thank you for your legal question. To provide you with the most accurate information, I'd need a few more details about your specific situation. Could you tell me more about the context and your main concerns? This will help me tailor my response to your needs.";
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-screen-xl">
      <h1 className="sr-only">Legal Consultation</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <MyConsultationsHeader 
            onNewAIConsultation={startAiConsultation}
            onScheduleWithExpert={() => setActiveTab("experts")}
          />
          
          <TabsList className="bg-white border border-gray-200 p-1 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <TabsTrigger 
              value="consultations"
              className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
            >
              My Consultations
            </TabsTrigger>
            <TabsTrigger 
              value="experts"
              className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
            >
              Find Experts
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="consultations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <ConsultationStats 
                stats={{
                  active: consultations.filter(c => c.status === 'active').length,
                  scheduled: consultations.filter(c => c.status === 'scheduled').length,
                  completed: consultations.filter(c => c.status === 'completed').length
                }}
              />
              
              <div className="mt-6 space-y-3">
                <h3 className="text-lg font-semibold mb-3 dark:text-white">Quick Actions</h3>
                <Button 
                  onClick={startAiConsultation}
                  className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                >
                  <Bot className="h-4 w-4" />
                  New AI Consultation
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-blue-200 hover:bg-blue-50 hover:border-blue-300 flex items-center gap-2 dark:border-blue-800 dark:hover:border-blue-700 dark:hover:bg-blue-900/30 dark:text-white transition-colors"
                  onClick={() => {
                    setActiveTab("experts");
                  }}
                >
                  <User className="h-4 w-4" />
                  Book Expert Consultation
                </Button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 dark:text-white">My Consultations</h3>
                <div className="space-y-3">
                  {consultations.map(consultation => (
                    <Card 
                      key={consultation.id} 
                      className={`
                        cursor-pointer transition-all hover:shadow
                        ${activeConsultation?.id === consultation.id 
                          ? 'border-blue-300 ring-1 ring-blue-300 dark:border-blue-700 dark:ring-blue-700' 
                          : 'border-gray-200 hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-800'}
                      `}
                      onClick={() => setActiveConsultation(consultation)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {consultation.type === 'ai' ? (
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/30">
                                  <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center dark:bg-orange-900/30">
                                  <User className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium text-sm dark:text-white">
                                  {consultation.topic || (consultation.type === 'ai' ? 'AI Consultation' : `Consultation with ${consultation.expertName}`)}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {consultation.date 
                                    ? `${new Date(consultation.date).toLocaleDateString()} at ${consultation.time}` 
                                    : consultation.createdAt.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`
                              text-xs px-2
                              ${consultation.status === 'active' 
                                ? 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' 
                                : consultation.status === 'scheduled'
                                  ? 'bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400'
                                  : 'bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                              }
                            `}
                          >
                            {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {consultation.messages.length} message{consultation.messages.length !== 1 ? 's' : ''}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveConsultation(consultation);
                            }}
                          >
                            Continue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3">
              {activeConsultation ? (
                <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-start gap-4">
                      <div className={`
                        h-12 w-12 rounded-full flex items-center justify-center shrink-0
                        ${activeConsultation.type === 'ai' 
                          ? 'bg-blue-100 dark:bg-blue-900/30' 
                          : 'bg-orange-100 dark:bg-orange-900/30'
                        }
                      `}>
                        {activeConsultation.type === 'ai' ? (
                          <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800">
                            <AvatarImage 
                              src={experts.find(e => e.id === activeConsultation.expertId)?.image} 
                              alt={activeConsultation.expertName} 
                            />
                            <AvatarFallback>
                              {activeConsultation.expertName?.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl dark:text-white">
                          {activeConsultation.type === 'ai' 
                            ? 'AI Legal Assistant' 
                            : activeConsultation.expertName
                          }
                        </CardTitle>
                        <CardDescription>
                          {activeConsultation.topic || (
                            activeConsultation.type === 'ai' 
                              ? 'Ask any legal questions' 
                              : experts.find(e => e.id === activeConsultation.expertId)?.specialization
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-600 text-white border-0 font-medium dark:bg-blue-700">
                        {activeConsultation.status === 'active' ? 'Live' : 'Archived'}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 w-9 p-0 rounded-full border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700" 
                        onClick={() => setActiveConsultation(null)}
                      >
                        <XCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                  <div className="h-[600px] flex flex-col dark:bg-gray-900">
                    <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gradient-to-b from-blue-50/30 to-blue-50/80 dark:from-blue-900/10 dark:to-blue-900/20">
                      {activeConsultation && activeConsultation.messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                          <div className="bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-800/30 dark:to-blue-700/30 p-6 rounded-full shadow-lg mb-6 border border-blue-100 dark:border-blue-800/30">
                            {activeConsultation && activeConsultation.type === 'ai' ? (
                              <Bot className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {activeConsultation && activeConsultation.type === 'ai' 
                              ? 'Chat with our AI Legal Assistant' 
                              : `Chat with ${activeConsultation && activeConsultation.expertName}`
                            }
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md text-sm leading-relaxed">
                            {activeConsultation && activeConsultation.type === 'ai'
                              ? 'Ask any legal question to get instant information and guidance based on legal knowledge and best practices.'
                              : 'Send a message to begin your consultation. You can share documents and ask specific questions about your legal matters.'
                            }
                          </p>
                          {activeConsultation && activeConsultation.type === 'ai' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                              {[
                                "How do I register a trademark?",
                                "What should be in my privacy policy?",
                                "What's the process for forming an LLC?",
                                "What are my rights as a tenant?"
                              ].map((question, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  className="h-auto py-3 px-4 text-sm text-left justify-start border-blue-200 bg-white hover:bg-blue-50 shadow-sm dark:bg-gray-800 dark:border-blue-800/50 dark:hover:bg-blue-900/30 dark:text-gray-200 transition-colors"
                                  onClick={() => setNewMessage(question)}
                                >
                                  <Plus className="h-3.5 w-3.5 mr-2.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                  <span className="truncate">{question}</span>
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        activeConsultation && activeConsultation.messages.map(message => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
                          >
                            {message.sender !== 'user' && (
                              <div className="mr-3 mt-1">
                                <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shadow-sm">
                                  {message.sender === 'ai' ? (
                                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  ) : (
                                    <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800">
                                      <AvatarImage 
                                        src={activeConsultation && experts.find(e => e.id === activeConsultation.expertId)?.image} 
                                        alt={activeConsultation && activeConsultation.expertName} 
                                      />
                                      <AvatarFallback className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                                        {activeConsultation && activeConsultation.expertName?.substring(0, 2)}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            <div 
                              className={`
                                message-bubble ${message.sender === 'user' ? 'user' : 'ai'}
                                max-w-[85%] md:max-w-[70%] shadow-sm
                              `}
                            >
                              {message.sender !== 'user' && (
                                <div className="mb-1.5">
                                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    {message.sender === 'ai' ? 'AI Legal Assistant' : (activeConsultation && activeConsultation.expertName)}
                                  </span>
                                </div>
                              )}
                              
                              <div className="space-y-3">
                                <div className={`text-sm ${message.sender === 'user' ? 'text-white dark:text-white' : 'text-gray-800 dark:text-gray-200'} whitespace-pre-line leading-relaxed`}>
                                  {message.content}
                                </div>
                                
                                {message.attachments && message.attachments.length > 0 && (
                                  <div className="flex flex-wrap gap-2 pt-1">
                                    {message.attachments.map((file, idx) => (
                                      <div 
                                        key={idx} 
                                        className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/30 text-gray-800 dark:bg-white/10 dark:text-gray-200 border border-white/20 dark:border-white/10 backdrop-blur-sm"
                                      >
                                        <FileText className="h-3 w-3" />
                                        {file.name}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="flex justify-between items-center pt-1">
                                  <span className="text-[10px] opacity-70 font-medium">
                                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                                  {message.status && (
                                    <span className="text-[10px] opacity-70">
                                      {message.status === 'sending' ? 'Sending...' : message.status === 'sent' ? 'Delivered' : message.status}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {message.sender === 'user' && (
                              <div className="ml-3 mt-1">
                                <div className="h-9 w-9 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center shadow-md">
                                  <User className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                      
                      {isLoading && activeConsultation && activeConsultation.type === 'ai' && (
                        <div className="flex justify-start">
                          <div className="ml-12 message-bubble ai max-w-[85%] md:max-w-[70%] shadow-sm">
                            <div className="mb-1.5">
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">AI Legal Assistant</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={aiProgress} className="h-1.5 w-40" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-inner">
                      <div className="flex items-end gap-3 max-w-screen-lg mx-auto">
                        <Textarea 
                          placeholder={`Type your message to ${activeConsultation && activeConsultation.type === 'ai' ? 'AI Legal Assistant' : (activeConsultation && activeConsultation.expertName) || 'expert'}...`}
                          className="min-h-12 resize-none bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus-visible:ring-blue-500 dark:text-white"
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
                            className="rounded-full h-12 w-12 shrink-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors"
                          >
                            <Paperclip className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </Button>
                          <Button 
                            size="icon"
                            className="rounded-full h-12 w-12 shrink-0 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white shadow-md transition-colors"
                            onClick={sendMessage}
                            disabled={isLoading || !newMessage.trim()}
                          >
                            <Send className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      {activeConsultation && activeConsultation.type === 'ai' && (
                        <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400 max-w-screen-lg mx-auto">
                          AI responses are generated based on legal knowledge but should not replace professional legal advice
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                </Card>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-xl border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
                  <div className="rounded-full bg-blue-100 p-4 mb-4 dark:bg-blue-900/30">
                    <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">No consultation selected</h3>
                  <p className="text-gray-600 mb-6 max-w-md dark:text-gray-300">
                    Select a consultation from the list or start a new one with our AI assistant for instant legal guidance
                  </p>
                  <div className="flex gap-4">
                    <Button
                      onClick={startAiConsultation}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                    >
                      Start AI Consultation
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-700 dark:hover:bg-blue-900/30 dark:text-white transition-colors"
                      onClick={() => {
                        setActiveTab("experts");
                      }}
                    >
                      Book Expert Consultation
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="experts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Filter Experts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium dark:text-white">Legal Category</label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                    >
                      <SelectTrigger className="w-full dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="dark:border-gray-700 dark:bg-gray-800">
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Business Law">Business Law</SelectItem>
                        <SelectItem value="Intellectual Property">Intellectual Property</SelectItem>
                        <SelectItem value="Tax Law">Tax Law</SelectItem>
                        <SelectItem value="Employment Law">Employment Law</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium dark:text-white">Experience Level</label>
                    <Select
                      value={experienceLevel}
                      onValueChange={setExperienceLevel}
                    >
                      <SelectTrigger className="w-full dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="dark:border-gray-700 dark:bg-gray-800">
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="junior">Up to 5 years</SelectItem>
                        <SelectItem value="mid">5-10 years</SelectItem>
                        <SelectItem value="senior">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Why Choose an Expert?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-2 dark:bg-blue-900/30">
                      <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1 dark:text-white">Verified Professionals</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">All experts are thoroughly vetted and have verified credentials</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-2 dark:bg-blue-900/30">
                      <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1 dark:text-white">Specialized Knowledge</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Access specialists in various legal fields with deep expertise</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-2 dark:bg-blue-900/30">
                      <Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1 dark:text-white">Flexible Scheduling</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Book consultations that fit your schedule, with quick response times</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              {selectedExpert ? (
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 border-2 border-white rounded-xl shadow-md dark:border-gray-800">
                        <AvatarImage src={selectedExpert.image} alt={selectedExpert.name} />
                        <AvatarFallback className="rounded-xl">{selectedExpert.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="dark:text-white">{selectedExpert.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-gray-600 dark:text-gray-300">{selectedExpert.title}</p>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                            {selectedExpert.specialization}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3.5 w-3.5 ${i < Math.floor(selectedExpert.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{selectedExpert.rating}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">({selectedExpert.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                      onClick={() => setSelectedExpert(null)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back to list
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2 dark:text-white">About</h3>
                          <p className="text-sm text-gray-600 leading-relaxed dark:text-gray-300">{selectedExpert.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold mb-1 dark:text-white">Experience</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{selectedExpert.experience}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold mb-1 dark:text-white">Rate</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{selectedExpert.rate}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold mb-1 dark:text-white">Languages</h4>
                            <div className="flex flex-wrap gap-1">
                              {selectedExpert.languages.map((language, idx) => (
                                <Badge key={idx} variant="outline" className="bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                                  {language}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 dark:bg-gray-800">
                        <div>
                          <h3 className="text-lg font-semibold mb-2 dark:text-white">Book a Consultation</h3>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium block mb-1.5 dark:text-white">Select date</label>
                          <div className="border rounded-md p-2 dark:border-gray-700">
                            <Calendar 
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              className="mx-auto"
                              disabled={(date) => {
                                // Disable dates in the past
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                if (date < today) return true;
                                
                                // Disable days that aren't in the expert's availability
                                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                                return !selectedExpert.availability.includes(dayName);
                              }}
                              classNames={{
                                day_today: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
                                day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white",
                                day: "text-sm dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              }}
                            />
                          </div>
                        </div>
                        
                        {selectedDay && (
                          <div>
                            <label className="text-sm font-medium block mb-1.5 dark:text-white">Select time ({selectedDay})</label>
                            <div className="grid grid-cols-2 gap-2">
                              {timeSlots.map((slot, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  className={`
                                    text-sm border-gray-200 hover:bg-blue-50 hover:border-blue-200 dark:border-gray-700 dark:hover:bg-blue-900/20 dark:hover:border-blue-800 dark:text-white 
                                    ${selectedTimeSlot === slot ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : ''}
                                  `}
                                  onClick={() => setSelectedTimeSlot(slot)}
                                >
                                  {slot}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <label className="text-sm font-medium block mb-1.5 dark:text-white">Consultation topic</label>
                          <Textarea 
                            placeholder="Briefly describe what you'd like to discuss..."
                            value={consultationTopic}
                            onChange={(e) => setConsultationTopic(e.target.value)}
                            className="resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <Button 
                          onClick={handleBookConsultation}
                          disabled={!selectedDate || !selectedTimeSlot || !consultationTopic}
                          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                          Book Consultation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold dark:text-white">Available Legal Experts</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Showing {filteredExperts.length} experts
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredExperts.map(expert => (
                      <Card 
                        key={expert.id} 
                        className="cursor-pointer transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
                        onClick={() => setSelectedExpert(expert)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-14 w-14 rounded-full border-2 border-white shadow-sm dark:border-gray-800">
                              <AvatarImage src={expert.image} alt={expert.name} />
                              <AvatarFallback>{expert.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg dark:text-white">{expert.name}</h3>
                              <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{expert.title}</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex items-center dark:bg-blue-900/30 dark:text-blue-300">
                                  {expert.specialization}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-3.5 w-3.5 ${i < Math.floor(expert.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium">{expert.rating}</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">({expert.reviews})</span>
                                </div>
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{expert.rate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center dark:border-gray-700">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {expert.experience} experience
                            </div>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedExpert(expert);
                              }}
                            >
                              View Profile
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}