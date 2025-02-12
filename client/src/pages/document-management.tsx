import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentList } from "@/components/documents/document-list";

export default function DocumentManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Document Management</h1>
        <p className="text-muted-foreground">
          Organize and manage all your legal documents
        </p>
      </div>

      <DocumentList />
    </div>
  );
}
