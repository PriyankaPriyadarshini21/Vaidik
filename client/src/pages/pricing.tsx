import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Pricing() {
  const { toast } = useToast();

  const handlePayment = (plan: string, amount?: number) => {
    if (plan === 'free') {
      toast({
        title: "Success",
        description: "You've been signed up for the Free Plan",
      });
      return;
    }

    // Here we would integrate with a payment provider like Stripe
    toast({
      title: "Redirecting to payment",
      description: `Processing payment for ${plan} plan...`,
    });
    // Payment integration would go here
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Affordable Plans for Every Business</h2>
        <p className="text-muted-foreground">Choose the perfect plan for your needs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Free Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">₹0/month</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>50+ AI drafts per month</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>3 AI documents analyze</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>24*7 Support</span>
              </li>
            </ul>
            <Button className="w-full mt-4" onClick={() => handlePayment('free')}>Sign Up Free</Button>
            <p className="text-xs text-muted-foreground text-center">*Excludes legal consultation</p>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">₹999/month</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Unlimited AI drafts per month</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>50+ AI-powered document review</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Secure, encrypted document storage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>24*7 support</span>
              </li>
            </ul>
            <Button className="w-full mt-4" variant="default" onClick={() => handlePayment('pro', 999)}>Upgrade to Pro</Button>
            <p className="text-xs text-muted-foreground text-center">*Excludes legal consultation</p>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Enterprise Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">₹1499/month</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Unlimited AI drafts per month</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Unlimited AI-powered document review</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Secure, encrypted document storage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Document Signing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Guided Document Suggestions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Full Access to All Features*</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>24*7 support</span>
              </li>
            </ul>
            <Button className="w-full mt-4" onClick={() => handlePayment('enterprise', 1499)}>Upgrade to Enterprise</Button>
            <p className="text-xs text-muted-foreground text-center">*Excludes legal consultation</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}