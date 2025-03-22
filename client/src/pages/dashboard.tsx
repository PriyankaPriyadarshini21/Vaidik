import { DocumentList } from "@/components/documents/document-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Plus, Upload, FileText, Users, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const data = [
  { name: 'Mon', value: 12 },
  { name: 'Tue', value: 15 },
  { name: 'Wed', value: 10 },
  { name: 'Thu', value: 22 },
  { name: 'Fri', value: 25 },
  { name: 'Sat', value: 20 },
  { name: 'Sun', value: 18 },
];

const upcomingConsultations = [
  { title: "Contract Review", time: "Today at 2:00 PM" },
  { title: "Legal Advisory", time: "Tomorrow at 10:00 AM" },
];

const activityTimeline = [
  { type: "document", title: "Contract.pdf", action: "created", time: "1h ago" },
  { type: "review", title: "NDA.docx", action: "completed", time: "3h ago" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="bg-blue-50 p-4 rounded-lg flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm">AI System Status: Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-sm">Processing Documents: 2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6 md:col-span-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/ai-documents">
                  <Button className="w-full flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Document
                  </Button>
                </Link>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Document Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Document Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0056B3" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0056B3" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#0056B3" fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <DocumentList/>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Consultations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Upcoming Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingConsultations.map((consultation, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{consultation.title}</p>
                      <p className="text-sm text-muted-foreground">{consultation.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityTimeline.map((activity, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    {activity.type === "document" ? (
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                    ) : (
                      <Activity className="h-5 w-5 text-primary mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">
                        Document <span className="font-semibold">{activity.title}</span> {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}