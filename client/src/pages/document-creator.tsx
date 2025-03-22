import { useParams } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ReactNode, useMemo } from "react";

type FormFields = {
  // Equity Crowdfunding Agreement Fields
  dateOfAgreement?: string;
  ecfIssuerName?: string;
  ecfIssuerAddress?: string;
  ecfInvestorName?: string;
  ecfInvestorAddress?: string;
  ecfInvestmentAmount?: string;
  ecfEquityAllocated?: string;
  ecfTotalEquityPercentage?: string;
  ecfShareClass?: string;
  ecfUseOfFunds?: string;
  ecfPlatformName?: string;
  ecfPlatformFeesResponsibility?: "issuer" | "investor";
  ecfVotingRights?: string;
  ecfPeriodicUpdates?: string;
  ecfDividendsEligibility?: "yes" | "no";
  ecfInvestorAcknowledgments?: string;
  ecfConfidentialityClause?: string;
  ecfExitStrategySale?: "yes" | "no";
  ecfExitStrategyMerger?: "yes" | "no";
  ecfExitStrategyListing?: "yes" | "no";
  ecfArbitrationCity?: string;
  ecfGoverningLawCity?: string;
  ecfIssuerRepName?: string;
  ecfIssuerRepTitle?: string;
  ecfInvestorSignatureName?: string;
};

interface RouteParams {
  type: string;
}

export default function DocumentCreator() {
  const params = useParams<RouteParams>();
  const { toast } = useToast();
  const formSchema = getFormSchema(params.type);
  
  const defaultValues = useMemo(() => {
    if (params.type === "equity-crowdfunding") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        ecfIssuerName: "",
        ecfIssuerAddress: "",
        ecfInvestorName: "",
        ecfInvestorAddress: "",
        ecfInvestmentAmount: "",
        ecfEquityAllocated: "",
        ecfTotalEquityPercentage: "",
        ecfShareClass: "",
        ecfUseOfFunds: "",
        ecfPlatformName: "",
        ecfPlatformFeesResponsibility: "issuer",
        ecfVotingRights: "",
        ecfPeriodicUpdates: "",
        ecfDividendsEligibility: "no",
        ecfInvestorAcknowledgments: "",
        ecfConfidentialityClause: "",
        ecfExitStrategySale: "no",
        ecfExitStrategyMerger: "no",
        ecfExitStrategyListing: "no",
        ecfArbitrationCity: "",
        ecfGoverningLawCity: "",
        ecfIssuerRepName: "",
        ecfIssuerRepTitle: "",
        ecfInvestorSignatureName: "",
      } as const;
    }
    return {};
  }, [params.type]);

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(data: FormFields) {
    toast({
      title: "Generate Document",
      description: "Document is being generated...",
    });
    console.log(data);
  }

  const getFormTitle = () => {
    switch (params.type) {
      case "equity-crowdfunding":
        return "Equity Crowdfunding Agreement";
      case "affiliate":
        return "Affiliate Agreement";
      case "revenue-sharing":
        return "Revenue Sharing Agreement";
      case "event-management":
        return "Event Management Agreement";
      case "employment":
        return "Employment Agreement";
      case "service":
        return "Service Agreement";
      case "freelancer":
        return "Freelancer Agreement";
      case "consulting":
        return "Consulting Agreement";
      case "distribution":
        return "Distribution Agreement";
      case "commission":
        return "Commission Agreement";
      case "sales":
        return "Sales Agreement";
      case "software-development":
        return "Software Development Agreement";
      case "software-licensing":
        return "Software License Agreement";
      case "marketing":
        return "Marketing Agreement";
      case "dpa":
        return "Data Processing Agreement";
      default:
        return "Document";
    }
  };

  const renderFormFields = () => {
    switch (params.type) {
      case "equity-crowdfunding":
        return (
          <>
            <div className="grid gap-6">
              <h3 className="text-lg font-semibold">Basic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateOfAgreement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Agreement</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ecfIssuerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name of the company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ecfInvestorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name of the investor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="ecfIssuerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuer Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter issuer's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ecfInvestorAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investor Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter investor's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h2 className="text-2xl font-bold mb-6">{getFormTitle()}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {renderFormFields()}
          <Button type="submit" className="w-full">Generate Document</Button>
        </form>
      </Form>
    </div>
  );
}

const getFormSchema = (type: string) => {
  switch (type) {
    case "equity-crowdfunding":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        ecfIssuerName: z.string().min(1, "Issuer Name is required"),
        ecfIssuerAddress: z.string().min(1, "Issuer Address is required"),
        ecfInvestorName: z.string().min(1, "Investor Name is required"),
        ecfInvestorAddress: z.string().min(1, "Investor Address is required"),
        ecfInvestmentAmount: z.string().min(1, "Investment Amount is required"),
        ecfEquityAllocated: z.string().min(1, "Equity Allocated is required"),
        ecfTotalEquityPercentage: z.string().min(1, "Total Equity Percentage is required"),
        ecfShareClass: z.string().min(1, "Share Class is required"),
        ecfUseOfFunds: z.string().min(1, "Use of Funds is required"),
        ecfPlatformName: z.string().min(1, "Platform Name is required"),
        ecfPlatformFeesResponsibility: z.enum(["issuer", "investor"]),
        ecfVotingRights: z.string().min(1, "Voting Rights details are required"),
        ecfPeriodicUpdates: z.string().min(1, "Periodic Updates details are required"),
        ecfDividendsEligibility: z.enum(["yes", "no"]),
        ecfInvestorAcknowledgments: z.string().min(1, "Investor Acknowledgments are required"),
        ecfConfidentialityClause: z.string().optional(),
        ecfExitStrategySale: z.enum(["yes", "no"]),
        ecfExitStrategyMerger: z.enum(["yes", "no"]),
        ecfExitStrategyListing: z.enum(["yes", "no"]),
        ecfArbitrationCity: z.string().min(1, "Arbitration City is required"),
        ecfGoverningLawCity: z.string().min(1, "Governing Law City is required"),
        ecfIssuerRepName: z.string().min(1, "Issuer Representative Name is required"),
        ecfIssuerRepTitle: z.string().min(1, "Issuer Representative Title is required"),
        ecfInvestorSignatureName: z.string().min(1, "Investor Name for signature is required"),
      });
    default:
      return z.object({});
  }
};