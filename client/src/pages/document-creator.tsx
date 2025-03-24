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
import { ReactNode, useMemo, useEffect } from "react";

type FormFields = {
  // Common Fields (shared across all agreements)
  dateOfAgreement?: string;

  // Service Agreement Fields
  serviceProviderName?: string;
  serviceProviderAddress?: string;
  serviceClientName?: string;
  serviceClientAddress?: string;
  serviceDescription?: string;
  serviceDuration?: string;
  serviceStartDate?: string;
  serviceEndDate?: string;
  serviceFees?: string;
  servicePaymentTerms?: string;
  serviceDeliverables?: string;
  serviceTimeline?: string;
  servicePerformanceMetrics?: string;
  serviceTermination?: string;
  serviceConfidentiality?: string;
  serviceIntellectualProperty?: string;
  serviceIndemnification?: string;
  serviceLimitation?: string;
  serviceGoverningLaw?: string;
  serviceDisputeResolution?: string;

  // Employment Agreement Fields
  employmentCompanyName?: string;
  employmentCompanyAddress?: string;
  employmentEmployeeName?: string;
  employmentEmployeeAddress?: string;
  employmentJobTitle?: string;
  employmentStartDate?: string;
  employmentProbationPeriod?: string;
  employmentWorkingHours?: string;
  employmentPlaceOfWork?: string;
  employmentSalary?: string;
  employmentSalaryPaymentDate?: string;
  employmentBenefits?: string;
  employmentLeavePolicy?: string;
  employmentNoticePeriod?: string;
  employmentTerminationConditions?: string;
  employmentIntellectualProperty?: string;
  employmentConfidentiality?: string;
  employmentNonCompete?: string;
  employmentJurisdiction?: string;
  employmentWorkPolicy?: string;
  employmentPerformanceReview?: string;
  employmentBonusStructure?: string;

  // Shareholders Agreement Fields
  shareholderCompanyName?: string;
  shareholderCompanyAddress?: string;
  shareholderNames?: string;
  shareholderAddresses?: string;
  shareholderShares?: string;
  numberOfDirectors?: string;
  directorNominationThreshold?: string;
  boardQuorum?: string;
  mattersRequiringApproval?: string;
  approvalType?: "majority" | "supermajority" | "unanimous";
  shareTransferRestrictions?: "yes" | "no";
  rightOfFirstRefusal?: "yes" | "no";
  tagAlongRights?: "yes" | "no";
  dragAlongRights?: "yes" | "no";
  dividendThreshold?: string;
  nonCompetePeriod?: string;
  arbitrationLocation?: string;
  arbitrationLanguage?: string;
  governingLawJurisdiction?: string;
  noticeAddress?: string;
  shareholderNoticeAddresses?: string;
  amendmentProcedure?: string;
  confidentialityDefinition?: string;
  dividendDistributionPolicy?: string;
  additionalProvisions?: string;

  // Subscription Agreement Fields
  subscriptionIssuerName?: string;
  subscriptionIssuerAddress?: string;
  subscriptionSubscriberName?: string;
  subscriptionSubscriberAddress?: string;
  subscriptionNumShares?: string;
  subscriptionShareClass?: string;
  subscriptionPricePerShare?: string;
  subscriptionTotalAmount?: string;
  subscriptionPaymentMethod?: string;
  subscriptionPaymentDueDate?: string;
  subscriptionBoardApprovalDate?: string;
  subscriptionComplianceStatus?: string;
  subscriptionRocFilings?: string;
  subscriptionAllotmentTimeline?: string;
  subscriptionArbitrationCity?: string;

  // Stock Purchase Agreement Fields
  stockSellerName?: string;
  stockSellerAddress?: string;
  stockBuyerName?: string;
  stockBuyerAddress?: string;
  stockNumShares?: string;
  stockCompanyName?: string;
  stockPurchasePrice?: string;
  stockPaymentMethod?: string;
  stockPaymentDeadline?: string;
  stockClosingDate?: string;
  stockClosingLocation?: string;
  stockJurisdiction?: string;

  // Convertible Note Agreement Fields
  convertibleCompanyName?: string;
  convertibleCompanyAddress?: string;
  convertibleInvestorName?: string;
  convertibleInvestorAddress?: string;
  convertiblePrincipalAmount?: string;
  convertibleInterestRate?: string;
  convertibleMaturityDate?: string;
  convertibleQualifiedAmount?: string;
  convertibleDiscountPercent?: string;
  convertibleValuationCap?: string;
  convertibleSecurityType?: string;
  convertibleDefaultDays?: string;
  convertibleArbitrationCity?: string;

  // SAFE Agreement Fields
  safeEffectiveDate?: string;
  safeCompanyName?: string;
  safeJurisdiction?: string;
  safeCompanyAddress?: string;
  safeInvestorName?: string;
  safeInvestorAddress?: string;
  safeInvestmentAmount?: string;
  safeUsageOfFunds?: string;
  safeFinancingThreshold?: string;
  safeValuationCap?: string;
  safeDiscountRate?: string;
  safeArbitrationLocation?: string;

  // Commission Agreement Fields
  commissionCompanyName: string;
  commissionEntityType: string;
  commissionCompanyAddress: string;
  commissionInvestorName: string;
  commissionInvestorAddress: string;
  commissionAmount: string;
  commissionMaturityDate: string;
  commissionInterestRate: string;
  commissionCompoundingFreq: string;
  commissionQualifiedMin: string;
  commissionDiscountPercent: string;
  commissionValuationCap: string;
  commissionLiquidityMult: string;
  commissionReportingFreq: string;
  commissionObserverRights: "yes" | "no";
  commissionArbitrationRules: string;
  commissionArbitrationCity: string;

  // Investment Agreement Fields
  investmentInvestorName?: string;
  investmentInvestorAddress?: string;
  investmentCompanyName?: string;
  investmentCompanyAddress?: string;
  investmentAmount?: string;
  investmentType?: string;
  paymentTimeline?: string;
  investmentPurpose?: string;
  investmentVotingRights?: string;
  boardRepresentation?: string;
  buybackTerms?: string;
  ipoExitRights?: string;
  investmentConfidentiality?: string;
  investmentTermination?: string;
  investmentArbitrationCity?: string;

  // Voting Rights Agreement Fields
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
  preferredStockJurisdiction?: string;
  preferredStockDispute?: string;
  preferredStockArbitration?: string;
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

  // Founders Agreement Fields
  companyDescription?: string;
  founder1Name?: string;
  founder1Address?: string;
  founder1EquityPercentage?: string;
  founder1Responsibilities?: string;
  founder2Name?: string;
  founder2Address?: string;
  founder2EquityPercentage?: string;
  founder2Responsibilities?: string;
  founder3Name?: string;
  founder3Address?: string;
  founder3EquityPercentage?: string;
  founder3Responsibilities?: string;
  vestingPeriod?: string;
  cliffPeriod?: string;
  accelerationConditions?: string;
  unvestingTerms?: string;
  votingRightsStructure?: string;
  boardMembersCount?: string;
  boardMembersNames?: string;
  ipAssignmentTerms?: string;
  confidentialityTerms?: string;
  nonCompeteDuration?: string;
  nonSolicitationDuration?: string;
  exitNoticePeriod?: string;
  equityValuationMethod?: string;
  involuntaryExitCauses?: string;
  arbitrationVenue?: string;

  // Side Letter Agreement Fields
  sideLetterInvestorName?: string;
  sideLetterInvestorAddress?: string;
  sideLetterCompanyName?: string;
  sideLetterCompanyAddress?: string;
  primaryInvestmentDate?: string;
  informationRights?: string;
  observerRights?: "yes" | "no";
  consentRights?: string;
  terminationClause?: string;
  disputeResolutionCity?: string;

  // Loan Agreement Fields
  loanAmount?: string;
  loanAmountFigures?: string;
  loanAmountWords?: string;
  loanPurpose?: string;
  loanStartDate?: string;
  loanEndDate?: string;
  lenderName?: string;
  lenderAddress?: string;
  lenderBankDetails?: string;
  lenderRepNameTitle?: string;
  borrowerName?: string;
  borrowerAddress?: string;
  borrowerRepNameTitle?: string;
  interestRate?: string;
  interestBasis?: "simple" | "compound";
  interestPaymentDates?: string;
  repaymentDate?: string;
  numberOfInstallments?: string;
  installmentAmount?: string;
  firstInstallmentDate?: string;
  paymentSchedule?: string;
  paymentMethod?: string;
  paymentDetails?: string;
  prepaymentOption?: "yes" | "no";
  jurisdiction?: string;
  noticesAddress?: string;
  loanJurisdiction?: string;
};

