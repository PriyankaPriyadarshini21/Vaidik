import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { PricingPlan } from "@shared/schema";

export default function Pricing() {
  const { toast } = useToast();

  // Fetch pricing plans from the database
  const { data: plans = [], isLoading } = useQuery<PricingPlan[]>({
    queryKey: ["/api/pricing-plans"],
  });

  // Mutation for creating a subscription
  const createSubscription = useMutation({
    mutationFn: async (planId: number) => {
      const response = await fetch(`/api/users/1/subscription`, { // TODO: Replace with actual user ID
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          status: 'active'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/subscription'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePayment = async (plan: PricingPlan) => {
    if (plan.name.toLowerCase() === 'free plan') {
      toast({
        title: "Success",
        description: "You've been signed up for the Free Plan",
      });
      return;
    }

    // Here we would integrate with a payment provider like Stripe
    toast({
      title: "Redirecting to payment",
      description: `Processing payment for ${plan.name}...`,
    });

    try {
      await createSubscription.mutateAsync(plan.id);
      toast({
        title: "Success",
        description: `Successfully subscribed to ${plan.name}!`,
      });
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Affordable Plans for Every Business</h2>
        <p className="text-muted-foreground">Choose the perfect plan for your needs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.name === 'Pro Plan' ? 'border-primary' : ''}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold">₹{plan.price}/month</div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-4" 
                variant={plan.name === 'Pro Plan' ? 'default' : 'outline'}
                onClick={() => handlePayment(plan)}
              >
                {plan.price === 0 ? 'Sign Up Free' : `Upgrade to ${plan.name.split(' ')[0]}`}
              </Button>
              <p className="text-xs text-muted-foreground text-center">*Excludes legal consultation</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}