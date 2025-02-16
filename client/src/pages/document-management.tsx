import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, Download, Eye, Trash2, Search } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  url: string;
  data?: string | ArrayBuffer | null; // For storing the actual file data
};

export default function DocumentManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string>("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const newDoc: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type.split("/")[1].toUpperCase(),
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          uploadedAt: new Date().toISOString().split("T")[0],
          url: URL.createObjectURL(file),
          data: event.target?.result || null
        };

        setDocuments(prev => [newDoc, ...prev]);
        toast({
          title: "Success",
          description: "Document uploaded successfully",
        });

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (doc: Document) => {
    try {
      if (!doc.data) throw new Error("Document data not found");

      const link = document.createElement('a');
      link.href = doc.data.toString();
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: `Downloading ${doc.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (docId: string) => {
    try {
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (doc: Document) => {
    if (!doc.data) {
      toast({
        title: "Error",
        description: "Document preview not available",
        variant: "destructive",
      });
      return;
    }
    setPreviewUrl(doc.data.toString());
    setPreviewType(doc.type.toLowerCase());
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Document Management</h1>
        <p className="text-muted-foreground">
          Upload, manage and preview your legal documents
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, DOCX, DOC
                  </p>
                </div>
              </Label>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Documents</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.type} • {doc.size} • Uploaded on {doc.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePreview(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredDocuments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No documents found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!previewUrl} onOpenChange={() => {
        setPreviewUrl(null);
        setPreviewType("");
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
            <DialogDescription>
              You can scroll to view the entire document
            </DialogDescription>
          </DialogHeader>
          {previewUrl && (
            <div className="mt-4 overflow-auto max-h-[calc(80vh-8rem)]">
              {previewType === 'pdf' ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-[600px] rounded-lg"
                  title="Document Preview"
                />
              ) : (
                <div className="bg-white p-4 rounded-lg">
                  <img 
                    src={previewUrl} 
                    alt="Document Preview" 
                    className="max-w-full h-auto"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}