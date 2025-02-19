import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Download, 
  Users, 
  FileEdit, 
  Share2, 
  FileOutput, 
  Archive, 
  Trash2,
  Copy,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Document } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface DocumentActionsProps {
  document: Document;
  variant?: "summary" | "sidebar";
}

export function DocumentActions({ document, variant = "summary" }: DocumentActionsProps) {
  const { toast } = useToast();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  // Delete document mutation
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

  // Handle document download
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/documents/${document.id}/download`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.filename || 'document';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the document",
        variant: "destructive",
      });
    }
  };

  // Handle document sharing
  const handleShare = async () => {
    setShowShareDialog(true);
  };

  // Handle copy share link
  const handleCopyLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/documents/${document.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy the share link",
        variant: "destructive",
      });
    }
  };

  // Handle PDF export
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/documents/${document.id}/export`);
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${document.title}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export the document to PDF",
        variant: "destructive",
      });
    }
  };

  // Handle document archiving
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

  // Share Dialog Component
  const ShareDialog = () => (
    <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value={`${window.location.origin}/documents/${document.id}`}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Anyone with this link will be able to view this document
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Summary view buttons
  if (variant === "summary") {
    return (
      <>
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
        <ShareDialog />
      </>
    );
  }

  // Sidebar view buttons
  return (
    <>
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
      <ShareDialog />
    </>
  );
}