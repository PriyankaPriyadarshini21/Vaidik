import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Help() {
  const { toast } = useToast();
  const [query, setQuery] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the query to your backend
    toast({
      title: "Query Submitted",
      description: "We'll get back to you soon!",
    });
    setQuery({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="space-y-6">
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
                Send Query
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}