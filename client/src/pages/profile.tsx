import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  CheckCircle,
  Download,
  Edit,
  Trash,
  Calendar,
  MessageSquare,
  Mail
} from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().min(1, "Company name is required"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: userInfo, isLoading } = useQuery<User>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
    },
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userInfo?.fullName || "",
      email: userInfo?.email || "",
      phone: userInfo?.phone || "",
      company: userInfo?.company || "",
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (userInfo) {
      form.reset({
        name: userInfo.fullName || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        company: userInfo.company || "",
      });
    }
  }, [userInfo, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const response = await apiRequest("PATCH", "/api/user/profile", data);
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await apiRequest("PATCH", "/api/user/avatar", formData);
        if (!response.ok) {
          throw new Error("Failed to upload avatar");
        }
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        toast({
          title: "Profile Picture Updated",
          description: "Your profile picture has been successfully updated.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const [subscription] = useState({
    plan: "Pro",
    renewalDate: "March 15, 2025",
    billingCycle: "Monthly",
    usageProgress: 65,
  });

  const [documents] = useState([
    {
      id: 1,
      name: "Service Agreement.pdf",
      category: "Contracts",
      date: "Feb 15, 2025",
      status: "Reviewed",
    },
    {
      id: 2,
      name: "NDA Template.docx",
      category: "Agreements",
      date: "Feb 14, 2025",
      status: "Generated",
    },
  ]);

  const [consultations] = useState([
    {
      id: 1,
      date: "Feb 20, 2025",
      time: "10:00 AM",
      lawyer: "Sarah Johnson",
      status: "Upcoming",
    },
  ]);

  const handlePasswordChange = () => {
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    });
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userInfo?.avatarUrl} />
                    <AvatarFallback>{userInfo?.fullName?.substring(0, 2)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-1 rounded-full bg-primary text-primary-foreground cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">{userInfo?.fullName}</h3>
                  <p className="text-sm text-muted-foreground">Business Account</p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(data => updateProfileMutation.mutate(data))} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            {userInfo?.isEmailVerified ? (
                              <Badge variant="secondary" className="self-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Button variant="outline" size="sm">
                                Verify
                              </Button>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{subscription.plan} Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    Renewal on {subscription.renewalDate}
                  </p>
                </div>
                <Button>Upgrade Plan</Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usage this month</span>
                  <span>{subscription.usageProgress}%</span>
                </div>
                {/* Progress component is missing, needs to be imported and used here */}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Payment Methods</h4>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  {/* CreditCard component is missing, needs to be imported and used here */}
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Billing History</h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">Invoice #{2025001 + i}</p>
                        <p className="text-sm text-muted-foreground">
                          Feb {i}, 2025
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.category} • {doc.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Upcoming Consultations</h4>
                {consultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">
                          Consultation with {consultation.lawyer}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {consultation.date} at {consultation.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button variant="ghost" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Change Password</h4>
                <div className="grid gap-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button onClick={handlePasswordChange}>Update Password</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p>Secure your account with 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      Protect your account with an additional layer of security
                    </p>
                  </div>
                  {/* Switch component is missing, needs to be imported and used here */}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your documents and consultations
                      </p>
                    </div>
                    {/* Switch component is missing, needs to be imported and used here */}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get important alerts on your phone
                      </p>
                    </div>
                    {/* Switch component is missing, needs to be imported and used here */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <MessageSquare className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">Chat Support</h4>
                        <p className="text-sm text-muted-foreground">
                          Available 24/7 for your queries
                        </p>
                      </div>
                    </div>
                    <Button className="w-full mt-4">Start Chat</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Mail className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">Email Support</h4>
                        <p className="text-sm text-muted-foreground">
                          Get help via email
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Send Email
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Frequently Asked Questions</h4>
                <div className="space-y-2">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium">How do I share documents?</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      You can share documents by selecting the document and clicking
                      the share button. You can then enter the email addresses of
                      the people you want to share with.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium">
                      How secure are my documents?
                    </h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      All documents are encrypted and stored securely. We use
                      industry-standard security measures to protect your data.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}