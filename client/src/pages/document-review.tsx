import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, X, Eye, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Handle file drop logic here
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Document Review</h1>
        <p className="text-muted-foreground">
          Upload your legal documents for AI-powered analysis and review
        </p>
      </div>

      <Card
        className="border-dashed"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
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
          {/* Uploaded Files */}
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
                  <Button size="icon" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Analysis Progress */}
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

          {/* Analysis Results */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Key Clauses */}
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

            {/* Strengths & Risks */}
            <div className="space-y-6">
              {/* Strengths */}
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

              {/* Risks */}
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

          {/* Recommendations */}
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