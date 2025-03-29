import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import {
  Upload,
  CheckCircle,
  Download,
  Edit,
  Trash,
  Calendar,
  MessageSquare,
  Mail,
  CreditCard,
  FileText,
  Bell,
  Clock,
  AlertTriangle,
  Shield,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User, UserSubscription, PricingPlan } from "@shared/schema";

// Extended user type that includes subscription information
interface ExtendedUser extends User {
  subscription?: UserSubscription & {
    planName?: string;
    features?: string[];
    paymentMethod?: string;
    price?: number;
  };
}

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().min(1, "Company name is required"),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Query for user data including subscription
  const { data: userInfo, isLoading, error } = useQuery<ExtendedUser>({
    queryKey: ["/api/user"],
    retry: 2,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      
      // Get the basic user data
      const userData: User = await response.json();

      try {
        // Get the user's subscription data
        const subscriptionResponse = await apiRequest("GET", `/api/users/${userData.id}/subscription`);
        
        // If the user has a subscription, add it to the user data
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          return {
            ...userData,
            subscription: {
              ...subscriptionData,
              paymentMethod: subscriptionData.status === 'active' ? 'Credit Card' : undefined
            }
          };
        }
      } catch (error) {
        // If there's an error fetching the subscription, just return the user data without it
        console.error("Error fetching subscription:", error);
      }
      
      // Return user data without subscription if there's no subscription or there was an error
      return userData;
    },
  });

  // Set initial state based on user data
  useEffect(() => {
    if (userInfo) {
      setIsTwoFactorEnabled(userInfo.twoFactorEnabled || false);
      setEmailNotifications(userInfo.emailNotificationsEnabled || true);
      setSmsNotifications(userInfo.smsNotificationsEnabled || false);
    }
  }, [userInfo]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

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

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      const response = await apiRequest("POST", "/api/user/password", data);
      if (!response.ok) {
        throw new Error("Failed to update password");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      passwordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTwoFactorMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const response = await apiRequest("POST", "/api/user/2fa", { enabled });
      if (!response.ok) {
        throw new Error("Failed to update 2FA settings");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: data.enabled ? "2FA Enabled" : "2FA Disabled",
        description: data.enabled
          ? "Two-factor authentication has been enabled for your account."
          : "Two-factor authentication has been disabled.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      // Revert the toggle if the mutation fails
      setIsTwoFactorEnabled(!isTwoFactorEnabled);
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: async ({ emailEnabled, smsEnabled }: { emailEnabled: boolean; smsEnabled: boolean }) => {
      const response = await apiRequest("POST", "/api/user/notifications", {
        emailEnabled,
        smsEnabled,
      });
      if (!response.ok) {
        throw new Error("Failed to update notification preferences");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been updated.",
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

  const handleTwoFactorToggle = async (checked: boolean) => {
    setIsTwoFactorEnabled(checked);
    updateTwoFactorMutation.mutate(checked);
  };

  const handleEmailNotificationsToggle = async (checked: boolean) => {
    setEmailNotifications(checked);
    updateNotificationsMutation.mutate({
      emailEnabled: checked,
      smsEnabled: smsNotifications,
    });
  };

  const handleSMSNotificationsToggle = async (checked: boolean) => {
    setSmsNotifications(checked);
    updateNotificationsMutation.mutate({
      emailEnabled: emailNotifications,
      smsEnabled: checked,
    });
  };

  const startChat = () => {
    // Here you would typically initialize your chat widget/component
    toast({
      title: "Chat Initiated",
      description: "Connecting you with our support team...",
    });
  };

  const sendEmail = () => {
    window.location.href = "mailto:support@yourdomain.com";
    toast({
      title: "Email Client Opened",
      description: "You can now compose your email to our support team.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive">Failed to load profile data</p>
        </div>
      </div>
    );
  }

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
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userInfo?.avatarUrl || undefined} />
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

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Current Plan Overview */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">
                        {userInfo?.subscription?.planName || "Free Plan"}
                      </h3>
                      <Badge variant="secondary" className="ml-2">
                        {userInfo?.subscription?.status || "Active"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {userInfo?.subscription?.planName === "Free Plan" 
                        ? "Limited access to AI document generation and analysis tools." 
                        : "Full access to all features with premium support."}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-2xl font-bold">
                      ${userInfo?.subscription?.price || "0"}<span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {userInfo?.subscription?.endDate 
                        ? `Renews on ${new Date(userInfo.subscription.endDate).toLocaleDateString()}` 
                        : ""}
                    </div>
                  </div>
                </div>

                {/* Subscription Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Your Plan Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {userInfo?.subscription?.features ? (
                      userInfo.subscription.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))
                    ) : (
                      // Default features for Free Plan
                      <>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>50+ AI drafts per month</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>3 AI documents analyze</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>24*7 Support</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Upgrade Button */}
                <div className="pt-2">
                  <Button className="w-full md:w-auto" onClick={() => window.location.href = "/pricing"}>
                    {userInfo?.subscription?.planName === "Enterprise Plan" 
                      ? "Manage Subscription" 
                      : "Upgrade Plan"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Method</h3>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {userInfo?.subscription?.paymentMethod || "No payment method on file"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {userInfo?.subscription?.paymentMethod 
                        ? "Card ending in •••• 4242" 
                        : "Add a payment method to upgrade your plan"}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Button variant="outline" size="sm">
                      {userInfo?.subscription?.paymentMethod ? "Update" : "Add"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Billing History */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Billing History</h3>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
                
                {/* History Table */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {/* Show example or actual billing history */}
                      {userInfo?.subscription ? (
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {new Date(userInfo.subscription.startDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            ${userInfo.subscription.price || "0.00"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <Badge variant={userInfo.subscription.status === "active" ? "outline" : "secondary"}>
                              {userInfo.subscription.status === "active" ? "Paid" : "Pending"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No billing history available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Manage Subscription */}
              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-medium">Manage Subscription</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">
                    Change Plan
                  </Button>
                  <Button variant="outline" className="text-destructive hover:bg-destructive/10">
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Change Password</h4>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(data => updatePasswordMutation.mutate(data))} className="space-y-4 max-w-md">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={updatePasswordMutation.isPending}
                    >
                      {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </Form>
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
                  <Switch
                    checked={isTwoFactorEnabled}
                    onCheckedChange={handleTwoFactorToggle}
                  />
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
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={handleEmailNotificationsToggle}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get important alerts on your phone
                      </p>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onCheckedChange={handleSMSNotificationsToggle}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          {/* Support Tab Content */}
        </TabsContent>
      </Tabs>
    </div>
  );
}