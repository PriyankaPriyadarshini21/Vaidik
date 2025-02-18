import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex w-full max-w-5xl p-4 gap-8">
        {/* Form Section */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Welcome to Vidhik AI</CardTitle>
            <CardDescription>
              Login or create an account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter your password" />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input id="register-password" type="password" placeholder="Create a password" />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <div className="hidden md:flex flex-1 flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold">
            Transform Your Legal Work with AI
          </h1>
          <p className="text-xl text-muted-foreground">
            Streamline document creation, get instant analysis, and collaborate seamlessly with our AI-powered legal platform.
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>✓ AI-powered document drafting</li>
            <li>✓ Intelligent document analysis</li>
            <li>✓ Secure document management</li>
            <li>✓ Expert legal consultation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
