import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FileText, Users, Scale, Building2, Shield, FileSpreadsheet, Plus } from "lucide-react";

const documentTypes = [
  { id: 'nda', name: 'NDA', icon: FileText },
  { id: 'employment', name: 'Employment', icon: Users },
  { id: 'partnership', name: 'Partnership', icon: Users },
  { id: 'legal', name: 'Legal', icon: Scale },
  { id: 'corporate', name: 'Corporate', icon: Building2 },
  { id: 'privacy', name: 'Privacy', icon: Shield },
  { id: 'invoice', name: 'Invoice', icon: FileSpreadsheet },
  { id: 'contract', name: 'Contract', icon: FileText },
  { id: 'agreement', name: 'Agreement', icon: FileText },
  { id: 'other', name: 'Other', icon: Plus },
];

export default function DocumentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Create New Document</h1>
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Search document types..."
            className="w-full mb-6"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {documentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card 
              key={type.id}
              className="p-4 hover:bg-accent cursor-pointer transition-colors flex flex-col items-center text-center gap-2"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">{type.name}</span>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        <p>Supported formats: PDF, DOCX, DOC</p>
      </div>
    </div>
  );
}
