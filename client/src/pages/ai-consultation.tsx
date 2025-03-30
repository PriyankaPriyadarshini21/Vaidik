import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Send, 
  User, 
  RotateCcw, 
  Paperclip,
  MessageSquare,
  Brain,
  Sparkles
} from "lucide-react";

// LLM Models
const llmModels = [
  { 
    id: 'openai', 
    name: 'OpenAI GPT-4', 
    icon: <Sparkles className="h-5 w-5 text-green-500" />,
    description: 'Most accurate and comprehensive legal analysis' 
  },
  { 
    id: 'claude', 
    name: 'Anthropic Claude', 
    icon: <Bot className="h-5 w-5 text-purple-500" />,
    description: 'Balanced analysis with strong ethics considerations' 
  },
  { 
    id: 'ollama', 
    name: 'Local Llama 3', 
    icon: <Brain className="h-5 w-5 text-blue-500" />,
    description: 'Privacy-focused local model (may be less accurate)' 
  }
];

// Sample categories for legal topics
const legalCategories = [
  { id: 'business', name: 'Business Law' },
  { id: 'contract', name: 'Contract Law' },
  { id: 'ip', name: 'Intellectual Property' },
  { id: 'employment', name: 'Employment Law' },
  { id: 'tax', name: 'Tax Law' },
  { id: 'real-estate', name: 'Real Estate Law' },
  { id: 'family', name: 'Family Law' },
  { id: 'immigration', name: 'Immigration Law' },
  { id: 'criminal', name: 'Criminal Law' }
];

// Message interface
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  references?: string[];
  followupQuestions?: string[];
}

export default function AIConsultation() {
  const [activeTab, setActiveTab] = useState("chat");
  const [query, setQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("openai");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI legal assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
      followupQuestions: [
        "What are the legal requirements for starting a business?",
        "Can you explain non-disclosure agreements?",
        "What should I know about employment contracts?"
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [category, setCategory] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate a mock response for the demo
  const generateMockResponse = (question: string): string => {
    if (question.toLowerCase().includes('contract')) {
      return "When reviewing contracts, pay attention to key clauses like payment terms, termination conditions, liability limitations, and dispute resolution mechanisms. Each type of contract (employment, service, lease) has specific clauses that deserve special scrutiny. Would you like me to analyze a specific type of contract?";
    } else if (question.toLowerCase().includes('trademark') || question.toLowerCase().includes('copyright')) {
      return "Intellectual property protection is essential for businesses. Trademarks protect brand identifiers like names and logos, while copyrights protect creative works. The registration process varies by country, but generally involves application, examination, and registration phases. What specific aspect of IP protection are you interested in?";
    } else if (question.toLowerCase().includes('business') || question.toLowerCase().includes('company')) {
      return "When setting up a business, you'll need to consider the legal structure (LLC, corporation, partnership, etc.), regulatory compliance, tax obligations, employment laws, and contractual relationships. Each of these aspects has different implications for liability and taxation. Could you tell me more about your business so I can provide more targeted guidance?";
    } else {
      return "Thank you for your legal question. Based on my analysis, there are several important legal principles to consider here. First, it's important to understand that legal requirements vary by jurisdiction. Second, documentation and evidence are crucial in most legal matters. Third, consulting with a licensed attorney for your specific situation is always advisable. Could you provide more details about your specific situation?";
    }
  };

  // Handle sending a message
  const handleSend = async () => {
    if (!query.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: query,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);
    
    // Simulate AI thinking with progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      // In a real implementation, this would call the API
      // For demo purposes, simulate a response after a delay
      setTimeout(() => {
        // Simulate AI response
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: generateMockResponse(query),
          sender: "ai",
          timestamp: new Date(),
          references: ["Legal Framework Act of 2023", "Supreme Court Case #12345"],
          followupQuestions: [
            "Would you like me to elaborate on any specific point?",
            "Do you need information about a specific jurisdiction?",
            "Are you facing a particular legal challenge right now?"
          ]
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
        setProgress(100);
        
        // Reset progress after a moment
        setTimeout(() => setProgress(0), 500);
        clearInterval(interval);
      }, 2000);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  // Handle pressing Enter to send
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Clear chat history
  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        content: "Chat cleared. How can I help you today?",
        sender: "ai",
        timestamp: new Date()
      }
    ]);
  };
  
  // Handle clicking a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">AI Legal Consultation</h1>
        <div className="flex gap-2">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {llmModels.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    {model.icon}
                    <span>{model.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Legal Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {legalCategories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="chat" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              <span>AI Models</span>
            </TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm" onClick={handleClearChat}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        </div>
        
        <TabsContent value="chat" className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Legal Assistant
              </CardTitle>
              <CardDescription>
                Ask any legal question and get AI-powered advice
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto pb-0">
              <div className="space-y-4 min-h-[300px]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${
                        message.sender === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar className={`h-8 w-8 mt-0.5 ${message.sender === "user" ? "bg-primary" : "bg-muted"}`}>
                        <AvatarFallback>
                          {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-2">
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {message.content}
                        </div>
                        
                        {/* References */}
                        {message.references && message.references.length > 0 && (
                          <div className="space-y-1 text-sm">
                            <p className="font-medium text-muted-foreground">References:</p>
                            <ul className="space-y-1 list-disc ml-4 text-muted-foreground">
                              {message.references.map((ref, i) => (
                                <li key={i}>{ref}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Follow-up suggestions */}
                        {message.followupQuestions && message.followupQuestions.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {message.followupQuestions.map((question, i) => (
                              <Badge 
                                key={i} 
                                variant="outline" 
                                className="cursor-pointer hover:bg-accent"
                                onClick={() => handleSuggestionClick(question)}
                              >
                                {question}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8 mt-0.5 bg-muted">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div className="rounded-lg px-4 py-2 bg-muted">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-foreground/30 animate-pulse"></div>
                            <div className="h-2 w-2 rounded-full bg-foreground/30 animate-pulse delay-150"></div>
                            <div className="h-2 w-2 rounded-full bg-foreground/30 animate-pulse delay-300"></div>
                            <span className="text-xs text-muted-foreground">Thinking...</span>
                          </div>
                        </div>
                        {progress > 0 && (
                          <Progress value={progress} className="h-1 w-36" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            
            <CardFooter className="pt-4">
              <div className="flex w-full items-center space-x-2">
                <Button variant="outline" size="icon" disabled>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your legal question..."
                  className="flex-1 min-h-10 resize-none"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!query.trim() || isLoading}
                  type="submit"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="models" className="flex-1">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>AI Models for Legal Consultation</CardTitle>
              <CardDescription>
                Choose the AI model that best fits your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {llmModels.map((model) => (
                  <Card key={model.id} className={`border-2 ${selectedModel === model.id ? 'border-primary' : 'border-transparent'}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {model.icon}
                        {model.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{model.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={selectedModel === model.id ? "default" : "outline"} 
                        className="w-full"
                        onClick={() => {
                          setSelectedModel(model.id);
                          setActiveTab("chat");
                        }}
                      >
                        {selectedModel === model.id ? "Selected" : "Select"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
