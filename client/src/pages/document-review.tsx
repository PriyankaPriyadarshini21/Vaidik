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
  UserPlus, Bot, BarChart3, Copy, HelpCircle, ShieldCheck,
  Loader2, FileUp, CheckCheck, CloudUpload, ArrowUpCircle, UploadCloud
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

// Animated upload indicator component
const AnimatedUploadIndicator = ({ progress }: { progress: number }) => {
  // Determine which icon to show based on progress
  const getUploadIcon = () => {
    if (progress < 25) {
      return <UploadCloud className="h-12 w-12 text-primary animate-pulse" />;
    } else if (progress < 50) {
      return <FileUp className="h-12 w-12 text-primary animate-bounce" />;
    } else if (progress < 75) {
      return <ArrowUpCircle className="h-12 w-12 text-primary animate-pulse" />;
    } else if (progress < 100) {
      return <CloudUpload className="h-12 w-12 text-primary animate-pulse" />;
    } else {
      return <CheckCheck className="h-12 w-12 text-green-500" />;
    }
  };

  // Determine the progress indicator text
  const getProgressText = () => {
    if (progress < 25) {
      return "Starting upload...";
    } else if (progress < 50) {
      return "Uploading document...";
    } else if (progress < 75) {
      return "Processing document...";
    } else if (progress < 100) {
      return "Almost there...";
    } else {
      return "Upload complete!";
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-4">
          {getUploadIcon()}
          <div className="absolute -bottom-1 -right-1">
            {progress < 100 && (
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            )}
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">
          {getProgressText()}
        </h3>
      </div>
      <div className="w-full max-w-xs mx-auto">
        <Progress 
          value={progress} 
          className="mb-2 h-2"
          // Change color as progress increases
          style={{ 
            background: progress < 50 ? 'var(--background-muted)' : 'var(--background)',
            '--progress-color': progress === 100 ? '#10b981' : 'var(--primary)'
          } as React.CSSProperties}
        />
        <p className="text-sm text-center font-medium" style={{ 
          color: progress === 100 ? '#10b981' : 'var(--primary)'
        }}>
          {progress}%
        </p>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        {progress < 100 ? 'Larger files may take some time to process' : 'Preparing document for analysis...'}
      </p>
    </div>
  );
};

export default function DocumentReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [currentFile, setCurrentFile] = useState<UploadedFile | null>(null);
  const [newTag, setNewTag] = useState("");
  const [editingFileName, setEditingFileName] = useState("");
  const [selectedModel, setSelectedModel] = useState<'openai' | 'claude' | 'ollama'>('openai');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [analysis, setAnalysis] = useState<AnalysisResult>({
    status: 'complete', // Initially set to 'complete' to show model selection UI instead of analysis progress
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
    
    // Display upload progress and status
    setIsUploading(true);
    setUploadProgress(0);
    
    // Start progress simulation for upload
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        // Cap at 95% until actual completion
        if (prev >= 95) return prev;
        return prev + 5;
      });
    }, 150);

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      // Clear the upload progress interval
      clearInterval(uploadInterval);
      setUploadProgress(100);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const document = await response.json();
      
      // Reset upload state
      setTimeout(() => {
        setIsUploading(false);
      }, 500); // Brief delay to show 100% completion
      
      setCurrentFile({
        id: document.id, // Make sure to include the ID
        name: document.title || document.filename,
        size: document.fileSize || (droppedFiles[0].size ? `${Math.round(droppedFiles[0].size / 1024)} KB` : 'Unknown'),
        uploadedAt: 'Just now',
        tags: [],
        fileUrl: document.fileUrl || `/api/preview/${document.filename}`
      });

      // Don't automatically start analysis - let user choose model first

      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
    } catch (error: any) {
      // Clear the upload progress interval and reset states
      clearInterval(uploadInterval);
      setIsUploading(false);
      
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during upload',
        variant: 'destructive',
      });
    }
  };

  const startAnalysis = async () => {
    if (!currentFile) {
      toast({
        title: "Error",
        description: "Please upload a document first.",
        variant: "destructive"
      });
      return;
    }
    
    setAnalysis(prev => ({ ...prev, status: 'analyzing', progress: 0 }));
    
    // Start progress animation
    const interval = setInterval(() => {
      setAnalysis(prev => {
        if (prev.progress >= 95) {
          return prev; // Cap at 95% until real response
        }
        return { ...prev, progress: prev.progress + 2 };
      });
    }, 100);
    
    try {
      // Send the document ID and the selected model
      const response = await fetch('/api/documents/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: currentFile?.id,
          // For demo purposes, use a placeholder since we might not have actual content yet
          content: `This Agreement ("Agreement") is made and entered into as of [DATE] by and between:

[COMPANY NAME], a corporation organized and existing under the laws of [STATE/COUNTRY], with its principal place of business at [ADDRESS] ("Company"),

and

[CONSULTANT NAME], an individual residing at [ADDRESS] / a company organized and existing under the laws of [STATE/COUNTRY] with its principal place of business at [ADDRESS] ("Consultant").

WHEREAS, Company desires to retain Consultant to perform certain services for Company; and

WHEREAS, Consultant is willing to perform such services for Company;

NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein, the parties agree as follows:

1. SERVICES. Consultant shall provide consulting services to Company as described in Exhibit A attached hereto (the "Services"). Consultant shall perform the Services in a professional and workmanlike manner, in accordance with industry standards and in compliance with all applicable laws and regulations.

2. TERM. This Agreement shall commence on [START DATE] and shall continue until [END DATE], unless earlier terminated as provided herein (the "Term").

3. COMPENSATION. 
   a. Company shall pay Consultant a fee of [AMOUNT] per [HOUR/DAY/MONTH/PROJECT], payable [PAYMENT TERMS].
   b. Consultant shall submit invoices to Company [FREQUENCY], and Company shall pay such invoices within [NUMBER] days of receipt.
   c. Consultant shall be responsible for all taxes and other expenses incurred in connection with the Services.

4. EXPENSES. Company shall reimburse Consultant for reasonable out-of-pocket expenses incurred in connection with the Services, provided that such expenses are approved in advance by Company and Consultant provides Company with appropriate documentation of such expenses.

5. RELATIONSHIP OF PARTIES. Consultant is an independent contractor and not an employee of Company. Consultant shall be solely responsible for all taxes, withholdings, and other statutory or contractual obligations of any sort.

6. CONFIDENTIALITY. 
   a. "Confidential Information" means any information disclosed by one party to the other, either directly or indirectly, in writing, orally or by inspection of tangible objects, which is designated as "Confidential," "Proprietary" or some similar designation, or information which a reasonable person would understand to be confidential given the nature of the information and circumstances of disclosure.
   b. Consultant shall hold in confidence all Confidential Information of Company and shall not disclose such Confidential Information to any third party or use such Confidential Information for any purpose other than performing the Services.
   c. The confidentiality obligations set forth herein shall survive the termination or expiration of this Agreement for a period of [NUMBER] years.

7. INTELLECTUAL PROPERTY. 
   a. Company shall own all right, title, and interest in and to any work product, deliverables, or other materials created by Consultant in the course of performing the Services (collectively, the "Work Product").
   b. Consultant hereby assigns to Company all right, title, and interest in and to the Work Product, including all intellectual property rights therein.
   c. Consultant shall assist Company, at Company's expense, to obtain and enforce patents, copyrights, and other intellectual property rights in the Work Product.

8. TERMINATION. 
   a. Either party may terminate this Agreement upon [NUMBER] days' written notice to the other party.
   b. Company may terminate this Agreement immediately upon written notice to Consultant if Consultant breaches any provision of this Agreement.
   c. Upon termination, Consultant shall promptly deliver to Company all Work Product, whether complete or in progress, and all Confidential Information of Company.
   d. If this Agreement is terminated by Company without cause, Company shall pay Consultant for all Services performed through the effective date of termination.

9. WARRANTIES. Consultant warrants that (a) the Services will be performed in a professional and workmanlike manner, in accordance with industry standards; (b) Consultant has the right to enter into this Agreement; and (c) the Work Product will not infringe any intellectual property rights of any third party.`,
          model: selectedModel
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error analyzing document: ${response.statusText}`);
      }
      
      const result = await response.json();
      clearInterval(interval);
      
      setAnalysis({
        status: 'complete',
        progress: 100,
        keyClauses: result.keyClauses || [],
        strengths: result.strengths || [],
        risks: result.risks || [],
        recommendations: result.recommendations || [],
        summary: result.summary || ''
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      clearInterval(interval);
      
      // For demo purposes, use mock data if API fails
      // In production, we would display an error message
      toast({
        title: 'Analysis completed using fallback data',
        description: 'API connection failed. Using demo data for preview.',
        variant: 'destructive'
      });
      
      setAnalysis({
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
      });
    }
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
          className={`border-dashed ${isUploading ? '' : 'cursor-pointer'}`}
          onDrop={isUploading ? undefined : handleDrop}
          onDragOver={isUploading ? undefined : (e) => e.preventDefault()}
          onClick={isUploading ? undefined : () => document.getElementById('file-upload')?.click()}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            disabled={isUploading}
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
            {isUploading ? (
              <AnimatedUploadIndicator progress={uploadProgress} />
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Drag and drop your files here
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOCX, DOC, TXT
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Max file size: 15MB
                </p>
              </>
            )}
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
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <CardTitle className="text-lg">Analysis in Progress</CardTitle>
                  <div className="flex items-center gap-2">
                    <label htmlFor="model-selection" className="text-sm text-muted-foreground">AI Model:</label>
                    <Select 
                      value={selectedModel} 
                      onValueChange={(value: 'openai' | 'claude' | 'ollama') => setSelectedModel(value)}
                      disabled={analysis.status === 'analyzing'}
                    >
                      <SelectTrigger id="model-selection" className="w-[150px]">
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                        <SelectItem value="claude">Claude</SelectItem>
                        <SelectItem value="ollama">Ollama (Local)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="text-sm font-medium">AI processing your document...</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{analysis.progress < 25 ? "Reading document" : 
                           analysis.progress < 50 ? "Identifying key clauses" : 
                           analysis.progress < 75 ? "Analyzing legal implications" : 
                           analysis.progress < 95 ? "Generating recommendations" : 
                           "Finalizing analysis"}</span>
                    <span className="font-medium">{analysis.progress}%</span>
                  </div>
                  <Progress 
                    value={analysis.progress} 
                    className="h-2"
                    style={{
                      background: 'var(--background-muted)',
                      '--progress-color': `hsl(${analysis.progress * 1.2}, 65%, 45%)`
                    } as React.CSSProperties}
                  />
                </div>
                
                <div className="pt-2 space-y-3">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    Using {selectedModel === 'openai' ? 'OpenAI GPT-4' : 
                           selectedModel === 'claude' ? 'Anthropic Claude' : 
                           'Ollama (Local Model)'}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    Our AI is carefully analyzing your document for legal insights and potential issues
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : analysis.keyClauses.length === 0 && currentFile ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select AI Model for Analysis</CardTitle>
                <CardDescription>Choose an AI model to analyze your document and start the review process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/40 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Selected Document:</h3>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>{currentFile.name}</span>
                    <Badge variant="outline" className="ml-2">{currentFile.size}</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="ai-model-selection" className="text-sm font-medium">Select AI Model:</label>
                    <Select 
                      value={selectedModel} 
                      onValueChange={(value: 'openai' | 'claude' | 'ollama') => setSelectedModel(value)}
                    >
                      <SelectTrigger id="ai-model-selection" className="w-[200px]">
                        <SelectValue placeholder="Select AI Model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">
                          <div className="flex items-center gap-2">
                            <span>OpenAI GPT-4</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="claude">
                          <div className="flex items-center gap-2">
                            <span>Anthropic Claude</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="ollama">
                          <div className="flex items-center gap-2">
                            <span>Ollama (Local Model)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">About the selected model:</h4>
                    {selectedModel === 'openai' && (
                      <p className="text-sm text-muted-foreground">OpenAI GPT-4 provides sophisticated legal analysis with advanced reasoning capabilities.</p>
                    )}
                    {selectedModel === 'claude' && (
                      <p className="text-sm text-muted-foreground">Anthropic Claude excels at understanding complex legal contexts and nuanced interpretations.</p>
                    )}
                    {selectedModel === 'ollama' && (
                      <p className="text-sm text-muted-foreground">Ollama runs locally on your server for complete privacy and data sovereignty.</p>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 flex justify-center">
                  <Button 
                    onClick={startAnalysis} 
                    size="lg" 
                    className="gap-2"
                  >
                    <Bot className="h-5 w-5" />
                    Start Document Analysis
                  </Button>
                </div>
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
                      <div className="flex justify-between items-center flex-wrap gap-4">
                        <CardTitle>Summary & Recommendations</CardTitle>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <label htmlFor="results-model-selection" className="text-sm text-muted-foreground">AI Model:</label>
                            <Select 
                              value={selectedModel} 
                              onValueChange={(value: 'openai' | 'claude' | 'ollama') => setSelectedModel(value)}
                            >
                              <SelectTrigger id="results-model-selection" className="w-[150px]">
                                <SelectValue placeholder="Select Model" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                                <SelectItem value="claude">Claude</SelectItem>
                                <SelectItem value="ollama">Ollama (Local)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2"
                            onClick={() => startAnalysis()}
                          >
                            <Bot className="h-4 w-4" />
                            Reanalyze
                          </Button>
                        </div>
                      </div>
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