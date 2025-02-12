import { DocumentCard } from "./document-card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Demo documents for initial display
const demoDocuments: Document[] = [
  {
    id: 1,
    title: "Employment Agreement - Software Developer",
    type: "employment",
    status: "active",
    createdAt: new Date("2025-02-10T10:00:00Z"),
    updatedAt: new Date("2025-02-10T10:00:00Z"),
    expiresAt: new Date("2026-02-10T10:00:00Z"),
  },
  {
    id: 2,
    title: "Non-Disclosure Agreement - Project Alpha",
    type: "nda",
    status: "active",
    createdAt: new Date("2025-02-11T15:30:00Z"),
    updatedAt: new Date("2025-02-11T15:30:00Z"),
    expiresAt: new Date("2026-02-11T15:30:00Z"),
  },
  {
    id: 3,
    title: "Service Agreement - Cloud Services",
    type: "service",
    status: "draft",
    createdAt: new Date("2025-02-12T09:15:00Z"),
    updatedAt: new Date("2025-02-12T09:15:00Z"),
    expiresAt: null,
  },
  {
    id: 4,
    title: "Lease Agreement - Office Space",
    type: "lease",
    status: "expired",
    createdAt: new Date("2024-02-12T14:20:00Z"),
    updatedAt: new Date("2024-02-12T14:20:00Z"),
    expiresAt: new Date("2025-02-12T14:20:00Z"),
  }
];

export function DocumentList() {
  const { toast } = useToast();

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    initialData: demoDocuments,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted.",
      });
    },
  });

  const handlePreview = (id: number) => {
    // Handle document preview
    toast({
      title: "Preview",
      description: "Document preview functionality will be implemented soon.",
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[200px] rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!documents?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No documents found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          onDelete={(id) => deleteMutation.mutate(id)}
          onPreview={handlePreview}
        />
      ))}
    </div>
  );
}