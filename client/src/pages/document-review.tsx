import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X, Eye } from "lucide-react";

interface UploadedFile {
  name: string;
  size: string;
  uploadedAt: string;
}

export default function DocumentReview() {
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      name: "Contract_Draft_v2.pdf",
      size: "2.4 MB",
      uploadedAt: "2 mins ago"
    }
  ]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Handle file drop logic here
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
        <div className="space-y-4">
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
          <Button className="w-full">Start AI Analysis</Button>
        </div>
      )}
    </div>
  );
}
