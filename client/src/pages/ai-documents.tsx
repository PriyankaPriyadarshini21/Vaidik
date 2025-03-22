import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, Scale, Building2, Shield, FileSpreadsheet, Plus, FileCheck, Briefcase, Code, DollarSign } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface DocumentType {
  id: string;
  name: string;
  icon: any;
  category: string;
}

const documentTypes: DocumentType[] = [
  // Employment & HR Documents
  { id: 'employment', name: 'Employee Agreement', icon: Users, category: 'Employment & HR' },
  { id: 'freelancer', name: 'Freelancer Agreement', icon: Users, category: 'Employment & HR' },
  { id: 'consulting', name: 'Consulting Agreement', icon: Users, category: 'Employment & HR' },
  { id: 'commission', name: 'Commission Agreement', icon: Users, category: 'Employment & HR' },

  // Service Agreements
  { id: 'service', name: 'Service Agreement', icon: FileCheck, category: 'Services' },
  { id: 'software-development', name: 'Software Development Agreement', icon: Code, category: 'Services' },
  { id: 'software-licensing', name: 'Software Licensing Agreement', icon: Code, category: 'Services' },
  { id: 'marketing', name: 'Marketing/Advertising Agreement', icon: FileText, category: 'Services' },
  { id: 'vendor', name: 'Vendor Agreement', icon: FileText, category: 'Services' },
  { id: 'dpa', name: 'Data Processing Agreement (DPA)', icon: Shield, category: 'Services' },

  // Business & Commercial
  { id: 'sales', name: 'Sales Agreement', icon: Briefcase, category: 'Business' },
  { id: 'distribution', name: 'Distribution Agreement', icon: Briefcase, category: 'Business' },
  { id: 'revenue-sharing', name: 'Revenue Sharing Agreement', icon: DollarSign, category: 'Business' },
  { id: 'affiliate', name: 'Affiliate/Referral Agreement', icon: Users, category: 'Business' },
  { id: 'commission-business', name: 'Commission Agreement', icon: DollarSign, category: 'Business' },

  // Investment & Securities
  { id: 'equity-crowdfunding', name: 'Equity Crowdfunding Agreement', icon: DollarSign, category: 'Investment' },
  { id: 'voting-rights', name: 'Voting Rights Agreement', icon: FileText, category: 'Investment' },
  { id: 'preferred-stock', name: 'Preferred Stock Agreement', icon: FileText, category: 'Investment' },
  { id: 'founders', name: 'Founders Agreement', icon: Users, category: 'Investment' },
  { id: 'side-letter', name: 'Side Letter Agreement', icon: FileText, category: 'Investment' },
  { id: 'promissory-note', name: 'Promissory Note / Loan Agreement', icon: FileText, category: 'Investment' },
  { id: 'loan', name: 'Loan Agreement', icon: DollarSign, category: 'Investment' },
  { id: 'investment', name: 'Investment Agreement', icon: DollarSign, category: 'Investment' },
  { id: 'kiss', name: 'KISS Agreement', icon: FileText, category: 'Investment' },
  { id: 'safe', name: 'SAFE Agreement', icon: FileText, category: 'Investment' },
  { id: 'convertible-note', name: 'Convertible Note Agreement', icon: FileText, category: 'Investment' },
  { id: 'stock-purchase', name: 'Stock Purchase Agreement', icon: FileText, category: 'Investment' },
  { id: 'subscription', name: 'Subscription Agreement', icon: FileText, category: 'Investment' },
  { id: 'shareholders', name: 'Shareholders Agreement', icon: Users, category: 'Investment' }
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
          <h2 className="text-lg font-semibold mb-4">{category}</h2>
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