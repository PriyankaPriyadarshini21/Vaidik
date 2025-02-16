import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, X, Eye, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  size: string;
  uploadedAt: string;
}

interface AnalysisResult {
  status: 'analyzing' | 'complete';
  progress: number;
  keyClauses: Array<{ title: string; content: string; type: 'neutral' | 'positive' | 'negative' }>;
  strengths: string[];
  risks: string[];
  recommendations: string[];
}

export default function DocumentReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      name: "Contract_Draft_v2.pdf",
      size: "2.4 MB",
      uploadedAt: "2 mins ago"
    }
  ]);

  const [analysis, setAnalysis] = useState<AnalysisResult>({
    status: 'analyzing',
    progress: 45,
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
    ]
  });
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append('file', selectedFiles[0]);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getStatusColor = (type: 'neutral' | 'positive' | 'negative') => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const getStatusIcon = (type: 'neutral' | 'positive' | 'negative') => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'negative':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  const handlePreviewClick = (file: UploadedFile) => {
    setSelectedFile(file);
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Document Review</h1>
        <p className="text-muted-foreground">
          Upload your legal documents for AI-powered analysis and review
        </p>
      </div>

      <Card
        className="border-dashed cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
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

      {files.length > 0 && (
        <div className="space-y-6">
          {files.map((file, index) => (
            <Card key={index}>
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.size} • Uploaded {file.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handlePreviewClick(file)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>{file.name}</DialogTitle>
                      </DialogHeader>
                      <div className="flex-1 overflow-auto">
                        {file.name.toLowerCase().endsWith('.pdf') ? (
                          <iframe
                            src={`/api/preview/${encodeURIComponent(file.name)}`}
                            className="w-full h-full border-0"
                            title="Document Preview"
                          />
                        ) : (
                          <div className="bg-muted rounded-lg p-4 h-full flex items-center justify-center">
                            <p className="text-muted-foreground">
                              Preview not available for this file type.
                              You can download the file to view it.
                            </p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button size="icon" variant="ghost" className="text-destructive">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {analysis.status === 'analyzing' && (
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
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Key Clauses & Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.keyClauses.map((clause, index) => (
                  <Collapsible key={index}>
                    <CollapsibleTrigger className="flex items-center gap-2 w-full text-left">
                      {getStatusIcon(clause.type)}
                      <span className={`font-medium ${getStatusColor(clause.type)}`}>
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
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}