interface RouteParams {
  type: string;
}

export default function DocumentCreator() {
  const params = useParams<RouteParams>();
  const { toast } = useToast();
  const getFormSchema = (type: string) => {
    switch (type) {
      case "service":
        return z.object({
          dateOfAgreement: z.string().min(1, "Date is required"),
          serviceProviderName: z.string().min(1, "Service provider name is required"),
          serviceProviderAddress: z.string().min(1, "Service provider address is required"),
          serviceClientName: z.string().min(1, "Client name is required"),
          serviceClientAddress: z.string().min(1, "Client address is required"), 
          serviceDescription: z.string().min(1, "Service description is required"),
          serviceDuration: z.string().min(1, "Duration is required"),
          serviceStartDate: z.string().min(1, "Start date is required"),
          serviceEndDate: z.string().min(1, "End date is required"),
          serviceFees: z.string().min(1, "Fees are required"),
          servicePaymentTerms: z.string().min(1, "Payment terms are required"),
          serviceDeliverables: z.string().min(1, "Deliverables are required"),
          serviceTimeline: z.string().min(1, "Timeline is required"),
          servicePerformanceMetrics: z.string().min(1, "Performance metrics are required"),
          serviceTermination: z.string().min(1, "Termination terms are required"),
          serviceConfidentiality: z.string().min(1, "Confidentiality terms are required"),
          serviceIntellectualProperty: z.string().min(1, "IP terms are required"),
          serviceIndemnification: z.string().min(1, "Indemnification terms are required"),
          serviceLimitation: z.string().min(1, "Limitation of liability is required"),
          serviceGoverningLaw: z.string().min(1, "Governing law is required"),
          serviceDisputeResolution: z.string().min(1, "Dispute resolution terms are required"),
        });
      case "employment":
        return z.object({
          dateOfAgreement: z.string().min(1, "Date is required"),
          employmentCompanyName: z.string().min(1, "Company name is required"),
          employmentCompanyAddress: z.string().min(1, "Company address is required"),
          employmentEmployeeName: z.string().min(1, "Employee name is required"),
          employmentEmployeeAddress: z.string().min(1, "Employee address is required"),
          employmentJobTitle: z.string().min(1, "Job title is required"),
          employmentStartDate: z.string().min(1, "Start date is required"),
          employmentProbationPeriod: z.string().min(1, "Probation period is required"),
          employmentWorkingHours: z.string().min(1, "Working hours are required"),
          employmentPlaceOfWork: z.string().min(1, "Place of work is required"),
          employmentSalary: z.string().min(1, "Salary is required"),
          employmentSalaryPaymentDate: z.string().min(1, "Salary payment date is required"),
          employmentBenefits: z.string().min(1, "Benefits information is required"),
          employmentLeavePolicy: z.string().min(1, "Leave policy is required"),
          employmentNoticePeriod: z.string().min(1, "Notice period is required"),
          employmentTerminationConditions: z.string().min(1, "Termination conditions are required"),
          employmentIntellectualProperty: z.string().min(1, "IP clause is required"),
          employmentConfidentiality: z.string().min(1, "Confidentiality clause is required"), 
          employmentNonCompete: z.string().min(1, "Non-compete clause is required"),
          employmentJurisdiction: z.string().min(1, "Jurisdiction is required"),
          employmentWorkPolicy: z.string().min(1, "Work policy is required"),
          employmentPerformanceReview: z.string().min(1, "Performance review details are required"),
          employmentBonusStructure: z.string().min(1, "Bonus structure is required"),
        });
      case "shareholders":
        return z.object({
          dateOfAgreement: z.string().min(1, "Date is required"),
          shareholderCompanyName: z.string().min(1, "Company name is required"),
          shareholderCompanyAddress: z.string().min(1, "Company address is required"),
          shareholderNames: z.string().min(1, "Shareholder names are required"),
          shareholderAddresses: z.string().min(1, "Shareholder addresses are required"),
          shareholderShares: z.string().min(1, "Shareholding details are required"),
          numberOfDirectors: z.string().min(1, "Number of directors is required"),
          directorNominationThreshold: z.string().min(1, "Nomination threshold is required"),
          boardQuorum: z.string().min(1, "Board quorum is required"),
          mattersRequiringApproval: z.string().min(1, "Matters requiring approval are required"),
          approvalType: z.enum(["majority", "supermajority", "unanimous"]),
          shareTransferRestrictions: z.enum(["yes", "no"]),
          rightOfFirstRefusal: z.enum(["yes", "no"]),
          tagAlongRights: z.enum(["yes", "no"]),
          dragAlongRights: z.enum(["yes", "no"]),
          dividendThreshold: z.string().min(1, "Dividend threshold is required"),
          nonCompetePeriod: z.string().min(1, "Non-compete period is required"),
          arbitrationLocation: z.string().min(1, "Arbitration location is required"),
          arbitrationLanguage: z.string().min(1, "Arbitration language is required"),
          governingLawJurisdiction: z.string().min(1, "Jurisdiction is required"),
          noticeAddress: z.string().min(1, "Company notice address is required"),
          shareholderNoticeAddresses: z.string().min(1, "Shareholder notice addresses are required"),
          amendmentProcedure: z.string().min(1, "Amendment procedure is required"),
          confidentialityDefinition: z.string().min(1, "Confidentiality definition is required"),
          dividendDistributionPolicy: z.string().min(1, "Dividend distribution policy is required"),
          additionalProvisions: z.string().optional(),
        });
      case "subscription":
        return z.object({
          dateOfAgreement: z.string().min(1, "Date is required"),
          subscriptionIssuerName: z.string().min(1, "Issuer name is required"),
          subscriptionIssuerAddress: z.string().min(1, "Issuer address is required"),
          subscriptionSubscriberName: z.string().min(1, "Subscriber name is required"),
          subscriptionSubscriberAddress: z.string().min(1, "Subscriber address is required"),
          subscriptionNumShares: z.string().min(1, "Number of shares is required"),
          subscriptionShareClass: z.string().min(1, "Share class is required"),
          subscriptionPricePerShare: z.string().min(1, "Price per share is required"),
          subscriptionTotalAmount: z.string().min(1, "Total amount is required"),
          subscriptionPaymentMethod: z.string().min(1, "Payment method is required"),
          subscriptionPaymentDueDate: z.string().min(1, "Payment due date is required"),
          subscriptionBoardApprovalDate: z.string().min(1, "Board approval date is required"),
          subscriptionComplianceStatus: z.string().min(1, "Compliance status is required"),
          subscriptionRocFilings: z.string().min(1, "RoC filings details are required"),
          subscriptionAllotmentTimeline: z.string().min(1, "Allotment timeline is required"),
          subscriptionArbitrationCity: z.string().min(1, "Arbitration city is required"),
        });
      case "convertible-note":
        return z.object({
          convertibleCompanyName: z.string().min(1, "Company name is required"),
          convertibleCompanyAddress: z.string().min(1, "Company address is required"),
          convertibleInvestorName: z.string().min(1, "Investor name is required"),
          convertibleInvestorAddress: z.string().min(1, "Investor address is required"),
          convertiblePrincipalAmount: z.string().min(1, "Principal amount is required"),
          convertibleInterestRate: z.string().min(1, "Interest rate is required"),
          convertibleMaturityDate: z.string().min(1, "Maturity date is required"),
          convertibleQualifiedAmount: z.string().min(1, "Qualified financing amount is required"),
          convertibleDiscountPercent: z.string().min(1, "Discount percentage is required"),
          convertibleValuationCap: z.string().min(1, "Valuation cap is required"),
          convertibleSecurityType: z.string().min(1, "Security type is required"),
          convertibleDefaultDays: z.string().min(1, "Default payment days is required"),
          convertibleArbitrationCity: z.string().min(1, "Arbitration city is required"),
        });
      case "safe":
        return z.object({
          safeEffectiveDate: z.string().min(1, "Effective date is required"),
          safeCompanyName: z.string().min(1, "Company name is required"),
          safeJurisdiction: z.string().min(1, "Jurisdiction is required"),
          safeCompanyAddress: z.string().min(1, "Company address is required"),
          safeInvestorName: z.string().min(1, "Investor name is required"),
          safeInvestorAddress: z.string().min(1, "Investor address is required"),
          safeInvestmentAmount: z.string().min(1, "Investment amount is required"),
          safeUsageOfFunds: z.string().min(1, "Usage of funds is required"),
          safeFinancingThreshold: z.string().min(1, "Financing threshold is required"),
          safeValuationCap: z.string().min(1, "Valuation cap is required"),
          safeDiscountRate: z.string().min(1, "Discount rate is required"),
          safeArbitrationLocation: z.string().min(1, "Arbitration location is required"),
        });
      case "commission":
        return z.object({
          dateOfAgreement: z.string().min(1, "Date is required"),
          commissionCompanyName: z.string().min(1, "Company name is required"),
          commissionEntityType: z.string().min(1, "Entity type is required"),
          commissionCompanyAddress: z.string().min(1, "Company address is required"),
          commissionInvestorName: z.string().min(1, "Investor name is required"),
          commissionInvestorAddress: z.string().min(1, "Investor address is required"),
          commissionAmount: z.string().min(1, "Commission amount is required"),
          commissionMaturityDate: z.string().min(1, "Maturity date is required"),
          commissionInterestRate: z.string().min(1, "Interest rate is required"),
          commissionCompoundingFreq: z.string().min(1, "Compounding frequency is required"),
          commissionQualifiedMin: z.string().min(1, "Qualified financing minimum is required"),
          commissionDiscountPercent: z.string().min(1, "Discount percentage is required"),
          commissionValuationCap: z.string().min(1, "Valuation cap is required"),
          commissionLiquidityMult: z.string().min(1, "Liquidity event multiplier is required"),
          commissionReportingFreq: z.string().min(1, "Financial reporting frequency is required"),
          commissionObserverRights: z.enum(["yes", "no"]),
          commissionJurisdiction: z.string().min(1, "Jurisdiction is required"),
          commissionArbitrationRules: z.string().min(1, "Arbitration rules are required"),
          commissionArbitrationCity: z.string().min(1, "Arbitration city is required"),
        });
      case "investment":
        return z.object({
          dateOfAgreement: z.string().min(1, "Date is required"),
          investmentInvestorName: z.string().min(1, "Investor name is required"),
          investmentInvestorAddress: z.string().min(1, "Investor address is required"),
          investmentCompanyName: z.string().min(1, "Company name is required"),
          investmentCompanyAddress: z.string().min(1, "Company address is required"),
          investmentAmount: z.string().min(1, "Investment amount is required"),
          investmentType: z.string().min(1, "Investment type is required"),
          paymentTimeline: z.string().min(1, "Payment timeline is required"),
          investmentPurpose: z.string().min(1, "Purpose of investment is required"),
          investmentVotingRights: z.string().min(1, "Voting rights details are required"),
          boardRepresentation: z.string().min(1, "Board representation details are required"),
          informationRights: z.string().min(1, "Information rights details are required"),
          buybackTerms: z.string().min(1, "Buyback terms are required"),
          ipoExitRights: z.string().min(1, "IPO/Strategic sale rights are required"),
          investmentConfidentiality: z.string().min(1, "Confidentiality terms are required"),
          investmentTermination: z.string().min(1, "Termination terms are required"),
          investmentArbitrationCity: z.string().min(1, "Arbitration city is required"),
        });
      case "stock-purchase":
        return z.object({
          dateOfAgreement: z.string().min(1, "Date is required"),
          stockSellerName: z.string().min(1, "Seller name is required"),
          stockSellerAddress: z.string().min(1, "Seller address is required"),
          stockBuyerName: z.string().min(1, "Buyer name is required"),
          stockBuyerAddress: z.string().min(1, "Buyer address is required"),
          stockNumShares: z.string().min(1, "Number of shares is required"),
          stockCompanyName: z.string().min(1, "Company name is required"),
          stockPurchasePrice: z.string().min(1, "Purchase price is required"),
          stockPaymentMethod: z.string().min(1, "Payment method is required"),
          stockPaymentDeadline: z.string().min(1, "Payment deadline is required"),
          stockClosingDate: z.string().min(1, "Closing date is required"),
          stockClosingLocation: z.string().min(1, "Closing location is required"),
          stockJurisdiction: z.string().min(1, "Jurisdiction is required"),
        });
      case "loan":
        return z.object({
          dateOfAgreement: z.string().min(1, "Date is required"),
          lenderName: z.string().min(1, "Lender name is required"),
          lenderAddress: z.string().min(1, "Lender address is required"),
          borrowerName: z.string().min(1, "Borrower name is required"),
          borrowerAddress: z.string().min(1, "Borrower address is required"),
          loanAmountFigures: z.string().min(1, "Loan amount in figures is required"),
          loanAmountWords: z.string().min(1, "Loan amount in words is required"),
          loanPurpose: z.string().min(1, "Loan purpose is required"),
          loanStartDate: z.string().min(1, "Start date is required"),
          loanEndDate: z.string().min(1, "End date is required"),
          interestRate: z.string().min(1, "Interest rate is required"),
          interestBasis: z.enum(["simple", "compound"]),
          interestPaymentDates: z.string().min(1, "Interest payment dates are required"),
          numberOfInstallments: z.string().min(1, "Number of installments is required"),
          installmentAmount: z.string().min(1, "Installment amount is required"),
          firstInstallmentDate: z.string().min(1, "First installment date is required"),
          lenderBankDetails: z.string().min(1, "Bank details are required"),
          prepaymentOption: z.enum(["yes", "no"]),
          jurisdiction: z.string().min(1, "Jurisdiction is required"),
          noticesAddress: z.string().min(1, "Notices address is required"),
          lenderRepNameTitle: z.string().min(1, "Lender representative details are required"),
          borrowerRepNameTitle: z.string().min(1, "Borrower representative details are required"),
        });
      default:
        return z.object({});
    }
  };
  
  const formSchema = getFormSchema(params.type);

  const defaultValues = useMemo(() => {
    if (params.type === "service") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        serviceProviderName: "",
        serviceProviderAddress: "",
        serviceClientName: "",
        serviceClientAddress: "",
        serviceDescription: "",
        serviceDuration: "",
        serviceStartDate: format(new Date(), "yyyy-MM-dd"),
        serviceEndDate: format(new Date(), "yyyy-MM-dd"),
        serviceFees: "",
        servicePaymentTerms: "",
        serviceDeliverables: "",
        serviceTimeline: "",
        servicePerformanceMetrics: "",
        serviceTermination: "",
        serviceConfidentiality: "",
        serviceIntellectualProperty: "",
        serviceIndemnification: "",
        serviceLimitation: "",
        serviceGoverningLaw: "",
        serviceDisputeResolution: "",
      } as const;
    } else if (params.type === "employment") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        employmentCompanyName: "",
        employmentCompanyAddress: "",
        employmentEmployeeName: "",
        employmentEmployeeAddress: "",
        employmentJobTitle: "",
        employmentStartDate: format(new Date(), "yyyy-MM-dd"),
        employmentProbationPeriod: "",
        employmentWorkingHours: "",
        employmentPlaceOfWork: "",
        employmentSalary: "",
        employmentSalaryPaymentDate: "",
        employmentBenefits: "",
        employmentLeavePolicy: "",
        employmentNoticePeriod: "",
        employmentTerminationConditions: "",
        employmentIntellectualProperty: "",
        employmentConfidentiality: "",
        employmentNonCompete: "",
        employmentJurisdiction: "",
        employmentWorkPolicy: "",
        employmentPerformanceReview: "",
        employmentBonusStructure: "",
      } as const;
    } else if (params.type === "shareholders") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        shareholderCompanyName: "",
        shareholderCompanyAddress: "",
        shareholderNames: "",
        shareholderAddresses: "",
        shareholderShares: "",
        numberOfDirectors: "",
        directorNominationThreshold: "",
        boardQuorum: "",
        mattersRequiringApproval: "",
        approvalType: "majority",
        shareTransferRestrictions: "no",
        rightOfFirstRefusal: "no",
        tagAlongRights: "no",
        dragAlongRights: "no",
        dividendThreshold: "",
        nonCompetePeriod: "",
        arbitrationLocation: "",
        arbitrationLanguage: "",
        governingLawJurisdiction: "",
        noticeAddress: "",
        shareholderNoticeAddresses: "",
        amendmentProcedure: "",
        confidentialityDefinition: "",
        dividendDistributionPolicy: "",
        additionalProvisions: "",
      } as const;
    } else if (params.type === "subscription") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        subscriptionIssuerName: "",
        subscriptionIssuerAddress: "",
        subscriptionSubscriberName: "",
        subscriptionSubscriberAddress: "",
        subscriptionNumShares: "",
        subscriptionShareClass: "",
        subscriptionPricePerShare: "",
        subscriptionTotalAmount: "",
        subscriptionPaymentMethod: "",
        subscriptionPaymentDueDate: format(new Date(), "yyyy-MM-dd"),
        subscriptionBoardApprovalDate: format(new Date(), "yyyy-MM-dd"),
        subscriptionComplianceStatus: "",
        subscriptionRocFilings: "",
        subscriptionAllotmentTimeline: "",
        subscriptionArbitrationCity: "",
      } as const;
    } else if (params.type === "convertible-note") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        convertibleCompanyName: "",
        convertibleCompanyAddress: "",
        convertibleInvestorName: "",
        convertibleInvestorAddress: "",
        convertiblePrincipalAmount: "",
        convertibleInterestRate: "",
        convertibleMaturityDate: format(new Date(), "yyyy-MM-dd"),
        convertibleQualifiedAmount: "",
        convertibleDiscountPercent: "",
        convertibleValuationCap: "",
        convertibleSecurityType: "",
        convertibleDefaultDays: "",
        convertibleArbitrationCity: "",
      } as const;
    } else if (params.type === "safe") {
      return {
        safeEffectiveDate: format(new Date(), "yyyy-MM-dd"),
        safeCompanyName: "",
        safeJurisdiction: "",
        safeCompanyAddress: "",
        safeInvestorName: "",
        safeInvestorAddress: "",
        safeInvestmentAmount: "",
        safeUsageOfFunds: "",
        safeFinancingThreshold: "",
        safeValuationCap: "",
        safeDiscountRate: "",
        safeArbitrationLocation: "",
      } as const;
    } else if (params.type === "commission") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        commissionCompanyName: "",
        commissionEntityType: "",
        commissionCompanyAddress: "",
        commissionInvestorName: "",
        commissionInvestorAddress: "",
        commissionAmount: "",
        commissionMaturityDate: format(new Date(), "yyyy-MM-dd"),
        commissionInterestRate: "",
        commissionCompoundingFreq: "",
        commissionQualifiedMin: "",
        commissionDiscountPercent: "",
        commissionValuationCap: "",
        commissionLiquidityMult: "",
        commissionReportingFreq: "",
        commissionObserverRights: "no",
        commissionJurisdiction: "",
        commissionArbitrationRules: "",
        commissionArbitrationCity: "",
      } as const;
    } else if (params.type === "investment") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        investmentInvestorName: "",
        investmentInvestorAddress: "",
        investmentCompanyName: "",
        investmentCompanyAddress: "",
        investmentAmount: "",
        investmentType: "",
        paymentTimeline: "",
        investmentPurpose: "",
        investmentVotingRights: "",
        boardRepresentation: "",
        informationRights: "",
        buybackTerms: "",
        ipoExitRights: "",
        investmentConfidentiality: "",
        investmentTermination: "",
        investmentArbitrationCity: "",
      } as const;
    } else if (params.type === "voting-rights") {
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
    } else if (params.type === "founders") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        companyName: "",
        companyDescription: "",
        founder1Name: "",
        founder1Address: "",
        founder1EquityPercentage: "",
        founder1Responsibilities: "",
        founder2Name: "",
        founder2Address: "",
        founder2EquityPercentage: "",
        founder2Responsibilities: "",
        founder3Name: "",
        founder3Address: "",
        founder3EquityPercentage: "",
        founder3Responsibilities: "",
        vestingPeriod: "",
        cliffPeriod: "",
        accelerationConditions: "",
        unvestingTerms: "",
        votingRightsStructure: "",
        boardMembersCount: "",
        boardMembersNames: "",
        ipAssignmentTerms: "",
        confidentialityTerms: "",
        nonCompeteDuration: "",
        nonSolicitationDuration: "",
        exitNoticePeriod: "",
        equityValuationMethod: "",
        involuntaryExitCauses: "",
        arbitrationVenue: "",
        jurisdiction: "",
      } as const;
    } else if (params.type === "side-letter") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        sideLetterInvestorName: "",
        sideLetterInvestorAddress: "",
        sideLetterCompanyName: "",
        sideLetterCompanyAddress: "",
        primaryInvestmentDate: format(new Date(), "yyyy-MM-dd"),
        informationRights: "",
        observerRights: "no",
        consentRights: "",
        terminationClause: "",
        disputeResolutionCity: "",
      } as const;
    } else if (params.type === "promissory-note") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        loanAmount: "",
        borrowerName: "",
        borrowerAddress: "",
        lenderName: "",
        lenderAddress: "",
        interestRate: "",
        repaymentDate: format(new Date(), "yyyy-MM-dd"),
        numberOfInstallments: "",
        installmentAmount: "",
        firstInstallmentDate: format(new Date(), "yyyy-MM-dd"),
        paymentSchedule: "",
        paymentMethod: "",
        paymentDetails: "",
        loanJurisdiction: "",
        jurisdiction: "",
        interestBasis: "simple",
        interestPaymentDates: "",
        lenderBankDetails: "",
        prepaymentOption: "no",
        noticesAddress: "",
        lenderRepNameTitle: "",
        borrowerRepNameTitle: "",
      } as const;
    } else if (params.type === "stock-purchase") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        stockSellerName: "",
        stockSellerAddress: "",
        stockBuyerName: "",
        stockBuyerAddress: "",
        stockNumShares: "",
        stockCompanyName: "",
        stockPurchasePrice: "",
        stockPaymentMethod: "",
        stockPaymentDeadline: "",
        stockClosingDate: format(new Date(), "yyyy-MM-dd"),
        stockClosingLocation: "",
        stockJurisdiction: "",
      } as const;
    } else if (params.type === "loan") {
      return {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        lenderName: "",
        lenderAddress: "",
        borrowerName: "",
        borrowerAddress: "",
        loanAmountFigures: "",
        loanAmountWords: "",
        loanPurpose: "",
        loanStartDate: format(new Date(), "yyyy-MM-dd"),
        loanEndDate: format(new Date(), "yyyy-MM-dd"),
        interestRate: "",
        interestBasis: "simple",
        interestPaymentDates: "",
        numberOfInstallments: "",
        installmentAmount: "",
        firstInstallmentDate: format(new Date(), "yyyy-MM-dd"),
        lenderBankDetails: "",
        prepaymentOption: "no",
        jurisdiction: "",
        noticesAddress: "",
        lenderRepNameTitle: "",
        borrowerRepNameTitle: "",
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
      case "shareholders":
        return "Shareholders Agreement";
      case "subscription":
        return "Subscription Agreement";
      case "stock-purchase":
        return "Stock Purchase Agreement";
      case "convertible-note":
        return "Convertible Note Agreement";
      case "safe":
        return "SAFE Agreement";
      case "investment":
        return "Investment Agreement";
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
      case "founders":
        return "Founders Agreement";
      case "side-letter":
        return "Side Letter Agreement";
      case "promissory-note":
        return "Promissory Note / Loan Agreement";
      default:
        return "Document";
    }
  };

  const renderFormFields = () => {
    switch (params.type) {
      case "service":
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

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="serviceProviderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Provider Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name of service provider" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceProviderAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Provider Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Complete address of service provider" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceClientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name of client" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceClientAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Complete address of client" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Service Details</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="serviceDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detailed description of services to be provided" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="serviceDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 12 months" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceEndDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-6">Payment Terms</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="serviceFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Fees</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detailed fee structure and amounts" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="servicePaymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Payment schedule, method, and conditions" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Deliverables and Timeline</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="serviceDeliverables"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deliverables</FormLabel>
                      <FormControl>
                        <Textarea placeholder="List of specific deliverables" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceTimeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeline</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Delivery schedule and milestones" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="servicePerformanceMetrics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Performance Metrics</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Key performance indicators and standards" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Legal Terms</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="serviceTermination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Terms</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Conditions and process for termination" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceConfidentiality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confidentiality Terms</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Confidentiality obligations and restrictions" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceIntellectualProperty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intellectual Property Rights</FormLabel>
                      <FormControl>
                        <Textarea placeholder="IP ownership and rights" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceIndemnification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indemnification</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Indemnification terms and conditions" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceLimitation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limitation of Liability</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Liability limitations and exclusions" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceGoverningLaw"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Governing Law</FormLabel>
                      <FormControl>
                        <Input placeholder="Jurisdiction for legal matters" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceDisputeResolution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dispute Resolution</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Process for resolving disputes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
      case "employment":
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
                  name="employmentStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="employmentCompanyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Legal name of the company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentCompanyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Registered address of the company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="employmentEmployeeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name of the employee" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentEmployeeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Current residential address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employmentJobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Position/Designation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentProbationPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Probation Period</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3 months" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employmentWorkingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Hours</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 9:00 AM to 6:00 PM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentPlaceOfWork"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place of Work</FormLabel>
                      <FormControl>
                        <Input placeholder="Office location or remote work" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Compensation</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="employmentSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Monthly/Annual salary breakdown" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentSalaryPaymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Payment Date</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Last working day of each month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentBonusStructure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bonus Structure</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Details of performance bonus, annual bonus, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Benefits and Policies</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="employmentBenefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefits</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Health insurance, retirement benefits, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentLeavePolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Policy</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Annual leave, sick leave, other leave entitlements" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentWorkPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Policy</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Remote work, office policies, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Performance and Reviews</h3>
              <FormField
                control={form.control}
                name="employmentPerformanceReview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Performance Review Process</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Frequency and criteria for performance reviews" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Termination and Notice</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="employmentNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notice Period</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 30 days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentTerminationConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Conditions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Grounds for termination and process" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Legal Terms</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="employmentIntellectualProperty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intellectual Property Rights</FormLabel>
                      <FormControl>
                        <Textarea placeholder="IP ownership and rights" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentConfidentiality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confidentiality Agreement</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Confidentiality terms and conditions" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentNonCompete"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Non-Compete Clause</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Non-compete terms and duration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentJurisdiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Governing Law</FormLabel>
                      <FormControl>
                        <Input placeholder="Jurisdiction for legal matters" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
      case "shareholders":
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

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="shareholderCompanyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of the Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shareholderCompanyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Registered Address of the Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Shareholders Details</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="shareholderNames"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shareholders' Names</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter each shareholder's name on a new line&#10;Example:&#10;Shareholder A: John Doe&#10;Shareholder B: Jane Smith" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shareholderAddresses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shareholders' Addresses</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter each shareholder's address on a new line&#10;Example:&#10;Shareholder A: [Address]&#10;Shareholder B: [Address]" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shareholderShares"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shareholding Structure</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter each shareholder's shares/percentage on a new line&#10;Example:&#10;Shareholder A: 60%&#10;Shareholder B: 40%" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Board Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numberOfDirectors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Directors</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Number of Directors" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="directorNominationThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Director Nomination Threshold</FormLabel>
                      <FormControl>
                        <Input placeholder="Shareholding percentage required" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="boardQuorum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quorum for Board Meetings</FormLabel>
                      <FormControl>
                        <Input placeholder="Number of Directors required" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Special Matters</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="mattersRequiringApproval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matters Requiring Special Approval</FormLabel>
                      <FormControl>
                        <Textarea placeholder="List specific matters, e.g., mergers, acquisitions, issuing new shares" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="approvalType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Approval</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select approval type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="majority">Majority</SelectItem>
                          <SelectItem value="supermajority">Supermajority</SelectItem>
                          <SelectItem value="unanimous">Unanimous</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Rights and Restrictions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shareTransferRestrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Share Transfer Restrictions</FormLabel>
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
                  name="rightOfFirstRefusal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Right of First Refusal (ROFR)</FormLabel>
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
                  name="tagAlongRights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag-Along Rights</FormLabel>
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
                  name="dragAlongRights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drag-Along Rights</FormLabel>
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
                name="dividendThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dividend Approval Threshold</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select threshold" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="majority">Majority</SelectItem>
                        <SelectItem value="supermajority">Supermajority</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nonCompetePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Non-Compete Period</FormLabel>
                    <FormControl>
                      <Input placeholder="Duration after ceasing to be a Shareholder, e.g., 1 year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Legal Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="arbitrationLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arbitration Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City/Location for arbitration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arbitrationLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language of Arbitration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., English" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="governingLawJurisdiction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurisdiction for Governing Law</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Courts in Delhi, India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="noticeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notice Address for the Company</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Company's official address for receiving notices" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shareholderNoticeAddresses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notice Address for Shareholders</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter each shareholder's notice address&#10;Example:&#10;Shareholder A: [Address]&#10;Shareholder B: [Address]" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="amendmentProcedure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amendment Procedure</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specify whether amendments require unanimous consent or other conditions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confidentialityDefinition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidential Information Definition</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Define what constitutes confidential information" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dividendDistributionPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dividend Distribution Policy</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details about how dividends will be distributed, e.g., annually, proportionate to shareholding" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalProvisions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Provisions</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any other specific provisions requested by the customer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case "subscription":
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

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="subscriptionIssuerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name of Issuer Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionIssuerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuer Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Registered Address of Issuer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionSubscriberName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscriber Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name of Subscriber" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionSubscriberAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscriber Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Address of Subscriber" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Share Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subscriptionNumShares"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Shares Subscribed</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Number of Shares" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionShareClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class and Type of Shares</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Equity Shares" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subscriptionPricePerShare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Per Share</FormLabel>
                      <FormControl>
                        <Input placeholder="INR Amount per Share" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionTotalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Subscription Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="INR Total Amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subscriptionPaymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <Input placeholder="Bank Transfer/Cheque/Other" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionPaymentDueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Conditions Precedent</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="subscriptionBoardApprovalDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuer's Board Approval Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionComplianceStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compliance Status with Companies Act, 2013</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Details of compliance status" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionRocFilings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filings with Registrar of Companies (RoC)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Details of RoC filings" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Timeline and Legal Terms</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="subscriptionAllotmentTimeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Share Allotment Timeline</FormLabel>
                      <FormControl>
                        <Input placeholder="Number of Days from Payment Receipt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionArbitrationCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arbitration City</FormLabel>
                      <FormControl>
                        <Input placeholder="City Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
      case "stock-purchase":
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

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="stockSellerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seller Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name of Seller" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stockSellerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seller Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Seller's Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stockBuyerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buyer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name of Buyer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stockBuyerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buyer Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Buyer's Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Share Details</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="stockNumShares"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Shares</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Number of shares being sold" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stockCompanyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of the company issuing the shares" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stockPurchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Price (INR)</FormLabel>
                      <FormControl>
                        <Input placeholder="₹Amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Transaction Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stockPaymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <Input placeholder="Bank Transfer/Cheque/Other Method" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stockPaymentDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Deadline</FormLabel>
                      <FormControl>
                        <Input placeholder="Number of days after Agreement execution" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stockClosingDate"
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
                <FormField
                  control={form.control}
                  name="stockClosingLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Closing Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Location where the transaction will take place" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Legal Terms</h3>
              <FormField
                control={form.control}
                name="stockJurisdiction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurisdiction</FormLabel>
                    <FormControl>
                      <Input placeholder="Jurisdiction where disputes will be resolved" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case "convertible-note":
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

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="convertibleCompanyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="convertibleCompanyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Principal Office Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="convertibleInvestorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name of Investor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="convertibleInvestorAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investor Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Investor's Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Investment Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="convertiblePrincipalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Principal Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="INR Amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="convertibleInterestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate</FormLabel>
                      <FormControl>
                        <Input placeholder="Rate in % per annum" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="convertibleMaturityDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maturity Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="convertibleQualifiedAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualified Financing Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="INR Amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Financial Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="convertibleDiscountPercent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Percentage</FormLabel>
                      <FormControl>
                        <Input placeholder="Percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="convertibleValuationCap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valuation Cap</FormLabel>
                      <FormControl>
                        <Input placeholder="INR Amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="convertibleSecurityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Security</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Preferred Shares" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="convertibleDefaultDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Days for Default Payment</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Number of days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Legal Terms</h3>
              <FormField
                control={form.control}
                name="convertibleArbitrationCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitration City</FormLabel>
                    <FormControl>
                      <Input placeholder="City in India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case "safe":
        return (
          <>
            <div className="grid gap-6">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="safeEffectiveDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Effective Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="safeCompanyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name of the Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="safeJurisdiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jurisdiction (Company Incorporation)</FormLabel>
                      <FormControl>
                        <Input placeholder="Country/State of Incorporation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="safeCompanyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Principal office address of the Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="safeInvestorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name of the Investor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="safeInvestorAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investor Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Address of the Investor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Investment Details</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="safeInvestmentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Amount (INR)</FormLabel>
                      <FormControl>
                        <Input placeholder="Investment Amount in Rupees" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="safeUsageOfFunds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usage of Funds</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Specify purpose or general corporate purposes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Financial Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="safeFinancingThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualified Financing Threshold Amount (INR)</FormLabel>
                      <FormControl>
                        <Input placeholder="Threshold Amount for Equity Financing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="safeValuationCap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valuation Cap Amount (INR)</FormLabel>
                      <FormControl>
                        <Input placeholder="Maximum Valuation Cap for Equity Calculation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="safeDiscountRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Rate (%)</FormLabel>
                    <FormControl>
                      <Input placeholder="Percentage Discount for Qualified Financing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Legal Terms</h3>
              <FormField
                control={form.control}
                name="safeArbitrationLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitration Location (Dispute Resolution)</FormLabel>
                    <FormControl>
                      <Input placeholder="City/Location for Arbitration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case "commission":
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

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="commissionCompanyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name of Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commissionEntityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Entity</FormLabel>
                      <FormControl>
                        <Input placeholder="Private Limited Company, LLP, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commissionCompanyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Registered Address of the Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="commissionInvestorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name of Investor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commissionInvestorAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investor Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Investor's Residential/Principal Office Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Investment Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="commissionAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="₹ or other currency amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commissionMaturityDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maturity Date</FormLabel>
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
                  name="commissionInterestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 8%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commissionCompoundingFreq"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compounding Frequency</FormLabel>
                      <FormControl>
                        <Input placeholder="Annually, quarterly, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Financial Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="commissionQualifiedMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualified Financing Minimum Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="₹ or other currency minimum amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commissionDiscountPercent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Percentage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 20%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="commissionValuationCap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valuation Cap</FormLabel>
                      <FormControl>
                        <Input placeholder="₹ or other currency valuation cap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commissionLiquidityMult"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Liquidity Event Multiplier</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2x" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Rights and Reporting</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="commissionReportingFreq"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Financial Reporting Frequency</FormLabel>
                      <FormControl>
                        <Input placeholder="Quarterly, annually, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commissionObserverRights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observer Rights</FormLabel>
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

              <h3 className="text-lg font-semibold mt-6">Legal Terms</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="commissionJurisdiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jurisdiction for Governing Law</FormLabel>
                      <FormControl>
                        <Input placeholder="State/Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commissionArbitrationRules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arbitration Rules</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Arbitration and Conciliation Act, 1996" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commissionArbitrationCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arbitration City</FormLabel>
                      <FormControl>
                        <Input placeholder="City where arbitration will take place" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
      case "investment":
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

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="investmentInvestorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name of the Investor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investmentInvestorAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investor Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Complete address of the Investor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investmentCompanyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of the Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investmentCompanyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Registered Office Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Investment Details</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="investmentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="₹Amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Investment</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Number of shares or financial instruments, class of equity, percentage of total shareholding" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentTimeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Timeline</FormLabel>
                      <FormControl>
                        <Input placeholder="Number of days for payment after signing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investmentPurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose of Investment Funds</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Specific use, e.g., operational growth, product development, marketing, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Rights and Representation</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="investmentVotingRights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voting Rights</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Specify voting rights for the Investor, if any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="boardRepresentation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Board Representation</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Specify board representation rights, if applicable" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="informationRights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Information Rights</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Access to reports or updates, as needed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Exit Mechanisms</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="buybackTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buyback Option Terms</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Specify buyback terms" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ipoExitRights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IPO/Strategic Sale Rights</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Exit rights in case of IPO or company sale" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Legal Terms</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="investmentConfidentiality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confidentiality Terms</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Specify exceptions, if any, to confidentiality" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investmentTermination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Terms</FormLabel>
                      <FormControl>
                        <Input placeholder="Number of days' notice for breach rectification" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investmentArbitrationCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arbitration City</FormLabel>
                      <FormControl>
                        <Input placeholder="City for arbitration venue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
      case "loan":
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

              <h3 className="text-lg font-semibold mt-6">Parties</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="lenderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lender Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Lender's Full Name/Company Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lenderAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lender Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Complete address of the Lender" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="borrowerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Borrower Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Borrower's Full Name/Company Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="borrowerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Borrower Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Complete address of the Borrower" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Loan Details</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="loanAmountFigures"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Amount (Figures)</FormLabel>
                        <FormControl>
                          <Input placeholder="₹Amount in Figures" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="loanAmountWords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Amount (Words)</FormLabel>
                        <FormControl>
                          <Input placeholder="Amount in Words" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="loanPurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Purpose</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Specific purpose, e.g., 'to finance the business operations of the Borrower'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Loan Term</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="loanStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="loanEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Interest Details</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Rate</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interestBasis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Basis</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select interest basis" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="simple">Simple</SelectItem>
                            <SelectItem value="compound">Compound</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="interestPaymentDates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Payment Dates</FormLabel>
                      <FormControl>
                        <Input placeholder="Specific dates, e.g., 'the first day of each month'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Repayment Terms</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="numberOfInstallments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Installments</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="installmentAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Installment Amount</FormLabel>
                        <FormControl>
                          <Input placeholder="₹Amount per installment" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="firstInstallmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Installment Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="lenderBankDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lender's Bank Account Details</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Account Details/Address for Payments" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="prepaymentOption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prepayment Option</FormLabel>
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
                  name="jurisdiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jurisdiction for Disputes</FormLabel>
                      <FormControl>
                        <Input placeholder="City/State in India" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="noticesAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notices and Communication Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Address for each Party" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Signatory Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lenderRepNameTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lender's Representative Name & Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Name/Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="borrowerRepNameTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Borrower's Representative Name & Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Name/Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
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
                        <Input placeholder="Name of the Company" {...field} />
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
                        <Input placeholder="Name of the Investor" {...field} />
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
                      <Textarea placeholder="Complete address of the Issuer" {...field} />
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
                      <Textarea placeholder="Complete address of the Investor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ecfInvestmentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="Amount in INR/USD" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ecfEquityAllocated"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equity Allocated</FormLabel>
                      <FormControl>
                        <Input placeholder="Number of Shares or Percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ecfTotalEquityPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Equity Percentage</FormLabel>
                      <FormControl>
                        <Input placeholder="Percentage of Issuer's Total Equity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ecfShareClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class of Shares</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Common Shares or Preferred Shares" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="ecfUseOfFunds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Use of Funds</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specific purposes, e.g., product development, marketing, operational expenses" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 mdcols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ecfPlatformName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of the Crowdfunding Platform" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ecfPlatformFeesResponsibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform Fees Responsibility</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select responsibility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="issuer">Issuer</SelectItem>
                          <SelectItem value="investor">Investor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="ecfVotingRights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voting Rights</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specify voting rights if applicable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ecfPeriodicUpdates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periodic Updates</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Quarterly financial reports" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ecfDividendsEligibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dividends Eligibility</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectoption" />
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
                name="ecfInvestorAcknowledgments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investor Legal Acknowledgments</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Acknowledgment of Risks" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ecfConfidentialityClause"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidentiality Clause</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specify any additional confidentiality details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold">Exit Strategy Mechanisms</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="ecfExitStrategySale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale of shares in future funding round</FormLabel>
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
                  name="ecfExitStrategyMerger"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exit through acquisition/merger</FormLabel>
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
                  name="ecfExitStrategyListing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Public listing</FormLabel>
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
                  name="ecfArbitrationCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dispute Resolution Arbitration City/State</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ecfGoverningLawCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Governing Law City/State</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ecfIssuerRepName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuer Representative Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Issuer Representative's Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ecfIssuerRepTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuer Representative Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CEO, Founder" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="ecfInvestorSignatureName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investor Name (for signature)</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of Investor" {...field} />
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
                  render={({ field }) => (
                    <FormItem>
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
      case "side-letter":
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
                  name="primaryInvestmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Investment Agreement Date</FormLabel>
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
                  name="investorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name of Investor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name of Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="investorAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investor Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Complete address of the Investor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Complete address of the Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Investor Rights</h3>
              <FormField
                control={form.control}
                name="informationRights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Information Rights</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., Quarterly financial statements, board meeting summaries, material business developments"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observerRights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observer Rights</FormLabel>
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
                name="consentRights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consent Rights</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., Issuing new shares, selling assets, amending primary agreement"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terminationClause"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination Clause</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., Termination of Primary Investment Agreement, Mutual Agreement, or other conditions"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="disputeResolutionCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dispute Resolution City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case "promissory-note":
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
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="Insert Loan Amount in words and figures" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="borrowerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Borrower Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Legal Name of Borrower" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="borrowerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Borrower Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Complete address of the Borrower" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="lenderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lender Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Legal Name of Lender" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lenderAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lender Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Complete address of the Lender" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate (% per annum)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="repaymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Final Repayment Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Repayment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numberOfInstallments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Installments</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="installmentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Installment Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="Amount per installment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstPaymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Payment Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Schedule</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., First of every month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., bank transfer, cheque" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Bank account details or other payment instructions" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="loanJurisdiction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurisdiction</FormLabel>
                    <FormControl>
                      <Input placeholder="City/Region for jurisdiction" {...field} />
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

function getFormSchema(type: string): z.ZodType<any> {
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
    case "founders":
      return foundersFormSchema;
    case "side-letter":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        investorName: z.string().min(1, "Investor name is required"),
        investorAddress: z.string().min(1, "Investor address is required"),
        companyName: z.string().min(1, "Company name is required"),
        companyAddress: z.string().min(1, "Company address is required"),
        primaryInvestmentDate: z.string().min(1, "Primary investment date is required"),
        informationRights: z.string().min(1, "Information rights are required"),
        observerRights: z.enum(["yes", "no"]),
        consentRights: z.string().min(1, "Consent rights are required"),
        terminationClause: z.string().min(1, "Termination clause is required"),
        disputeResolutionCity: z.string().min(1, "Dispute resolution city is required"),
      });
    case "promissory-note":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        loanAmount: z.string().min(1, "Loan amount is required"),
        borrowerName: z.string().min(1, "Borrower name is required"),
        borrowerAddress: z.string().min(1, "Borrower address is required"),
        lenderName: z.string().min(1, "Lender name is required"),
        lenderAddress: z.string().min(1, "Lender address is required"),
        interestRate: z.string().min(1, "Interest rate is required"),
        repaymentDate: z.string().min(1, "Repayment date is required"),
        numberOfInstallments: z.string().min(1, "Number of installments is required"),
        installmentAmount: z.string().min(1, "Installment amount is required"),
        firstPaymentDate: z.string().min(1, "First payment date is required"),
        paymentSchedule: z.string().min(1, "Payment schedule is required"),
        paymentMethod: z.string().min(1, "Payment method is required"),
        paymentDetails: z.string().min(1, "Payment details are required"),
        loanJurisdiction: z.string().min(1, "Jurisdiction is required"),
      });
    default:
      return z.object({});
  }
}
const foundersFormSchema = z.object({
  dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
  companyName: z.string().min(1, "Company Name is required"),
  companyDescription: z.string().min(1, "Company Description is required"),
  founder1Name: z.string().min(1, "Founder 1 Name is required"),
  founder1Address: z.string().min(1, "Founder 1 Address is required"),
  founder1EquityPercentage: z.string().min(1, "Founder 1 Equity Percentage is required"),
  founder1Responsibilities: z.string().min(1, "Founder 1 Responsibilities are required"),
  founder2Name: z.string().min(1, "Founder 2 Name is required"),
  founder2Address: z.string().min(1, "Founder 2 Address is required"),
  founder2EquityPercentage: z.string().min(1, "Founder 2 Equity Percentage is required"),
  founder2Responsibilities: z.string().min(1, "Founder 2 Responsibilities are required"),
  founder3Name: z.string().optional(),
  founder3Address: z.string().optional(),
  founder3EquityPercentage: z.string().optional(),
  founder3Responsibilities: z.string().optional(),
  vestingPeriod: z.string().min(1, "Vesting Period is required"),
  cliffPeriod: z.string().min(1, "Cliff Period is required"),
  accelerationConditions: z.string().min(1, "Acceleration Conditions are required"),
  unvestingTerms: z.string().min(1, "Unvesting Terms are required"),
  votingRightsStructure: z.string().min(1, "Voting Rights Structure is required"),
  boardMembersCount: z.string().min(1, "Board Members Count is required"),
  boardMembersNames: z.string().min(1, "Board Members Names are required"),
  ipAssignmentTerms: z.string().min(1, "IP Assignment Terms are required"),
  confidentialityTerms: z.string().min(1, "Confidentiality Terms are required"),
  nonCompeteDuration: z.string().min(1, "Non-Compete Duration is required"),
  nonSolicitationDuration: z.string().min(1, "Non-Solicitation Duration is required"),
  exitNoticePeriod: z.string().min(1, "Exit Notice Period is required"),
  equityValuationMethod: z.string().min(1, "Equity Valuation Method is required"),
  involuntaryExitCauses: z.string().min(1, "Involuntary Exit Causes are required"),
  arbitrationVenue: z.string().min(1, "Arbitration Venue is required"),
  jurisdiction: z.string().min(1, "Jurisdiction is required"),
});