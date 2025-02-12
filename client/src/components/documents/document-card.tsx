import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Document } from "@shared/schema";
import { format } from "date-fns";
import { FileText, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentCardProps {
  document: Document;
  onDelete: (id: number) => void;
  onPreview?: (id: number) => void;
}

export function DocumentCard({ document, onDelete, onPreview }: DocumentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row gap-4 items-center">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold line-clamp-1">{document.title}</h3>
          <p className="text-sm text-muted-foreground">
            Created {format(new Date(document.createdAt), "MMM d, yyyy")}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Type:</span>
          <span className="text-sm capitalize">{document.type}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge variant="outline" className={getStatusColor(document.status)}>
            {document.status}
          </Badge>
        </div>
        {document.expiresAt && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Expires:</span>
            <span className="text-sm">
              {format(new Date(document.expiresAt), "MMM d, yyyy")}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {onPreview && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPreview(document.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(document.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}