import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Star } from "lucide-react";

export default function LegalConsultation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Legal Consultation</h1>
        <p className="text-muted-foreground">
          Schedule consultations with legal experts
        </p>
      </div>

      {/* This is a placeholder. Will be implemented based on user requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Available Experts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Choose an expert to schedule your consultation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
