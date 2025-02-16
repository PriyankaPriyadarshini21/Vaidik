import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, X, Eye, AlertCircle, CheckCircle, AlertTriangle, Download, MessageSquare, Edit, Save, History, Share, Archive, Settings, Trash } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface UploadedFile {
  id?: number;
  name: string;
  size: string;
  uploadedAt: string;
  tags?: string[];
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
        tags: []
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

                  <div className="flex gap-4 pt-4">
                    <Button onClick={downloadReport} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Report
                    </Button>
                    <Link href="/consultation">
                      <Button variant="outline" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Consult an Expert
                      </Button>
                    </Link>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Document
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Added sections */}
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
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Share className="h-4 w-4" />
                      Share Document
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <FileText className="h-4 w-4" />
                      Export as PDF
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Archive className="h-4 w-4" />
                      Archive Document
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-600">
                      <Trash className="h-4 w-4" />
                      Delete Document
                    </Button>
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