import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, HelpCircle, MessageSquare, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'admin';
  timestamp: Date;
}

interface Conversation {
  id: number;
  subject: string;
  messages: Message[];
  status: 'active' | 'closed';
  createdAt: Date;
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
          timestamp: new Date()
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
                timestamp: new Date()
              }
            ]
          };
        }
        return conv;
      })
    );

    // Simulate admin response
    setTimeout(() => {
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: Date.now(),
                  content: "Thanks for your message. How can I assist you further?",
                  sender: 'admin',
                  timestamp: new Date()
                }
              ]
            };
          }
          return conv;
        })
      );
    }, 1000);

    setNewMessage('');
  };

  return (
    <div className="space-y-12">
      {/* Help & Support Section */}
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
            <Card key={conversation.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {conversation.subject}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(conversation.createdAt).toLocaleString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${
                        message.sender === 'admin' ? 'flex-row' : 'flex-row-reverse'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          message.sender === 'admin'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <User className="w-4 h-4" />
                      </div>
                      <div
                        className={`flex flex-col max-w-[80%] ${
                          message.sender === 'admin' ? 'items-start' : 'items-end'
                        }`}
                      >
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender === 'admin'
                              ? 'bg-muted'
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
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
                  />
                  <Button
                    onClick={() => handleSendMessage(conversation.id)}
                    size="icon"
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