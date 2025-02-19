import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Download, 
  Users, 
  FileEdit, 
  Share2, 
  FileOutput, 
  Archive, 
  Trash2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Document } from "@shared/schema";

interface DocumentActionsProps {
  document: Document;
  variant?: "summary" | "sidebar";
}

export function DocumentActions({ document, variant = "summary" }: DocumentActionsProps) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/documents/${document.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document deleted",
        description: "The document has been permanently removed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete document",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/preview/${document.filename}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the document",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    // Implement sharing functionality here
    toast({
      title: "Share document",
      description: "Sharing functionality will be implemented soon",
    });
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/documents/${document.id}/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${document.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export the document to PDF",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async () => {
    try {
      await apiRequest("PATCH", `/api/documents/${document.id}`, {
        status: "archived",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document archived",
        description: "The document has been moved to archives",
      });
    } catch (error) {
      toast({
        title: "Archive failed",
        description: "Could not archive the document",
        variant: "destructive",
      });
    }
  };

  if (variant === "summary") {
    return (
      <div className="flex gap-4 mt-4">
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Report
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Consult an Expert
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <FileEdit className="w-4 h-4" />
          Edit Document
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Document Actions</h2>
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Document
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleExport}
        >
          <FileOutput className="w-4 h-4 mr-2" />
          Export as PDF
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleArchive}
        >
          <Archive className="w-4 h-4 mr-2" />
          Archive Document
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {deleteMutation.isPending ? "Deleting..." : "Delete Document"}
        </Button>
      </div>
    </Card>
  );
}
