import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, Scale, Building2, Shield, FileSpreadsheet, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface DocumentType {
  id: string;
  name: string;
  icon: any;
  category: string;
}

const documentTypes: DocumentType[] = [
  // Business Agreements
  { id: 'nda', name: 'Non-Disclosure Agreement', icon: FileText, category: 'Business' },
  { id: 'partnership', name: 'Partnership Agreement', icon: Users, category: 'Business' },
  { id: 'employment', name: 'Employment Agreement', icon: Users, category: 'Business' },
  { id: 'service', name: 'Service Agreement', icon: FileText, category: 'Business' },

  // Property & Real Estate
  { id: 'lease', name: 'Lease Agreement', icon: Building2, category: 'Property' },
  { id: 'sale-deed', name: 'Sale Deed', icon: Building2, category: 'Property' },
  { id: 'rental', name: 'Rental Agreement', icon: Building2, category: 'Property' },

  // Financial Documents
  { id: 'loan', name: 'Loan Agreement', icon: FileSpreadsheet, category: 'Financial' },
  { id: 'investment', name: 'Investment Contract', icon: FileSpreadsheet, category: 'Financial' },

  // Personal Legal Documents
  { id: 'affidavit', name: 'Affidavit', icon: Scale, category: 'Personal' },
  { id: 'will', name: 'Will', icon: Scale, category: 'Personal' },
  { id: 'poa', name: 'Power of Attorney', icon: Shield, category: 'Personal' },
];

export default function AIDocuments() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documentTypes.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(documentTypes.map(doc => doc.category)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Create AI-Written Document</h1>
        <p className="text-muted-foreground">
          Select a document type to begin, or search for specific templates
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Input 
          type="text" 
          placeholder="Search document types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Document Categories */}
      {categories.map(category => (
        <div key={category}>
          <h2 className="text-lg font-semibold mb-4">{category} Documents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDocuments
              .filter(doc => doc.category === category)
              .map((type) => {
                const Icon = type.icon;
                return (
                  <Link key={type.id} href={`/create/${type.id}`}>
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                      <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-medium">{type.name}</span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
          </div>
        </div>
      ))}

      {filteredDocuments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No documents found matching your search.</p>
        </div>
      )}

      <div className="mt-8 text-sm text-muted-foreground">
        <p>All documents are generated using AI and comply with legal standards.</p>
        <p>You can customize any document after generation.</p>
      </div>
    </div>
  );
}