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
  // Voting Rights Agreement Fields
  dateOfAgreement?: string;
  votingCompanyName?: string;
  votingCompanyAddress?: string;
  founderNames?: string;
  founderAddresses?: string;
  investorNames?: string;
  investorAddresses?: string;
  shareBasedVoting?: "yes" | "no";
  preferredShareVoting?: string;
  reservedMattersThreshold?: string;
  charterChanges?: "yes" | "no";
  newSharesIssuance?: "yes" | "no";
  mergerThreshold?: string;
  mergerApproval?: "yes" | "no";
  directorAppointment?: "yes" | "no";
  liquidationApproval?: "yes" | "no";
  investorDirectors?: string;
  founderDirectors?: string;
  boardCompositionChanges?: string;
  proxiesAllowed?: "yes" | "no";
  proxyNoticeRequired?: "yes" | "no";
  deadlockTimeframe?: string;
  votingConfidentiality?: string;
  investorShareThreshold?: string;
  mutualTermination?: "yes" | "no";
  votingArbitrationVenue?: string;
  votingGoverningLaw?: string;
  companyRepresentative?: string;
  companyRepTitle?: string;
  founderSignatures?: string;
  investorRepName?: string;
  investorRepTitle?: string;

  // Preferred Stock Agreement Fields
  companyName?: string;
  companyLocation?: string;
  investorName?: string;
  investorAddress?: string;
  preferredShareCount?: string;
  pricePerShare?: string;
  totalPurchasePrice?: string;
  liquidationPreference?: string;
  antiDilutionClause?: string;
  dividendRate?: string;
  conversionRightsClause?: string;
  votingPower?: string;
  jurisdiction?: string;
  disputeResolution?: string;
  arbitrationRules?: string;
  closingDate?: string;
  closingLocation?: string;

  //Equity Crowdfunding fields
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
    if (params.type === "voting-rights") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        votingCompanyName: "",
        votingCompanyAddress: "",
        founderNames: "",
        founderAddresses: "",
        investorNames: "",
        investorAddresses: "",
        shareBasedVoting: "yes",
        preferredShareVoting: "",
        reservedMattersThreshold: "",
        charterChanges: "yes",
        newSharesIssuance: "yes",
        mergerThreshold: "",
        mergerApproval: "yes",
        directorAppointment: "yes",
        liquidationApproval: "yes",
        investorDirectors: "",
        founderDirectors: "",
        boardCompositionChanges: "",
        proxiesAllowed: "yes",
        proxyNoticeRequired: "yes",
        deadlockTimeframe: "",
        votingConfidentiality: "",
        investorShareThreshold: "",
        mutualTermination: "yes",
        votingArbitrationVenue: "",
        votingGoverningLaw: "",
        companyRepresentative: "",
        companyRepTitle: "",
        founderSignatures: "",
        investorRepName: "",
        investorRepTitle: "",
      } as const;
    } else if (params.type === "equity-crowdfunding") {
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
    } else if (params.type === "preferred-stock") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        companyName: "",
        companyLocation: "",
        investorName: "",
        investorAddress: "",
        preferredShareCount: "",
        pricePerShare: "",
        totalPurchasePrice: "",
        liquidationPreference: "",
        antiDilutionClause: "",
        dividendRate: "",
        conversionRightsClause: "",
        votingPower: "",
        jurisdiction: "",
        disputeResolution: "",
        arbitrationRules: "",
        closingDate: format(new Date(), "yyyy-MM-dd"),
        closingLocation: "",
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
      case "voting-rights":
        return "Voting Rights Agreement";
      case "equity-crowdfunding":
        return "Equity Crowdfunding Agreement";
      case "preferred-stock":
        return "Preferred Stock Agreement";
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
      case "voting-rights":
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

              <FormField
                control={form.control}
                name="votingCompanyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="votingCompanyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter company's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="founderNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founder Names</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter names of founders" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="founderAddresses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founder Addresses</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter addresses of founders" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="investorNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investor Names</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter names of investors" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="investorAddresses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investor Addresses</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter addresses of investors" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Voting Rights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shareBasedVoting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Based on Share Ownership</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredShareVoting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Shareholder Voting Rights</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1 vote per share" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="reservedMattersThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reserved Matters Voting Threshold</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 75% of voting power" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Reserved Matters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="charterChanges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Changes to Charter/Articles</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newSharesIssuance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Shares Issuance</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mergerThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merger/Acquisition Threshold</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter specific threshold" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mergerApproval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merger/Acquisition Approval</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="directorAppointment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Director Appointment/Removal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="liquidationApproval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Liquidation/Dissolution</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Board Representation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="investorDirectors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Investor Directors</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="founderDirectors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Founder Directors</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="boardCompositionChanges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board Composition Changes</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mutual agreement requirements" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Voting Procedures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="proxiesAllowed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proxies Allowed</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="proxyNoticeRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Written Notice for Proxies</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="deadlockTimeframe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadlock Resolution Timeframe</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter specific timeframe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="votingConfidentiality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidentiality Clause</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter additional confidentiality details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Agreement Term</h3>
              <FormField
                control={form.control}
                name="investorShareThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investor Share Threshold</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter specific percentage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mutualTermination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mutual Termination</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Jurisdiction</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="votingArbitrationVenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arbitration Venue</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city, India" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="votingGoverningLaw"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Governing Law</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city, India" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Signatures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyRepresentative"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Representative</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter representative's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyRepTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Representative Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter representative's title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="founderSignatures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founder(s)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter founder names" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="investorRepName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investor Representative</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter investor representative's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investorRepTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investor Representative Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter representative's title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
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
      case "preferred-stock":
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
                <FormField
                  control={form.control}
                  name="closingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Closing Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name of the company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Location</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter address of principal office" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="investorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name of investor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="investorAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investor Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter investor's address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Share Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="preferredShareCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Preferred Shares</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter total number of shares" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricePerShare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Share (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter price per share" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalPurchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Purchase Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter total amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Rights and Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="liquidationPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Liquidation Preference</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1x, 2x" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dividendRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dividend Rate</FormLabel>
                      <FormControl>
                        <Input placeholder="Specify dividend rate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="antiDilutionClause"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anti-Dilution Protection Clause</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name of clause/document" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="conversionRightsClause"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conversion Rights Clause</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name of clause/document" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="votingPower"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voting Power</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1 vote per share" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Legal Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="jurisdiction"
                  render={({ field }) => (                    <FormItem>
                      <FormLabel>Jurisdiction</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter applicable jurisdiction" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="disputeResolution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dispute Resolution Mechanism</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Arbitration, Court Proceedings" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="arbitrationRules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitration Rules/Act</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Arbitration and Conciliation Act, 1996" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="closingLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Closing Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location or 'Remote'" {...field} />
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
    case "voting-rights":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        votingCompanyName: z.string().min(1, "Company Name is required"),
        votingCompanyAddress: z.string().min(1, "Company Address is required"),
        founderNames: z.string().min(1, "Founder Names are required"),
        founderAddresses: z.string().min(1, "Founder Addresses are required"),
        investorNames: z.string().min(1, "Investor Names are required"),
        investorAddresses: z.string().min(1, "Investor Addresses are required"),
        shareBasedVoting: z.enum(["yes", "no"]),
        preferredShareVoting: z.string().min(1, "Preferred Share Voting details are required"),
        reservedMattersThreshold: z.string().min(1, "Reserved Matters Threshold is required"),
        charterChanges: z.enum(["yes", "no"]),
        newSharesIssuance: z.enum(["yes", "no"]),
        mergerThreshold: z.string().min(1, "Merger Threshold is required"),
        mergerApproval: z.enum(["yes", "no"]),
        directorAppointment: z.enum(["yes", "no"]),
        liquidationApproval: z.enum(["yes", "no"]),
        investorDirectors: z.string().min(1, "Number of Investor Directors is required"),
        founderDirectors: z.string().min(1, "Number of Founder Directors is required"),
        boardCompositionChanges: z.string().min(1, "Board Composition Changes are required"),
        proxiesAllowed: z.enum(["yes", "no"]),
        proxyNoticeRequired: z.enum(["yes", "no"]),
        deadlockTimeframe: z.string().min(1, "Deadlock Timeframe is required"),
        votingConfidentiality: z.string().optional(),
        investorShareThreshold: z.string().min(1, "Investor Share Threshold is required"),
        mutualTermination: z.enum(["yes", "no"]),
        votingArbitrationVenue: z.string().min(1, "Arbitration Venue is required"),
        votingGoverningLaw: z.string().min(1, "Governing Law is required"),
        companyRepresentative: z.string().min(1, "Company Representative is required"),
        companyRepTitle: z.string().min(1, "Company Representative Title is required"),
        founderSignatures: z.string().min(1, "Founder Signatures are required"),
        investorRepName: z.string().min(1, "Investor Representative Name is required"),
        investorRepTitle: z.string().min(1, "Investor Representative Title is required"),
      });
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
    case "preferred-stock":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        companyName: z.string().min(1, "Company Name is required"),
        companyLocation: z.string().min(1, "Company Location is required"),
        investorName: z.string().min(1, "Investor Name is required"),
        investorAddress: z.string().min(1, "Investor Address is required"),
        preferredShareCount: z.string().min(1, "Number of Preferred Shares is required"),
        pricePerShare: z.string().min(1, "Price per Share is required"),
        totalPurchasePrice: z.string().min(1, "Total Purchase Price is required"),
        liquidationPreference: z.string().min(1, "Liquidation Preference is required"),
        antiDilutionClause: z.string().min(1, "Anti-Dilution Protection Clause is required"),
        dividendRate: z.string().min(1, "Dividend Rate is required"),
        conversionRightsClause: z.string().min(1, "Conversion Rights Clause is required"),
        votingPower: z.string().min(1, "Voting Power is required"),
        jurisdiction: z.string().min(1, "Jurisdiction is required"),
        disputeResolution: z.string().min(1, "Dispute Resolution Mechanism is required"),
        arbitrationRules: z.string().min(1, "Arbitration Rules/Act is required"),
        closingDate: z.string().min(1, "Closing Date is required"),
        closingLocation: z.string().min(1, "Closing Location is required"),
      });
    default:
      return z.object({});
  }
};