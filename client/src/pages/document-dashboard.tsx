import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FileText, Users, Scale, Building2, Shield, FileSpreadsheet, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

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
  const [, setLocation] = useLocation();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const filteredDocuments = documentTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Create New Document</h1>
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Search document types..."
            className="w-full mb-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {filteredDocuments.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.id} className="flex-[0_0_20%] min-w-0 pl-4 first:pl-0">
                  <Card 
                    className="p-4 hover:bg-accent cursor-pointer transition-all transform hover:scale-105 flex flex-col items-center text-center gap-2"
                    onClick={() => setLocation(`/create/${type.id}`)}
                  >
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{type.name}</span>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
          onClick={scrollNext}
          disabled={nextBtnDisabled}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        <p>Supported formats: PDF, DOCX, DOC</p>
      </div>
    </div>
  );
}