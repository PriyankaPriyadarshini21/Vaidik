import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Document } from "@shared/schema";
import { format } from "date-fns";
import { FileText, Trash2 } from "lucide-react";

interface DocumentCardProps {
  document: Document;
  onDelete: (id: number) => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row gap-4 items-center">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h3 className="font-semibold">{document.title}</h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(document.createdAt), "MMM d, yyyy")}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Type: {document.type}</p>
        <p className="text-sm">Status: {document.status}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
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
