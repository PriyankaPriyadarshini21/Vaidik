import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Clock, Upload } from "lucide-react";

interface Expert {
  id: number;
  name: string;
  title: string;
  specialization: string;
  rating: number;
  reviews: number;
  rate: string;
  image: string;
  availability: string[];
}

const experts: Expert[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Legal Advisor",
    specialization: "Business Law",
    rating: 4.8,
    reviews: 120,
    rate: "$150/hour",
    image: "https://i.pravatar.cc/150?img=1",
    availability: ["Monday", "Wednesday", "Friday"]
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "IP Law Specialist",
    specialization: "Intellectual Property",
    rating: 5.0,
    reviews: 95,
    rate: "$180/hour",
    image: "https://i.pravatar.cc/150?img=2",
    availability: ["Tuesday", "Thursday"]
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Tax Law Expert",
    specialization: "Tax Law",
    rating: 4.9,
    reviews: 150,
    rate: "$165/hour",
    image: "https://i.pravatar.cc/150?img=3",
    availability: ["Monday", "Tuesday", "Friday"]
  }
];

export default function LegalConsultation() {
  const [category, setCategory] = useState<string>("all");
  const [experienceLevel, setExperienceLevel] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const filteredExperts = experts.filter(expert => {
    if (category !== "all" && expert.specialization !== category) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Legal Consultation</h1>
        <p className="text-muted-foreground">
          Schedule consultations with our verified legal experts
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Business Law">Business Law</SelectItem>
            <SelectItem value="Intellectual Property">Intellectual Property</SelectItem>
            <SelectItem value="Tax Law">Tax Law</SelectItem>
          </SelectContent>
        </Select>

        <Select value={experienceLevel} onValueChange={setExperienceLevel}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Experience Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="junior">Junior (1-3 years)</SelectItem>
            <SelectItem value="mid">Mid-Level (4-7 years)</SelectItem>
            <SelectItem value="senior">Senior (8+ years)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Expert List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperts.map((expert) => (
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
                  <p className="text-sm text-primary">{expert.specialization}</p>
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

              {/* Booking Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4">Schedule Consultation</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Schedule Consultation with {expert.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Select Date</h4>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Available Time Slots</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {expert.availability.map((slot) => (
                          <Button key={slot} variant="outline" className="w-full">
                            <Clock className="mr-2 h-4 w-4" />
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Upload Documents (Optional)</h4>
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Files
                      </Button>
                    </div>
                    <Button className="w-full">Confirm Booking</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}