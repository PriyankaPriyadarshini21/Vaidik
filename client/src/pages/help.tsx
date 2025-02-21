import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, HelpCircle, MessageSquare, Clock, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'admin';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered';
}

interface Conversation {
  id: number;
  subject: string;
  messages: Message[];
  status: 'active' | 'closed';
  createdAt: Date;
  isTyping?: boolean;
}

export default function Help() {
  const { toast } = useToast();
  const [query, setQuery] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newConversation: Conversation = {
      id: Date.now(),
      subject: query.subject,
      messages: [
        {
          id: Date.now(),
          content: query.message,
          sender: 'user',
          timestamp: new Date(),
          status: 'sent'
        }
      ],
      status: 'active',
      createdAt: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);

    toast({
      title: "Query Submitted",
      description: "Your message has been sent to our admin team.",
    });
    setQuery({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === newConversation.id
            ? { ...conv, isTyping: true }
            : conv
        )
      );
    }, 1000);

    setTimeout(() => {
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === newConversation.id) {
            return {
              ...conv,
              isTyping: false,
              messages: [
                ...conv.messages,
                {
                  id: Date.now(),
                  content: "Thank you for reaching out. I'm here to help! Could you please provide more details about your query?",
                  sender: 'admin',
                  timestamp: new Date(),
                  status: 'delivered'
                }
              ]
            };
          }
          return conv;
        })
      );
    }, 3000);
  };

  const handleSendMessage = (conversationId: number) => {
    if (!newMessage.trim()) return;

    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              {
                id: Date.now(),
                content: newMessage,
                sender: 'user',
                timestamp: new Date(),
                status: 'sending'
              }
            ]
          };
        }
        return conv;
      })
    );

    const message = newMessage;
    setNewMessage('');

    setTimeout(() => {
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: conv.messages.map(msg =>
                msg.status === 'sending' ? { ...msg, status: 'sent' } : msg
              )
            };
          }
          return conv;
        })
      );
    }, 500);

    setTimeout(() => {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, isTyping: true }
            : conv
        )
      );
    }, 1000);

    setTimeout(() => {
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              isTyping: false,
              messages: [
                ...conv.messages,
                {
                  id: Date.now(),
                  content: "Thanks for your message. How can I assist you further?",
                  sender: 'admin',
                  timestamp: new Date(),
                  status: 'delivered'
                }
              ]
            };
          }
          return conv;
        })
      );
    }, 3000);
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Help & Support</h1>
        <p className="text-muted-foreground">
          Get help with using the platform and find answers to common questions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">1. Document Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your legal documents in PDF or DOCX format for AI-powered analysis
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">2. AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI will analyze your documents for key clauses, risks, and recommendations
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">3. Expert Consultation</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with legal experts for professional advice and document review
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href="mailto:contact@vidhikai.com"
                  className="text-primary hover:underline"
                >
                  contact@vidhikai.com
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Our support team is available Monday through Friday, 9 AM to 6 PM IST
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Submit a Query
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={query.name}
                    onChange={(e) => setQuery({ ...query, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={query.email}
                    onChange={(e) => setQuery({ ...query, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={query.subject}
                    onChange={(e) => setQuery({ ...query, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={query.message}
                    onChange={(e) => setQuery({ ...query, message: e.target.value })}
                    required
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Start Conversation
                </Button>
              </form>
            </CardContent>
          </Card>

          {conversations.map((conversation) => (
            <Card key={conversation.id} className="relative max-w-3xl mx-auto">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <span className="font-semibold">{conversation.subject}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(conversation.createdAt).toLocaleString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 h-[400px] overflow-y-auto mb-4 pr-2">
                  {conversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 px-2",
                        message.sender === 'admin' ? 'flex-row' : 'flex-row-reverse'
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
                          message.sender === 'admin'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <User className="w-4 h-4" />
                      </div>
                      <div
                        className={cn(
                          "flex flex-col max-w-[70%]",
                          message.sender === 'admin' ? 'items-start' : 'items-end'
                        )}
                      >
                        <div
                          className={cn(
                            "rounded-lg p-3 shadow-sm",
                            message.sender === 'admin'
                              ? 'bg-muted'
                              : 'bg-primary text-primary-foreground'
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1 px-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                          {message.sender === 'user' && (
                            <span className="text-xs text-muted-foreground">
                              {message.status === 'sending' && '• Sending...'}
                              {message.status === 'sent' && '• Sent'}
                              {message.status === 'delivered' && '• Delivered'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {conversation.isTyping && (
                    <div className="flex items-center gap-2 text-muted-foreground px-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Admin is typing...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-2 mt-4 sticky bottom-0 bg-background p-2 border-t">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(conversation.id);
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleSendMessage(conversation.id)}
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}