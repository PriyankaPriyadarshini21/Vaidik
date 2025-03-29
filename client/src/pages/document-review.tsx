import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, Upload, X, Eye, AlertCircle, CheckCircle, 
  AlertTriangle, Download, MessageSquare, Edit, Save, 
  History, Share, Archive, Settings, Trash, Users, 
  Calendar, PieChart, Split, Diff, FileSearch, 
  Scissors, Bookmark, Clock, GitCompare, ScrollText,
  UserPlus, Bot, BarChart3, Copy, HelpCircle, ShieldCheck 
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { DocumentActions } from "@/components/document/document-actions";
import { useIsMobile } from "@/hooks/use-mobile";

interface UploadedFile {
  id?: number;
  name: string;
  size: string;
  uploadedAt: string;
  tags?: string[];
  fileUrl?: string; // Added fileUrl
}

interface AnalysisResult {
  status: 'analyzing' | 'complete';
  progress: number;
  keyClauses: Array<{ title: string; content: string; type: 'neutral' | 'positive' | 'negative' }>;
  strengths: string[];
  risks: string[];
  recommendations: string[];
  summary: string;
}

export default function DocumentReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [currentFile, setCurrentFile] = useState<UploadedFile | null>(null);
  const [newTag, setNewTag] = useState("");
  const [editingFileName, setEditingFileName] = useState("");

  const [analysis, setAnalysis] = useState<AnalysisResult>({
    status: 'analyzing',
    progress: 0,
    keyClauses: [],
    strengths: [],
    risks: [],
    recommendations: [],
    summary: ''
  });

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    const formData = new FormData();
    formData.append('file', droppedFiles[0]);

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const document = await response.json();
      setCurrentFile({
        name: document.filename,
        size: document.fileSize,
        uploadedAt: 'Just now',
        tags: [],
        fileUrl: document.fileUrl // Added fileUrl
      });

      // Start AI analysis
      startAnalysis();

      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during upload',
        variant: 'destructive',
      });
    }
  };

  const startAnalysis = () => {
    setAnalysis(prev => ({ ...prev, status: 'analyzing', progress: 0 }));

    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setAnalysis(prev => {
        if (prev.progress >= 100) {
          clearInterval(interval);
          return {
            status: 'complete',
            progress: 100,
            keyClauses: [
              {
                title: "Termination Clause",
                content: "Either party may terminate with 30 days notice",
                type: "neutral"
              },
              {
                title: "Liability Protection",
                content: "Strong indemnification provisions",
                type: "positive"
              },
              {
                title: "Payment Terms",
                content: "Payment schedule is not clearly defined",
                type: "negative"
              }
            ],
            strengths: [
              "Comprehensive intellectual property protection",
              "Clear dispute resolution process",
              "Well-defined confidentiality terms"
            ],
            risks: [
              "Vague payment terms could lead to disputes",
              "Missing force majeure clause",
              "Limited liability cap may be insufficient"
            ],
            recommendations: [
              "Add specific payment milestones and deadlines",
              "Include force majeure provisions",
              "Review and potentially increase liability cap"
            ],
            summary: "This document provides a solid foundation but requires some refinements in key areas, particularly regarding payment terms and risk management provisions."
          };
        }
        return { ...prev, progress: prev.progress + 2 };
      });
    }, 100);
  };

  const handleAddTag = () => {
    if (!newTag.trim() || !currentFile) return;
    setCurrentFile({
      ...currentFile,
      tags: [...(currentFile.tags || []), newTag.trim()]
    });
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!currentFile) return;
    setCurrentFile({
      ...currentFile,
      tags: currentFile.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const handleRenameFile = () => {
    if (!currentFile || !editingFileName.trim()) return;
    setCurrentFile({
      ...currentFile,
      name: editingFileName.trim()
    });
    setEditingFileName("");
  };

  const downloadReport = () => {
    // In a real implementation, this would generate a PDF report
    toast({
      title: 'Report Downloaded',
      description: 'The analysis report has been downloaded successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Document Review</h1>
        <p className="text-muted-foreground">
          Upload your legal documents for AI-powered analysis and review
        </p>
      </div>

      {!currentFile ? (
        <Card
          className="border-dashed cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const formData = new FormData();
                formData.append('file', file);
                handleDrop({ preventDefault: () => {}, dataTransfer: { files: [file] } } as any);
              }
            }}
          />
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Drag and drop your files here
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOCX, DOC
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {editingFileName ? (
                      <div className="flex gap-2">
                        <Input
                          value={editingFileName}
                          onChange={(e) => setEditingFileName(e.target.value)}
                          className="max-w-xs"
                        />
                        <Button
                          size="sm"
                          onClick={handleRenameFile}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="font-medium">{currentFile.name}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingFileName(currentFile.name)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentFile.size} • Uploaded {currentFile.uploadedAt}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex gap-2 items-center mb-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="max-w-xs"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag}>Add Tag</Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {currentFile.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {analysis.status === 'analyzing' ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analysis in Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={analysis.progress} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  Analyzing document contents... {analysis.progress}%
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Clauses & Terms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.keyClauses.map((clause, index) => (
                      <Collapsible key={index}>
                        <CollapsibleTrigger className="flex items-center gap-2 w-full text-left">
                          {clause.type === 'positive' && <CheckCircle className="h-5 w-5 text-green-600" />}
                          {clause.type === 'negative' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                          {clause.type === 'neutral' && <AlertCircle className="h-5 w-5 text-blue-600" />}
                          <span className={`font-medium ${
                            clause.type === 'positive' ? 'text-green-600' :
                            clause.type === 'negative' ? 'text-red-600' :
                            'text-blue-600'
                          }`}>
                            {clause.title}
                          </span>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-7 pt-2">
                          <p className="text-sm text-muted-foreground">{clause.content}</p>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Pros & Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-green-600">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Cons & Risks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.risks.map((risk, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-red-600">•</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Tabs defaultValue="summary" className="space-y-4">
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="summary">Analysis Summary</TabsTrigger>
                  <TabsTrigger value="version">Version Comparison</TabsTrigger>
                  <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                  <Card>
                    <CardHeader>
                      <CardTitle>Summary & Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-sm text-muted-foreground">{analysis.summary}</p>

                      <div className="space-y-4">
                        <h4 className="font-medium">Recommended Actions:</h4>
                        <ul className="space-y-2">
                          {analysis.recommendations.map((recommendation, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {recommendation}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <DocumentActions 
                        document={{
                          id: currentFile?.id || 0,
                          title: currentFile?.name || '',
                          type: 'document',
                          content: {},
                          status: 'active',
                          userId: 0, 
                          filename: currentFile?.name || '',
                          fileSize: currentFile?.size || '',
                          fileUrl: currentFile?.fileUrl || '',
                          createdAt: new Date(),
                          updatedAt: new Date(),
                          tags: currentFile?.tags || [],
                          expiresAt: null
                        }}
                        variant="summary"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="version">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GitCompare className="h-5 w-5" />
                        Document Version Comparison
                      </CardTitle>
                      <CardDescription>
                        Compare this document with previous versions or template standards
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Compare with:</h4>
                          <Select defaultValue="previous">
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select version" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="previous">Previous Version (v1.2)</SelectItem>
                              <SelectItem value="template">Standard Template</SelectItem>
                              <SelectItem value="custom">Custom Document</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 border rounded-md p-4 bg-muted/30">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge>Current Version</Badge>
                              <p className="text-sm text-muted-foreground">Last updated: Mar 15, 2025</p>
                            </div>
                            <div className="border rounded-md p-3 bg-card h-[220px] overflow-auto">
                              <p className="text-sm">
                                <strong>5.1 Termination.</strong> Either party may terminate this Agreement with thirty (30) days prior written notice. Upon termination, Client shall pay Consultant for all services performed up to the date of termination.
                              </p>
                              <p className="text-sm mt-2">
                                <strong>5.2 Material Breach.</strong> Either party may terminate this Agreement immediately upon written notice in the event of a material breach by the other party.
                              </p>
                              <p className="text-sm mt-2">
                                <strong>6.1 Payment Terms.</strong> Payment shall be made within 30 days of invoice receipt.
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">Previous Version</Badge>
                              <p className="text-sm text-muted-foreground">Created: Feb 28, 2025</p>
                            </div>
                            <div className="border rounded-md p-3 bg-card h-[220px] overflow-auto">
                              <p className="text-sm">
                                <strong>5.1 Termination.</strong> <span className="bg-yellow-100 dark:bg-yellow-950/30">Either party may terminate this Agreement with <del className="text-red-500">fifteen (15)</del> <ins className="text-green-500">thirty (30)</ins> days prior written notice.</span> Upon termination, Client shall pay Consultant for all services performed up to the date of termination.
                              </p>
                              <p className="text-sm mt-2">
                                <strong>5.2 Material Breach.</strong> Either party may terminate this Agreement immediately upon written notice in the event of a material breach by the other party.
                              </p>
                              <p className="text-sm mt-2 bg-red-100 dark:bg-red-950/30">
                                <strong>6.1 Payment Terms.</strong> <del>Payment shall be made upon delivery of services.</del>
                              </p>
                              <p className="text-sm mt-2 bg-green-100 dark:bg-green-950/30">
                                <strong>6.1 Payment Terms.</strong> <ins>Payment shall be made within 30 days of invoice receipt.</ins>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <Diff className="h-4 w-4" />
                          Key Changes
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2" />
                            <p className="text-sm">Extended termination notice period from 15 days to 30 days</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                            <p className="text-sm">Added net-30 payment terms which better protects cash flow</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                            <p className="text-sm">Improved clarity on termination payment obligations</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download Comparison Report
                        </Button>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="secondary" className="flex items-center gap-2">
                                <Bot className="h-4 w-4" />
                                AI Analysis
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Get AI analysis of the changes and their legal implications</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="collaboration">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Collaboration Tools
                      </CardTitle>
                      <CardDescription>
                        Share and collaborate on this document with your team
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Document Access</h4>
                        <div className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <UserPlus className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm font-medium">Invite Team Members</p>
                            </div>
                            <Button variant="outline" size="sm">Manage Access</Button>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">JD</div>
                                <div>
                                  <p className="text-sm font-medium">Jane Doe</p>
                                  <p className="text-xs text-muted-foreground">jane.doe@example.com</p>
                                </div>
                              </div>
                              <Badge>Owner</Badge>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">JS</div>
                                <div>
                                  <p className="text-sm font-medium">John Smith</p>
                                  <p className="text-xs text-muted-foreground">john.smith@example.com</p>
                                </div>
                              </div>
                              <Badge variant="outline">Editor</Badge>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <Input 
                                placeholder="Email address" 
                                className="max-w-xs h-8 text-sm" 
                              />
                              <Select defaultValue="editor">
                                <SelectTrigger className="w-[110px] h-8">
                                  <SelectValue placeholder="Permission" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                  <SelectItem value="commenter">Commenter</SelectItem>
                                  <SelectItem value="editor">Editor</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button size="sm">Invite</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Comments & Feedback</h4>
                        <Textarea placeholder="Add a comment or feedback about this document..." className="h-20 resize-none" />
                        <div className="flex justify-end">
                          <Button>Add Comment</Button>
                        </div>
                        
                        <div className="space-y-4 mt-2">
                          <div className="border rounded-md p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-xs">JS</div>
                                <div>
                                  <p className="text-sm font-medium">John Smith</p>
                                  <p className="text-xs text-muted-foreground">Mar 18, 2025</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm">The payment terms need to be more specific. Can we add something about late payment penalties?</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">Reply</Button>
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">Resolve</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <Button variant="outline" className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Start Group Discussion
                        </Button>
                        <Button className="flex items-center gap-2">
                          <Share className="h-4 w-4" />
                          Share Document
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Similar Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Service Agreement - Tech Solutions</p>
                          <p className="text-sm text-muted-foreground">85% similar content</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">IT Services Contract - Project Beta</p>
                          <p className="text-sm text-muted-foreground">72% similar content</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Consulting Agreement Template</p>
                          <p className="text-sm text-muted-foreground">65% similar content</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Document History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                        <div>
                          <p className="font-medium">Initial Upload</p>
                          <p className="text-sm text-muted-foreground">Feb 16, 2025 - 10:30 AM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                        <div>
                          <p className="font-medium">AI Analysis Completed</p>
                          <p className="text-sm text-muted-foreground">Feb 16, 2025 - 10:32 AM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                        <div>
                          <p className="font-medium">Tags Added</p>
                          <p className="text-sm text-muted-foreground">Feb 16, 2025 - 10:35 AM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Document Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DocumentActions
                      document={{
                        id: currentFile?.id || 0,
                        title: currentFile?.name || '',
                        type: 'document',
                        content: {},
                        status: 'active',
                        userId: 0, 
                        filename: currentFile?.name || '',
                        fileSize: currentFile?.size || '',
                        fileUrl: currentFile?.fileUrl || '',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        tags: currentFile?.tags || [],
                        expiresAt: null
                      }}
                      variant="sidebar"
                    />
                  </CardContent>
                </Card>
              </div>

            </>
          )}
        </div>
      )}
    </div>
  );
}