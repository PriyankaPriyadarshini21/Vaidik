import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";

const experts = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Business Law Expert",
    rating: 4.8,
    reviews: 120,
    rate: "$150/hour",
    image: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "IP Law Specialist",
    rating: 5.0,
    reviews: 95,
    rate: "$180/hour",
    image: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Tax Law Expert",
    rating: 4.9,
    reviews: 150,
    rate: "$165/hour",
    image: "https://i.pravatar.cc/150?img=3"
  }
];

export default function AIConsultation() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Find Legal Experts</h1>
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">Business Law</SelectItem>
              <SelectItem value="ip">Intellectual Property</SelectItem>
              <SelectItem value="tax">Tax Law</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Experience Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="junior">Junior (1-3 years)</SelectItem>
              <SelectItem value="mid">Mid-Level (4-7 years)</SelectItem>
              <SelectItem value="senior">Senior (8+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experts.map((expert) => (
          <Card key={expert.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{expert.name}</h3>
                  <p className="text-sm text-muted-foreground">{expert.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{expert.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({expert.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-sm mt-1">{expert.rate}</p>
                </div>
              </div>
              <Button className="w-full mt-4">Schedule Consultation</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
