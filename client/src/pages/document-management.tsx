import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, Download, Eye, Trash2, Search, Edit2, Check, X } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type DocumentStatus = 'active' | 'expired' | 'in-review' | 'draft';

type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  url: string;
  status: DocumentStatus;
  data?: string | ArrayBuffer | null;
};

export default function DocumentManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "status">("date");
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with sample documents
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Service Agreement.pdf",
      type: "PDF",
      size: "1.2 MB",
      uploadedAt: "2025-02-16",
      url: "/documents/service-agreement.pdf",
      status: "active"
    },
    {
      id: "2",
      name: "Employee Contract.docx",
      type: "DOCX",
      size: "850 KB",
      uploadedAt: "2025-02-15",
      url: "/documents/employee-contract.docx",
      status: "in-review"
    },
    {
      id: "3",
      name: "NDA Template.pdf",
      type: "PDF",
      size: "500 KB",
      uploadedAt: "2025-02-14",
      url: "/documents/nda-template.pdf",
      status: "draft"
    },
    {
      id: "4",
      name: "Old Contract.pdf",
      type: "PDF",
      size: "1.5 MB",
      uploadedAt: "2024-12-31",
      url: "/documents/old-contract.pdf",
      status: "expired"
    }
  ]);

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
          status: 'draft',
          data: event.target?.result || null
        };

        setDocuments(prev => [newDoc, ...prev]);
        toast({
          title: "Success",
          description: "Document uploaded successfully",
        });

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
      if (!doc.data && !doc.url) throw new Error("Document data not found");

      const link = document.createElement('a');
      link.href = doc.data?.toString() || doc.url;
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
    if (!doc.data && !doc.url) {
      toast({
        title: "Error",
        description: "Document preview not available",
        variant: "destructive",
      });
      return;
    }
    setPreviewUrl(doc.data?.toString() || doc.url);
    setPreviewType(doc.type.toLowerCase());
  };

  const handleUpdateStatus = (docId: string, newStatus: DocumentStatus) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, status: newStatus } : doc
    ));
    toast({
      title: "Success",
      description: "Document status updated",
    });
  };

  const startEditing = (doc: Document) => {
    setEditingId(doc.id);
    setEditName(doc.name);
  };

  const saveEditing = () => {
    if (!editingId) return;

    setDocuments(prev => prev.map(doc =>
      doc.id === editingId ? { ...doc, name: editName } : doc
    ));
    setEditingId(null);
    setEditName("");
    toast({
      title: "Success",
      description: "Document name updated",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500';
      case 'expired': return 'bg-red-500/10 text-red-500';
      case 'in-review': return 'bg-yellow-500/10 text-yellow-500';
      case 'draft': return 'bg-gray-500/10 text-gray-500';
    }
  };

  let filteredAndSortedDocs = [...documents];

  // Filter by status
  if (selectedStatus !== 'all') {
    filteredAndSortedDocs = filteredAndSortedDocs.filter(
      doc => doc.status === selectedStatus
    );
  }

  // Filter by search
  filteredAndSortedDocs = filteredAndSortedDocs.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort documents
  filteredAndSortedDocs.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return b.uploadedAt.localeCompare(a.uploadedAt);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

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
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <CardTitle>Your Documents</CardTitle>
              <div className="flex items-center gap-4">
                <Select value={selectedStatus} onValueChange={(value: DocumentStatus | "all") => setSelectedStatus(value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="in-review">In Review</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value: "name" | "date" | "status") => setSortBy(value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="status">Sort by Status</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAndSortedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="min-w-[200px]">
                    {editingId === doc.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={saveEditing}
                          className="h-8 w-8"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={cancelEditing}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <p className="font-medium flex items-center gap-2">
                        {doc.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(doc)}
                          className="h-6 w-6"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {doc.type} • {doc.size} • Uploaded on {doc.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Select
                    value={doc.status}
                    onValueChange={(value: DocumentStatus) => handleUpdateStatus(doc.id, value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue>
                        <Badge variant="outline" className={getStatusColor(doc.status)}>
                          {doc.status.replace('-', ' ')}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="in-review">In Review</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
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
              </div>
            ))}
            {filteredAndSortedDocs.length === 0 && (
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