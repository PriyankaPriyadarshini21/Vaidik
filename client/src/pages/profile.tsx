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
import { User } from "@shared/schema";

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

  const { data: userInfo, isLoading, error } = useQuery<User>({
    queryKey: ["/api/user"],
    retry: 2,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
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

        <TabsContent value="subscription" className="space-y-6">
          {/* Subscription Tab Content */}
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