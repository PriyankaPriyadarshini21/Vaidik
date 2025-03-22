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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Update FormFields type to include DPA fields
type FormFields = {
  // Affiliate/Referral Agreement Fields
  affiliateCompanyName?: string;
  affiliateCompanyAddress?: string;
  affiliateName?: string;
  affiliateAddress?: string;
  referralFeeStructure?: string;
  affiliatePaymentMethod?: string;
  affiliatePaymentSchedule?: string;
  affiliateNoticePeriod?: string;  
  affiliateArbitrationLocation?: string;
  affiliateJurisdiction?: string;
  affiliateStartDate?: string;

  // Revenue Sharing Agreement Fields
  revenueCompanyName?: string;
  revenueCompanyAddress?: string;
  investorNames?: string;
  investorAddress?: string;
  investmentAmount?: string;
  investmentPaymentMethod?: string;
  investmentPurpose?: string;
  revenueSharePercentage?: string;
  repaymentTerm?: string;
  revenuePaymentSchedule?: "monthly" | "quarterly" | "annual";
  paymentStartDate?: string;
  revenueCalculation?: string;
  revenueAgreementTerm?: string;
  revenueTerminationPeriod?: string;
  revenueArbitrationLocation?: string;
  revenueGoverningJurisdiction?: string;

  // Distribution Agreement Fields
  principalName?: string;
  principalAddress?: string;
  distributorName?: string;
  distributorAddress?: string;
  distributionAppointmentType?: "exclusive" | "non-exclusive";
  distributionTerritory?: string;
  productsDescription?: string;
  productChangeNotice?: string;
  pricingDetails?: string;
  priceRevisionNotice?: string;
  distributionPaymentTerms?: string;
  distributionLatePaymentRate?: string;
  paymentCurrency?: string;
  agreementStartDate?: string;
  distributionDuration?: string;
  distributionTerminationNotice?: string;
  distributionBreachNotice?: string;
  distributionArbitrationLocation?: string;
  governingJurisdiction?: string;

  // Sales Agreement Fields
  sellerName?: string;
  sellerAddress?: string; 
  buyerName?: string;
  buyerAddress?: string;
  salesGoodsDescription?: string;
  deliveryLocation?: string;
  deliveryTimeframe?: string;
  purchasePrice?: string;
  salesPaymentSchedule?: string;
  salesPaymentMethod?: string;
  inspectionPeriod?: string;
  riskOfLoss?: string;
  salesArbitrationCity?: string;

  // Software Development Agreement Fields
  softwareClientName?: string;
  softwareClientAddress?: string;
  developerName?: string;
  developerAddress?: string;
  projectRequirements?: string;
  projectTimeline?: string;
  projectCost?: string;
  upfrontPayment?: string;
  milestonePayment?: string;
  milestoneName?: string;
  finalPayment?: string;
  softwarePaymentMethod?: string;
  invoiceDeadline?: string;
  warrantyPeriod?: string;
  generalTerminationPeriod?: string;
  breachNoticePeriod?: string;
  softwareArbitrationVenue?: string;
  noticeMethod?: string;

  // Event Management Agreement Fields
  eventClientName?: string;
  eventClientAddress?: string;
  eventManagerName?: string;
  eventManagerAddress?: string;
  eventName?: string;
  eventDates?: string;
  eventServices?: {
    planning?: boolean;
    venue?: boolean;
    vendorManagement?: boolean;
    promotion?: boolean;
    onSiteManagement?: boolean;
    postEvent?: boolean;
  };
  eventAdditionalServices?: string;
  eventTotalFee?: string;
  eventPaymentSchedule?: {
    signingPercentage?: string;
    planningPercentage?: string;
    completionPercentage?: string;
  };
  eventPaymentMethod?: string;
  latePaymentRate?: string;
  cancellationNoticePeriod?: string;
  eventRefundPolicy?: {
    refundPercentage?: string;
    refundDate?: string;
    noRefundDate?: string;
  };
  // Employment Agreement Fields  
  dateOfAgreement?: string;
  companyName?: string;
  employerAddress?: string;
  employeeFullName?: string;
  employeeAddress?: string;
  jobTitle?: string;
  startDate?: string;
  baseSalary?: string;
  salaryFrequency?: "monthly" | "yearly";
  bonusDetails?: string;
  benefits?: string;
  workHoursPerWeek?: string;
  workStartTime?: string;
  workEndTime?: string;
  nonCompetePeriod?: string;
  nonSolicitationPeriod?: string;
  employerNoticePeriod?: string;
  employeeNoticePeriod?: string;
  governingLocation?: string;
  // Service Agreement Fields
  serviceCompanyName?: string;
  companyType?: "company" | "individual";
  companyAddress?: string;
  companyTitle?: string;
  clientName?: string;
  clientAddress?: string;
  clientTitle?: string;
  serviceDescription?: string;
  serviceStartDate?: string;
  serviceEndDate?: string;
  serviceFee?: string;
  paymentSchedule?: "installments" | "lumpsum";
  expenseReimbursement?: "yes" | "no";
  paymentMode?: string;
  // Freelancer Agreement Fields
  freelancerName?: string;
  freelancerAddress?: string;
  deliverables?: string;
  deliverableTimeline?: string;
  // Commission Agreement Fields
  agentName?: string;
  agentAddress?: string;
  productsCovered?: string;
  territory?: string;
  appointmentType?: "exclusive" | "non-exclusive";
  commissionRate?: string;
  commissionBasis?: string;
  tieredStructure?: string;
  paymentDay?: string;
  paymentMethod?: string;
  confidentialityTerms?: string;
  noticePeriod?: string;
  arbitrationLocation?: string;
  jurisdiction?: string;
  // Shared Fields
  terminationNoticePeriod?: string;
  nonPaymentNoticePeriod?: string;
  arbitrationCity?: string;
  endDate?: string;
  compensationAmount?: string;
  paymentTerms?: string | "installments" | "lumpsum";
  // Vendor Agreement Fields
  vendorName?: string;
  vendorType?: "company" | "individual";
  vendorAddress?: string;
  vendorTitle?: string;
  goodsDescription?: string;
  pricePerUnit?: string;
  deliveryAddress?: string;
  // DPA Fields
  controllerName?: string;
  controllerAddress?: string;
  controllerContact?: string;
  controllerEmail?: string;
  controllerPhone?: string;
  processorName?: string;
  processorAddress?: string;
  processorContact?: string;
  processorEmail?: string;
  processorPhone?: string;
  processingPurpose?: string;
  processingNature?: string;
  processingDuration?: string;
  personalData?: string;
  sensitiveData?: string;
  otherData?: string;
  dataSubjects?: string;
  processingInstructions?: string;
  encryptionStandards?: string;
  accessControl?: string;
  dataBackup?: string;
  additionalMeasures?: string;
  retentionPeriod?: string;
  subProcessorApproval?: "yes" | "no";
  subProcessorDetails?: string;
  breachNotificationPeriod?: string;
  reportingFormat?: string;

  // Software License Agreement Fields
  licensorName?: string;
  licensorAddress?: string;
  licenseeName?: string;
  licenseeAddress?: string;
  licenseType?: "exclusive" | "non-exclusive";
  softwareName?: string;
  softwareUse?: string;
  licenseFee?: string;
  initialPayment?: string;
  subsequentPayments?: string;
  deliveryTimeline?: string;  
  installationAssistance?: "yes" | "no";
  standardSupport?: string;
  supportDuration?: string;
  additionalSupportCharges?: string;
  softwareWarrantyPeriod?: string;
  agreementDuration?: string;
  licenseTerminationPeriod?: string;
  licenseArbitrationCity?: string;

  // Marketing/Advertising Agreement Fields
  marketingClientName?: string;
  marketingClientAddress?: string;
  agencyName?: string;
  agencyAddress?: string;
  marketingServices?: string;
  additionalMarketingServices?: string;
  marketingStartDate?: string;
  marketingEndDate?: string;
  marketingTotalFee?: string;
  marketingPaymentSchedule?: string;
  additionalCosts?: string;
  applicableTaxes?: string;
  marketingDeliverables?: string;
  agencyResponsibilities?: string;
  clientResponsibilities?: string;
  ipOwnership?: string;
  agencyUsageRights?: string;
  performanceMetrics?: string;
  terminationPeriod?: string;
  nonPaymentPeriod?: string;
  immediateTermination?: string;
  marketingArbitrationVenue?: string;
  clientNameTitle?: string;
  agencyNameTitle?: string;
};

// Add vendor schema to getFormSchema function
const getFormSchema = (type: string) => {
  switch (type) {
    case "affiliate":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        affiliateCompanyName: z.string().min(1, "Company Name is required"),
        affiliateCompanyAddress: z.string().min(1, "Company Address is required"),
        affiliateName: z.string().min(1, "Affiliate/Referrer Name is required"),
        affiliateAddress: z.string().min(1, "Affiliate/Referrer Address is required"),
        referralFeeStructure: z.string().min(1, "Referral Fee/Commission Structure is required"),
        affiliatePaymentMethod: z.string().min(1, "Payment Method is required"),
        affiliatePaymentSchedule: z.string().min(1, "Payment Schedule is required"),
        affiliateNoticePeriod: z.string().min(1, "Notice Period is required"),
        affiliateArbitrationLocation: z.string().min(1, "Arbitration Location is required"),
        affiliateJurisdiction: z.string().min(1, "Governing Jurisdiction is required"),
        affiliateStartDate: z.string().min(1, "Start Date is required"),
      });
    case "revenue-sharing":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        revenueCompanyName: z.string().min(1, "Company Name is required"),
        revenueCompanyAddress: z.string().min(1, "Company Address is required"),
        investorNames: z.string().min(1, "Investor Name(s) are required"),
        investorAddress: z.string().min(1, "Investor Address is required"),
        investmentAmount: z.string().min(1, "Investment Amount is required"),
        investmentPaymentMethod: z.string().min(1, "Payment Method is required"),
        investmentPurpose: z.string().min(1, "Investment Purpose is required"),
        revenueSharePercentage: z.string().min(1, "Revenue Share Percentage is required"),
        repaymentTerm: z.string().min(1, "Repayment Amount or Term is required"),
        revenuePaymentSchedule: z.enum(["monthly", "quarterly", "annual"]),
        paymentStartDate: z.string().min(1, "Payment Start Date is required"),
        revenueCalculation: z.string().min(1, "Revenue Calculation details are required"),
        revenueAgreementTerm: z.string().min(1, "Agreement Term is required"),
        revenueTerminationPeriod: z.string().min(1, "Notice Period is required"),
        revenueArbitrationLocation: z.string().min(1, "Arbitration Location is required"),
        revenueGoverningJurisdiction: z.string().min(1, "Governing Jurisdiction is required"),
      });
    case "event-management":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        eventClientName: z.string().min(1, "Client Name is required"),
        eventClientAddress: z.string().min(1, "Client Address is required"), 
        eventManagerName: z.string().min(1, "Event Manager Name is required"),
        eventManagerAddress: z.string().min(1, "Event Manager Address is required"),
        eventName: z.string().min(1, "Event Name/Description is required"),
        eventDates: z.string().min(1, "Event Date(s) is required"),
        eventServices: z.object({
          planning: z.boolean().optional(),
          venue: z.boolean().optional(),
          vendorManagement: z.boolean().optional(),
          promotion: z.boolean().optional(),
          onSiteManagement: z.boolean().optional(),
          postEvent: z.boolean().optional(),
        }),
        eventAdditionalServices: z.string().optional(),
        startDate: z.string().min(1, "Start Date is required"),
        endDate: z.string().min(1, "End Date is required"),
        eventTotalFee: z.string().min(1, "Total Fee is required"),
        eventPaymentSchedule: z.object({
          signingPercentage: z.string().min(1, "Signing percentage is required"),
          planningPercentage: z.string().min(1, "Planning percentage is required"), 
          completionPercentage: z.string().min(1, "Completion percentage is required"),
        }),
        eventPaymentMethod: z.string().min(1, "Payment Method is required"),
        latePaymentRate: z.string().min(1, "Late Payment Rate is required"),
        cancellationNoticePeriod: z.string().min(1, "Cancellation Notice Period is required"),
        eventRefundPolicy: z.object({
          refundPercentage: z.string().min(1, "Refund percentage is required"),
          refundDate: z.string().min(1, "Refund date is required"),
          noRefundDate: z.string().min(1, "No refund date is required"),
        }),
        arbitrationLocation: z.string().min(1, "Arbitration Location is required"),
        terminationNoticePeriod: z.string().min(1, "Termination Notice Period is required"),
      });
    case "employment":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        companyName: z.string().min(1, "Company Name is required"),
        employerAddress: z.string().min(1, "Employer's Address is required"),
        employeeFullName: z.string().min(1, "Employee's Full Name is required"),
        employeeAddress: z.string().min(1, "Employee's Address is required"),
        jobTitle: z.string().min(1, "Job Title is required"),
        startDate: z.string().min(1, "Start Date is required"),
        baseSalary: z.string().min(1, "Base Salary is required"),
        salaryFrequency: z.enum(["monthly", "yearly"]),
        bonusDetails: z.string().optional(),
        benefits: z.string().min(1, "Benefits information is required"),
        workHoursPerWeek: z.string().min(1, "Work Hours Per Week is required"),
        workStartTime: z.string().min(1, "Work Start Time is required"),
        workEndTime: z.string().min(1, "Work End Time is required"),
        nonCompetePeriod: z.string().min(1, "Non-Compete Period is required"),
        nonSolicitationPeriod: z.string().min(1, "Non-Solicitation Period is required"),
        employerNoticePeriod: z.string().min(1, "Employer Notice Period is required"),
        employeeNoticePeriod: z.string().min(1, "Employee Notice Period is required"),
        governingLocation: z.string().min(1, "Governing City/State is required"),
      });
    case "service":
      return z.object({
        serviceCompanyName: z.string().min(1, "Company Name is required"),
        companyType: z.enum(["company", "individual"]),
        companyAddress: z.string().min(1, "Company Address is required"),
        companyTitle: z.string().min(1, "Company Title is required"),
        clientName: z.string().min(1, "Client Name is required"),
        clientAddress: z.string().min(1, "Client Address is required"),
        clientTitle: z.string().min(1, "Client Title is required"),
        serviceDescription: z.string().min(1, "Service Description is required"),
        serviceStartDate: z.string().min(1, "Start Date is required"),
        serviceEndDate: z.string().min(1, "End Date is required"),
        serviceFee: z.string().min(1, "Service Fee is required"),
        paymentSchedule: z.enum(["installments", "lumpsum"]),
        expenseReimbursement: z.enum(["yes", "no"]),
        paymentMode: z.string().min(1, "Payment Mode is required"),
        terminationNoticePeriod: z.string().min(1, "Termination Notice Period is required"),
        nonPaymentNoticePeriod: z.string().min(1, "Non-Payment Notice Period is required"),
        arbitrationCity: z.string().min(1, "Arbitration City is required"),
      });
    case "freelancer":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        clientName: z.string().min(1, "Client Name is required"),
        clientType: z.enum(["company", "individual"]),
        clientAddress: z.string().min(1, "Client Address is required"),
        freelancerName: z.string().min(1, "Freelancer Name is required"),
        freelancerAddress: z.string().min(1, "Freelancer Address is required"),
        serviceDescription: z.string().min(1, "Service Description is required"),
        startDate: z.string().min(1, "Start Date is required"),
        endDate: z.string().min(1, "End Date is required"),
        compensationAmount: z.string().min(1, "Compensation Amount is required"),
        paymentTerms: z.string().min(1, "Payment Terms are required"),
        expenseReimbursement: z.enum(["yes", "no"]),
        deliverables: z.string().min(1, "Deliverables are required"),
        deliverableTimeline: z.string().min(1, "Deliverable Timeline is required"),
        terminationNoticePeriod: z.string().min(1, "Termination Notice Period is required"),
        nonPaymentNoticePeriod: z.string().min(1, "Non-Payment Notice Period is required"),
        arbitrationCity: z.string().min(1, "Arbitration City is required"),
      });
    case "consulting":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        consultantName: z.string().min(1, "Consultant Name is required"),
        consultantType: z.enum(["individual", "entity"]),
        consultantAddress: z.string().min(1, "Consultant Address is required"),
        clientName: z.string().min(1, "Client Name is required"),
        clientAddress: z.string().min(1, "Client Address is required"),
        consultingServices: z.string().min(1, "Consulting Services description is required"),
        additionalServices: z.string().optional(),
        startDate: z.string().min(1, "Start Date is required"),
        endDate: z.string().min(1, "End Date is required"),
        consultingFee: z.string().min(1, "Consulting Fee is required"),
        paymentTerms: z.enum(["installments", "lumpsum"]),
        expenseReimbursement: z.enum(["yes", "no"]),
        paymentMethod: z.string().min(1, "Payment Method is required"),
        terminationNoticePeriod: z.string().min(1, "Termination Notice Period is required"),
        nonPaymentNoticePeriod: z.string().min(1, "Non-Payment Notice Period is required"),
        arbitrationCity: z.string().min(1, "Arbitration City is required"),
      });
    case "distribution":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        principalName: z.string().min(1, "Principal/Company Name is required"),
        principalAddress: z.string().min(1, "Principal/Company Address is required"),
        distributorName: z.string().min(1, "Distributor Name is required"),
        distributorAddress: z.string().min(1, "Distributor Address is required"),
        distributionAppointmentType: z.enum(["exclusive", "non-exclusive"]),
        distributionTerritory: z.string().min(1, "Territory is required"),
        productsDescription: z.string().min(1, "Products Description is required"),
        productChangeNotice: z.string().min(1, "Product Change Notice Period is required"),
        pricingDetails: z.string().min(1, "Pricing Details are required"),
        priceRevisionNotice: z.string().min(1, "Price Revision Notice Period is required"),
        distributionPaymentTerms: z.string().min(1, "Payment Terms are required"),
        distributionLatePaymentRate: z.string().min(1, "Late Payment Interest Rate is required"),
        paymentCurrency: z.string().min(1, "Payment Currency is required"),
        agreementStartDate: z.string().min(1, "Agreement Start Date is required"),
        distributionDuration: z.string().min(1, "Agreement Duration is required"),
        distributionTerminationNotice: z.string().min(1, "Termination Notice Period is required"),
        distributionBreachNotice: z.string().min(1, "Breach Notice Period is required"),
        distributionArbitrationLocation: z.string().min(1, "Arbitration Location is required"),
        governingJurisdiction: z.string().min(1, "Governing Jurisdiction is required"),
      });

    case "commission":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        companyName: z.string().min(1, "Company Name is required"),
        companyAddress: z.string().min(1, "Company Address is required"),
        agentName: z.string().min(1, "Agent Name is required"),
        agentAddress: z.string().min(1, "Agent Address is required"),
        productsCovered: z.string().min(1, "Products/Services are required"),
        territory: z.string().min(1, "Territory/Market is required"),
        appointmentType: z.enum(["exclusive", "non-exclusive"]),
        commissionRate: z.string().min(1, "Commission Rate is required"),
        commissionBasis: z.string().min(1, "Commission Calculation Basis is required"),
        tieredStructure: z.string(),
        paymentDay: z.string().min(1, "Payment Day is required"),
        paymentMethod: z.string().min(1, "Payment Method is required"),
        confidentialityTerms: z.string(),
        startDate: z.string().min(1, "Start Date is required"),
        endDate: z.string().min(1, "End Date is required"),
        noticePeriod: z.string().min(1, "Notice Period is required"),
        arbitrationLocation: z.string().min(1, "Arbitration Location is required"),
        jurisdiction: z.string().min(1, "Jurisdiction is required"),
      });
    case "sales":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        sellerName: z.string().min(1, "Seller Name is required"),
        sellerAddress: z.string().min(1, "Seller Address is required"),
        buyerName: z.string().min(1, "Buyer Name is required"),
        buyerAddress: z.string().min(1, "Buyer Address is required"),
        salesGoodsDescription: z.string().min(1, "Description of Goods is required"),
        deliveryLocation: z.string().min(1, "Delivery Location is required"),
        deliveryTimeframe: z.string().min(1, "Delivery Timeframe is required"),
        purchasePrice: z.string().min(1, "Purchase Price is required"),
        salesPaymentSchedule: z.string().min(1, "Payment Schedule is required"),
        salesPaymentMethod: z.string().min(1, "Payment Method is required"),
        inspectionPeriod: z.string().min(1, "Inspection Period is required"),
        riskOfLoss: z.string().min(1, "Risk of Loss details are required"),
        salesArbitrationCity: z.string().min(1, "Arbitration City is required"),
      });
    case "vendor":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        vendorName: z.string().min(1, "Vendor Name is required"),
        vendorType: z.enum(["company", "individual"]),
        vendorAddress: z.string().min(1, "Vendor Address is required"),
        vendorTitle: z.string().min(1, "Vendor Title is required"),
        companyName: z.string().min(1, "Company Name is required"),
        companyAddress: z.string().min(1, "Company Address is required"),
        companyTitle: z.string().min(1, "Company Title is required"),
        goodsDescription: z.string().min(1, "Description of Goods/Services is required"),
        startDate: z.string().min(1, "Start Date is required"),
        endDate: z.string().min(1, "End Date is required"),
        pricePerUnit: z.string().min(1, "Price per Unit/Service is required"),
        paymentTerms: z.string().min(1, "Payment Terms are required"),
        paymentMode: z.string().min(1, "Mode of Payment is required"),
        deliveryAddress: z.string().min(1, "Delivery Address is required"),
        terminationNoticePeriod: z.string().min(1, "Termination Notice Period is required"),
        nonPaymentNoticePeriod: z.string().min(1, "Non-Payment Notice Period is required"),
        arbitrationCity: z.string().min(1, "Arbitration City is required"),
      });
    case "software-development":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        softwareClientName: z.string().min(1, "Client Name is required"),
        softwareClientAddress: z.string().min(1, "Client Address is required"),
        developerName: z.string().min(1, "Developer Name is required"),
        developerAddress: z.string().min(1, "Developer Address is required"),
        projectRequirements: z.string().min(1, "Project Requirements are required"),
        projectTimeline: z.string().min(1, "Project Timeline is required"), 
        projectCost: z.string().min(1, "Project Cost is required"),
        upfrontPayment: z.string().min(1, "Upfront Payment percentage is required"),
        milestonePayment: z.string().min(1, "Milestone Payment percentage is required"),
        milestoneName: z.string().min(1, "Milestone Name is required"),
        finalPayment: z.string().min(1, "Final Payment percentage is required"),
        softwarePaymentMethod: z.string().min(1, "Payment Method is required"),
        invoiceDeadline: z.string().min(1, "Invoice Payment Deadline is required"),
        warrantyPeriod: z.string().min(1, "Warranty Period is required"),
        generalTerminationPeriod: z.string().min(1, "General Termination Period is required"),
        breachNoticePeriod: z.string().min(1, "Breach Notice Period is required"),
        nonPaymentNoticePeriod: z.string().min(1, "Non-Payment Notice Period is required"),
        softwareArbitrationVenue: z.string().min(1, "Arbitration Venue is required"),
        noticeMethod: z.string().min(1, "Notice Method is required"),
      });

    case "software-licensing":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        licensorName: z.string().min(1, "Licensor Name is required"),
        licensorAddress: z.string().min(1, "Licensor Address is required"),
        licenseeName: z.string().min(1, "Licensee Name is required"),
        licenseeAddress: z.string().min(1, "Licensee Address is required"),
        licenseType: z.enum(["exclusive", "non-exclusive"]),
        softwareName: z.string().min(1, "Software Name is required"),
        softwareUse: z.string().min(1, "Purpose of Software Use is required"),
        licenseFee: z.string().min(1, "License Fee is required"),
        initialPayment: z.string().min(1, "Initial Payment is required"),
        subsequentPayments: z.string().optional(),
        deliveryTimeline: z.string().min(1, "Delivery Timeline is required"),
        installationAssistance: z.enum(["yes", "no"]),
        standardSupport: z.string().min(1, "Standard Support details are required"),
        supportDuration: z.string().min(1, "Support Duration is required"),
        additionalSupportCharges: z.string().optional(),
        softwareWarrantyPeriod: z.string().min(1, "Warranty Period is required"),
        agreementDuration: z.string().min(1, "Agreement Duration is required"),
        licenseTerminationPeriod: z.string().min(1, "Termination Notice Period is required"),
        licenseArbitrationCity: z.string().min(1, "Arbitration City is required"),
      });

    case "marketing":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date of Agreement is required"),
        marketingClientName: z.string().min(1, "Client Name is required"),
        marketingClientAddress: z.string().min(1, "Client Address is required"),
        agencyName: z.string().min(1, "Agency Name is required"),
        agencyAddress: z.string().min(1, "Agency Address is required"),
        marketingServices: z.string().min(1, "Scope of Services is required"),
        additionalMarketingServices: z.string().optional(),
        marketingStartDate: z.string().min(1, "Start Date is required"),
        marketingEndDate: z.string().min(1, "End Date is required"),
        marketingTotalFee: z.string().min(1, "Total Fee is required"),
        marketingPaymentSchedule: z.string().min(1, "Payment Schedule is required"),
        additionalCosts: z.string().optional(),
        applicableTaxes: z.string().min(1, "Applicable Taxes is required"),
        marketingDeliverables: z.string().min(1, "Deliverables are required"),
        agencyResponsibilities: z.string().min(1, "Agency Responsibilities are required"),
        clientResponsibilities: z.string().min(1, "Client Responsibilities are required"),
        ipOwnership: z.string().min(1, "IP Ownership is required"),
        agencyUsageRights: z.string().min(1, "Agency Usage Rights is required"),
        performanceMetrics: z.string().min(1, "Performance Metrics are required"),
        terminationPeriod: z.string().min(1, "Termination Notice Period is required"),
        nonPaymentPeriod: z.string().min(1, "Non-Payment Notice Period is required"),
        immediateTermination: z.string().min(1, "Immediate Termination terms are required"),
        marketingArbitrationVenue: z.string().min(1, "Arbitration Venue is required"),
        clientNameTitle: z.string().min(1, "Client Name and Title are required"),
        agencyNameTitle: z.string().min(1, "Agency Name and Title are required"),
      });

    case "dpa":
      return z.object({
        controllerName: z.string().min(1, "Controller Name is required"),
        controllerAddress: z.string().min(1, "Controller Address is required"),
        controllerContact: z.string().min(1, "Controller Contact is required"),
        controllerEmail: z.string().email("Invalid email format"),
        controllerPhone: z.string().min(1, "Controller Phone is required"),
        processorName: z.string().min(1, "Processor Name is required"),
        processorAddress: z.string().min(1, "Processor Address is required"),
        processorContact: z.string().min(1, "Processor Contact is required"),
        processorEmail: z.string().email("Invalid email format"),
        processorPhone: z.string().min(1, "Processor Phone is required"),
        processingPurpose: z.string().min(1, "Processing Purpose is required"),
        processingNature: z.string().min(1, "Nature of Processing is required"),
        processingDuration: z.string().min(1, "Duration of Processing is required"),
        personalData: z.string().min(1, "Personal Data Categories are required"),
        sensitiveData: z.string().min(1, "Sensitive Data Categories are required"),
        otherData: z.string().optional(),
        dataSubjects: z.string().min(1, "Data Subjects Categories are required"),
        processingInstructions: z.string().min(1, "Processing Instructions are required"),
        encryptionStandards: z.string().min(1, "Encryption Standards are required"),
        accessControl: z.string().min(1, "Access Control measures are required"),
        dataBackup: z.string().min(1, "Data Backup details are required"),
        additionalMeasures: z.string().optional(),
        retentionPeriod: z.string().min(1, "Retention Period is required"),
        subProcessorApproval: z.enum(["yes", "no"]),
        subProcessorDetails: z.string().optional(),
        breachNotificationPeriod: z.string().min(1, "Breach Notification Period is required"),
        reportingFormat: z.string().min(1, "Reporting Format is required"),
      });
    default:
      return z.object({});
  }
};

export default function DocumentCreator() {
  const { type } = useParams<{ type: string }>();
  const { toast } = useToast();

  const formSchema = getFormSchema(type || "");

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...(type === "affiliate" && {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        affiliateCompanyName: "",
        affiliateCompanyAddress: "",
        affiliateName: "",
        affiliateAddress: "",
        referralFeeStructure: "",
        affiliatePaymentMethod: "",
        affiliatePaymentSchedule: "",
        affiliateNoticePeriod: "30",
        affiliateArbitrationLocation: "",
        affiliateJurisdiction: "",
        affiliateStartDate: "",
      }),
      ...(type === "revenue-sharing" && {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        revenueCompanyName: "",
        revenueCompanyAddress: "",
        investorNames: "",
        investorAddress: "",
        investmentAmount: "",
        investmentPaymentMethod: "",
        investmentPurpose: "",
        revenueSharePercentage: "",
        repaymentTerm: "",
        revenuePaymentSchedule: "monthly",
        paymentStartDate: "",
        revenueCalculation: "",
        revenueAgreementTerm: "",
        revenueTerminationPeriod: "30",
        revenueArbitrationLocation: "",
        revenueGoverningJurisdiction: "",
      }),
      ...(type === "distribution" && {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        principalName: "",
        principalAddress: "",
        distributorName: "",
        distributorAddress: "",
        distributionAppointmentType: "non-exclusive",
        distributionTerritory: "",
        productsDescription: "",
        productChangeNotice: "30",
        pricingDetails: "",
        priceRevisionNotice: "30",
        distributionPaymentTerms: "",
        distributionLatePaymentRate: "",
        paymentCurrency: "INR",
        agreementStartDate: "",
        distributionDuration: "",
        distributionTerminationNotice: "30",
        distributionBreachNotice: "15",
        distributionArbitrationLocation: "",
        governingJurisdiction: "",
      }),
      ...(type === "event-management" && {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        eventClientName: "",
        eventClientAddress: "",
        eventManagerName: "",
        eventManagerAddress: "",
        eventName: "",
        eventDates: "",
        eventServices: {
          planning: false,
          venue: false,
          vendorManagement: false,
          promotion: false,
          onSiteManagement: false,
          postEvent: false,
        },
        eventAdditionalServices: "",
        startDate: "",
        endDate: "",
        eventTotalFee: "",
        eventPaymentSchedule: {
          signingPercentage: "",
          planningPercentage: "",
          completionPercentage: "",
        },
        eventPaymentMethod: "",
        latePaymentRate: "",
        cancellationNoticePeriod: "30",
        eventRefundPolicy: {
          refundPercentage: "",
          refundDate: "",
          noRefundDate: "",
        },
        arbitrationLocation: "",
        terminationNoticePeriod: "30",
      }),
      ...(type === "employment" && {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        companyName: "",
        employerAddress: "",
        employeeFullName: "",
        employeeAddress: "",
        jobTitle: "",
        startDate: "",
        baseSalary: "",
        salaryFrequency: "monthly",
        bonusDetails: "",
        benefits: "",
        workHoursPerWeek: "40",
        workStartTime: "09:00",
        workEndTime: "18:00",
        nonCompetePeriod: "12",
        nonSolicitationPeriod: "12",
        employerNoticePeriod: "30",
        employeeNoticePeriod: "30",
        governingLocation: "",
      }),
      ...(type === "service" && {
        serviceCompanyName: "",
        companyType: "company",
        companyAddress: "",
        companyTitle: "",
        clientName: "",
        clientAddress: "",
        clientTitle: "",
        serviceDescription: "",
        serviceStartDate: format(new Date(), "yyyy-MM-dd"),
        serviceEndDate: "",
        serviceFee: "",
        paymentSchedule: "installments",
        expenseReimbursement: "yes",
        paymentMode: "",
        terminationNoticePeriod: "30",
        nonPaymentNoticePeriod: "15",
        arbitrationCity: "",
      }),
      ...(type === "freelancer" && {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        clientName: "",
        clientType: "company",
        clientAddress: "",
        freelancerName: "",
        freelancerAddress: "",
        serviceDescription: "",
        startDate: "",
        endDate: "",
        compensationAmount: "",
        paymentTerms: "30",
        expenseReimbursement: "no",
        deliverables: "",
        deliverableTimeline: "",
        terminationNoticePeriod: "30",
        nonPaymentNoticePeriod: "15",
        arbitrationCity: "",
      }),
      ...(type === "consulting" && {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        consultantName: "",
        consultantType: "individual",
        consultantAddress: "",
        clientName: "",
        clientAddress: "",
        consultingServices: "",
        additionalServices: "",
        startDate: "",
        endDate: "",
        consultingFee: "",
        paymentTerms: "installments",
        expenseReimbursement: "no",
        paymentMethod: "",
        terminationNoticePeriod: "30",
        nonPaymentNoticePeriod: "15",
        arbitrationCity: "",
      }),
      ...(type === "commission" && {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        companyName: "",
        companyAddress: "",
        agentName: "",
        agentAddress: "",
        productsCovered: "",
        territory: "",
        appointmentType: "non-exclusive",
        commissionRate: "",
        commissionBasis: "",
        tieredStructure: "N/A",
        paymentDay: "",
        paymentMethod: "",
        confidentialityTerms: "",
        startDate: "",
        endDate: "",
        noticePeriod: "30",
        arbitrationLocation: "",
        jurisdiction: "",
      }),
      ...(type === "sales" && {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        sellerName: "",
        sellerAddress: "",
        buyerName: "",
        buyerAddress: "",
        salesGoodsDescription: "",
        deliveryLocation: "",
        deliveryTimeframe: "30",
        purchasePrice: "",
        salesPaymentSchedule: "",
        salesPaymentMethod: "",
        inspectionPeriod: "7",
        riskOfLoss: "",
        salesArbitrationCity: "",
      }),
      ...(type === "vendor" && {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        vendorName: "",
        vendorType: "company",
        vendorAddress: "",
        vendorTitle: "",
        companyName: "",
        companyAddress: "",
        companyTitle: "",
        goodsDescription: "",
        startDate: "",
        endDate: "",
        pricePerUnit: "",
        paymentTerms: "30",
        paymentMode: "",
        deliveryAddress: "",
        terminationNoticePeriod: "30",
        nonPaymentNoticePeriod: "15",
        arbitrationCity: "",
      }),
      ...(type === "software-development" && {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        softwareClientName: "",
        softwareClientAddress: "",
        developerName: "",
        developerAddress: "",
        projectRequirements: "",
        projectTimeline: "",
        projectCost: "",
        upfrontPayment: "30",
        milestonePayment: "40",
        milestoneName: "Beta Release",
        finalPayment: "30",
        softwarePaymentMethod: "",
        invoiceDeadline: "30",
        warrantyPeriod: "90",
        generalTerminationPeriod: "30",
        breachNoticePeriod: "15",
        nonPaymentNoticePeriod: "15",
        softwareArbitrationVenue: "",
        noticeMethod: "",
      }),
      ...(type === "software-licensing" && {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        licensorName: "",
        licensorAddress: "",
        licenseeName: "",
        licenseeAddress: "",
        licenseType: "non-exclusive",
        softwareName: "",
        softwareUse: "",
        licenseFee: "",
        initialPayment: "",
        subsequentPayments: "",
        deliveryTimeline: "30",
        installationAssistance: "yes",
        standardSupport: "",
        supportDuration: "365",
        additionalSupportCharges: "",
        softwareWarrantyPeriod: "90",
        agreementDuration: "365",
        licenseTerminationPeriod: "30",
        licenseArbitrationCity: "",
      }),
      ...(type === "dpa" && {
        controllerName: "",
        controllerAddress: "",
        controllerContact: "",
        controllerEmail: "",
        controllerPhone: "",
        processorName: "",
        processorAddress: "",
        processorContact: "",
        processorEmail: "",
        processorPhone: "",
        processingPurpose: "",
        processingNature: "",
        processingDuration: "",
        personalData: "",
        sensitiveData: "",
        otherData: "",
        dataSubjects: "",
        processingInstructions: "",
        encryptionStandards: "",
        accessControl: "",
        dataBackup: "",
        additionalMeasures: "",
        retentionPeriod: "",
        subProcessorApproval: "no",
        subProcessorDetails: "",
        breachNotificationPeriod: "",
        reportingFormat: "",
      }),
      ...(type === "marketing" && {
        dateOfAgreement: format(new Date(), "yyyy-MM-dd"),
        marketingClientName: "",
        marketingClientAddress: "",
        agencyName: "",
        agencyAddress: "",
        marketingServices: "",
        additionalMarketingServices: "",
        marketingStartDate: "",
        marketingEndDate: "",
        marketingTotalFee: "",
        marketingPaymentSchedule: "",
        additionalCosts: "",
        applicableTaxes: "",
        marketingDeliverables: "",
        agencyResponsibilities: "",
        clientResponsibilities: "",
        ipOwnership: "",
        agencyUsageRights: "",
        performanceMetrics: "",
        terminationPeriod: "30",
        nonPaymentPeriod: "15",
        immediateTermination: "",
        marketingArbitrationVenue: "",
        clientNameTitle: "",
        agencyNameTitle: "",
      }),
    },
  });

  const onSubmit = async (values: FormFields) => {
    try {
      // Here we'll add the API call to generate the document using AI
      toast({
        title: "Success",
        description: "Document created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive",
      });
    }
  };

  const getFormTitle = () => {
    switch (type) {
      case "affiliate":
        return "Affiliate/Referral Agreement";
      case "revenue-sharing":
        return "Revenue Sharing Agreement";
      case "distribution":
        return "Distribution Agreement";
      case "sales":
        return "Sales Agreement";
      case "event-management":
        return "Event Management Agreement";
      case "employment":
        return "Employee Agreement";
      case "service":
        return "Service Agreement";
      case "freelancer":
        return "Freelancer Agreement";
      case "consulting":
        return "Consulting Agreement";
      case "commission":
        return "Commission Agreement";
      case "vendor":
        return "Vendor Agreement";
      case "software-development":
        return "Software Development Agreement";  
      case "software-licensing":
        return "Software License Agreement";
      case "dpa":
        return "Data Processing Agreement";
      case "marketing":
        return "Marketing/Advertising Agreement";
      default:
        return "Document";
    }
  };

  const renderFormFields = () => {
    switch (type) {
      case "event-management":
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
                  name="eventClientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter client's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventManagerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Manager Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event manager/company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="eventClientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter client's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventManagerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Manager Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter event manager's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name/Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event name or description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventDates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Date(s)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event date(s)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Services</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="eventServices.planning"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">Planning and coordination</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventServices.venue"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">Venue selection and booking</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventServices.vendorManagement"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">Vendor management</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventServices.promotion"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">Event promotion and marketing</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventServices.onSiteManagement"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">On-site event management</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventServices.postEvent"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">Post-event services</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="eventAdditionalServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Services</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter any additional services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Agreement Term</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
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
                  name="endDate"
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

              <h3 className="text-lg font-semibold mt-6">Payment Details</h3>
              <FormField
                control={form.control}
                name="eventTotalFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Fee (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter total fee amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="eventPaymentSchedule.signingPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signing Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventPaymentSchedule.planningPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Planning Phase Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventPaymentSchedule.completionPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Completion Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="eventPaymentMethod"
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
                  name="latePaymentRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Late Payment Interest Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter rate per month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Cancellation & Refund Policy</h3>
              <FormField
                control={form.control}
                name="cancellationNoticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cancellation Notice Period (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="eventRefundPolicy.refundPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refund Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventRefundPolicy.refundDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refund Before Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventRefundPolicy.noRefundDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No Refund After Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Other Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="arbitrationLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arbitration Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city for arbitration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="terminationNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Notice Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agent Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter agent's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="companyAddress"
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
                name="agentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter agent's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Products and Territory</h3>
              <FormField
                control={form.control}
                name="productsCovered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Products/Services Covered</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter specific products or services the Agent will represent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="territory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Territory/Market</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter specified territory or market for sales activities" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent's Appointment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select appointment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="exclusive">Exclusive</SelectItem>
                        <SelectItem value="non-exclusive">Non-Exclusive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Commission Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="commissionRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commission Rate</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter percentage or fixed amount per sale" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commissionBasis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commission Calculation Basis</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Gross/Net sales value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tieredStructure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiered Commission Structure</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specify structure if applicable or write N/A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="paymentDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Day</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter specific day of each month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bank transfer, cheque" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="confidentialityTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidentiality Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter any special provisions or leave as provided in the draft" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Agreement Duration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
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
                  name="endDate"
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

              <FormField
                control={form.control}
                name="noticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Period for Termination (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                        <Input placeholder="Enter city/location for arbitration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jurisdiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jurisdiction</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city/region with legal jurisdiction" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );

      case "affiliate":
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
                  name="affiliateStartDate"
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="affiliateCompanyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="affiliateName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Affiliate/Referrer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter affiliate's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="affiliateCompanyAddress"
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
                name="affiliateAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affiliate/Referrer Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter affiliate's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Commission Structure</h3>
              <FormField
                control={form.control}
                name="referralFeeStructure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referral Fee/Commission Structure</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter percentage or fixed amount, along with gross or net sales value exclusion details"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="affiliatePaymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bank Transfer, Cheque" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="affiliatePaymentSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Schedule</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter specific day of the month for payments" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Legal Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="affiliateNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notice Period for Termination (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="affiliateArbitrationLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arbitration Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city for arbitration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="affiliateJurisdiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Governing Jurisdiction</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter jurisdiction for legal matters" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
      case "revenue-sharing":
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
                  name="revenueCompanyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company's full name" {...field} />
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
                      <FormLabel>Investor Name(s)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name(s) of investor(s)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="revenueCompanyAddress"
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
                name="investorAddress"
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

              <h3 className="text-lg font-semibold mt-6">Investment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="investmentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Amount (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter investment amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investmentPaymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bank Transfer, Cheque" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="investmentPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Purpose</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., expanding business operations" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Revenue Sharing Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="revenueSharePercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Revenue Share Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="revenuePaymentSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Schedule</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="repaymentTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repayment Amount or Term</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter total repayment amount or duration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="revenueCalculation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revenue Calculation</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Gross Revenue minus taxes and operating costs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Term and Termination</h3>
              <FormField
                control={form.control}
                name="revenueAgreementTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agreement Term</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., until repayment amount is met" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="revenueTerminationPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Period for Termination (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Dispute Resolution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="revenueArbitrationLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arbitration Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location for arbitration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="revenueGoverningJurisdiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Governing Jurisdiction</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter jurisdiction for governing laws" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
      case "distribution":
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
                  name="principalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Principal/Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter principal's full name or company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="distributorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distributor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter distributor's full name or company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="principalAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal/Company Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter principal's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="distributorAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distributor Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter distributor's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Appointment and Territory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="distributionAppointmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select appointment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="exclusive">Exclusive</SelectItem>
                          <SelectItem value="non-exclusive">Non-Exclusive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="distributionTerritory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Territory</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter territory where distribution rights apply" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Products and Pricing</h3>
              <FormField
                control={form.control}
                name="productsDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Products Description (Schedule A)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter description of Products, including quantity, quality, etc."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="productChangeNotice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Change Notice (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceRevisionNotice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Revision Notice (Days)</FormLabel>
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
                name="pricingDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing Details (Schedule B)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Product pricing details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Payment Terms</h3>
              <FormField
                control={form.control}
                name="distributionPaymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms (Schedule C)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter payment terms, including installments, timeline, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="distributionLatePaymentRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Late Payment Interest Rate (%/month)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Currency</FormLabel>
                      <FormControl>
                        <Input placeholder="Specify currency" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Agreement Duration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="agreementStartDate"
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
                  name="distributionDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter duration in months/years" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="distributionTerminationNotice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Notice Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="distributionBreachNotice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Breach Notice Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Legal Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="distributionArbitrationLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arbitration Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location for arbitration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="governingJurisdiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Governing Jurisdiction</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter jurisdiction for governing laws" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
        
      case "sales":
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
                  name="sellerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seller Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter seller's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buyerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buyer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter buyer's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sellerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seller Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter seller's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buyerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buyer Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter buyer's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Goods and Delivery</h3>
              <FormField
                control={form.control}
                name="salesGoodsDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description of Goods</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter detailed description, including quantity, quality, and specifications"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Location</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter address where goods should be delivered" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryTimeframe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Date/Time Frame</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter specific delivery date or timeframe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Payment Details</h3>
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter purchase price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salesPaymentSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Schedule</FormLabel>
                    <FormControl>
                      <Input placeholder="Specify installments or lump sum, with dates" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salesPaymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bank Transfer, UPI, Cheque" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Terms and Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="inspectionPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inspection Period (Days)</FormLabel>
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
                name="riskOfLoss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk of Loss</FormLabel>
                    <FormControl>
                      <Input placeholder="Specify whether risk transfers upon delivery or at another point" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salesArbitrationCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitration City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city where arbitration will take place" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case "marketing":
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
                  name="marketingClientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter client's full name or company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agencyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agency's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter agency's full name or company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter client's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agencyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter agency's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Scope of Services</h3>
              <FormField
                control={form.control}
                name="marketingServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marketing/Advertising Activities</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., social media marketing, print advertising, SEO services"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalMarketingServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Services (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List any additional services to be included" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Term and Fee</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
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
                  name="endDate"
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

              <FormField
                control={form.control}
                name="totalFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Fee (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter total fee amount" {...field} />
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
                      <Input placeholder="e.g., upfront, milestone-based, monthly" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalCosts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Costs (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specify any third-party expenses to be pre-approved" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicableTaxes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Applicable Taxes</FormLabel>
                    <FormControl>
                      <Input placeholder="Specify taxes borne by client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Deliverables and Responsibilities</h3>
              <FormField
                control={form.control}
                name="deliverables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deliverables</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List deliverables with deadlines" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agencyResponsibilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Responsibilities</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List professional services, meeting objectives, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientResponsibilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Responsibilities</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List materials, information, and approvals to be provided" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Intellectual Property and Performance</h3>
              <FormField
                control={form.control}
                name="ipOwnership"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Ownership</FormLabel>
                    <FormControl>
                      <Input placeholder="Specify ownership of materials upon full payment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agencyUsageRights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Usage Rights</FormLabel>
                    <FormControl>
                      <Input placeholder="Specify portfolio use for non-commercial purposes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="performanceMetrics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Performance Metrics</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., ROI, engagement rates, lead generation metrics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Termination Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="terminationPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notice Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nonPaymentPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Non-Payment Notice Period (Days)</FormLabel>
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
                name="immediateTermination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Immediate Termination Terms</FormLabel>
                    <FormControl>
                      <Input placeholder="Specify terms for unsatisfactory performance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marketingArbitrationVenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitration Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city for arbitration in India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Signatures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientNameTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client's Name and Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter client's name and title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agencyNameTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agency's Name and Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter agency's name and title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
      case "software-licensing":
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
                  name="licensorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Licensor's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter licensor's full name or company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Licensee's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter licensee's full name or company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="licensorAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licensor's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter licensor's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="licenseeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licensee's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter licensee's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">License Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="licenseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select license type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="exclusive">Exclusive</SelectItem>
                          <SelectItem value="non-exclusive">Non-Exclusive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="softwareName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Software Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name of the software" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="softwareUse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose of Software Use</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter specific purpose or industry for permitted use" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="licenseFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Fee (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter license fee amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="initialPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Payment (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter initial payment amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subsequentPayments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subsequent Payment Schedule (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specify payment schedule details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Delivery and Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deliveryTimeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Timeline (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="installationAssistance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Installation Assistance</FormLabel>
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
                name="standardSupport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standard Support</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter support details (e.g., email, phone, online)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supportDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Duration (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalSupportCharges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Support Charges (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter additional support fees" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Terms and Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="softwareWarrantyPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agreementDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agreement Duration (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="licenseTerminationPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Notice Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseArbitrationCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arbitration City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city name for arbitration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
      case "software-development":
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
                  name="softwareClientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter client's full name/company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="developerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Developer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter developer's full name/company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="softwareClientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter client's principal place of business address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="developerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Developer Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter developer's principal place of business address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Project Scope</h3>
              <FormField
                control={form.control}
                name="projectRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Requirements and Functionalities</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter detailed description of the project requirements and functionalities"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectTimeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeline for Completion</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter specific timeline for various project phases"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Payment Details</h3>
              <FormField
                control={form.control}
                name="projectCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Project Cost (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter total project cost" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="upfrontPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upfront Payment (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="milestonePayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Milestone Payment (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="finalPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Final Payment (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="milestoneName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestone Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter milestone name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="softwarePaymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., bank transfer, PayPal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoiceDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Payment Deadline (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Legal Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="warrantyPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalTerminationPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>General Termination Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="breachNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Breach Notice Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nonPaymentNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Non-Payment Notice Period (Days)</FormLabel>
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
                name="softwareArbitrationVenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitration Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city and state for arbitration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="noticeMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method of Notices</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Email, Registered Post" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );

      case "event-management":
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
                  name="eventClientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter client's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventManagerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Manager Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event manager/company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="eventClientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter client's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventManagerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Manager Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter event manager's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name/Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event name or description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventDates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Date(s)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event date(s)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Services</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="eventServices.planning"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">Planning and coordination</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventServices.venue"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">Venue selection and booking</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventServices.vendorManagement"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">Vendor management</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventServices.promotion"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">Event promotion and marketing</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventServices.onSiteManagement"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">On-site event management</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventServices.postEvent"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">Post-event services</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="eventAdditionalServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Services</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter any additional services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Agreement Term</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
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
                  name="endDate"
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

              <h3 className="text-lg font-semibold mt-6">Payment Details</h3>
              <FormField
                control={form.control}
                name="eventTotalFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Fee (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter total fee amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="eventPaymentSchedule.signingPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signing Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventPaymentSchedule.planningPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Planning Phase Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventPaymentSchedule.completionPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Completion Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="eventPaymentMethod"
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
                  name="latePaymentRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Late Payment Interest Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter rate per month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Cancellation & Refund Policy</h3>
              <FormField
                control={form.control}
                name="cancellationNoticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cancellation Notice Period (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="eventRefundPolicy.refundPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refund Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventRefundPolicy.refundDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refund Before Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventRefundPolicy.noRefundDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No Refund After Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Other Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="arbitrationLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arbitration Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city for arbitration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="terminationNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Notice Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
                  name="companyName"
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
              </div>

              <FormField
                control={form.control}
                name="employerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter employer's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employeeFullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee's Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employee's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="employeeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter employee's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date of Employment</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="baseSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Salary (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter base salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="salaryFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bonusDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bonus Details (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bonus details" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefits</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List benefits (e.g., health insurance, provident fund, gratuity)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="workHoursPerWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Hours Per Week</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workStartTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workEndTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nonCompetePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Non-Compete Period (months)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nonSolicitationPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Non-Solicitation Period (months)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employerNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer Notice Period (days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employeeNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Notice Period (days)</FormLabel>
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
                name="governingLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Governing City/State</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter governing city/state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case "service":
        return (
          <>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="serviceCompanyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="companyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter company's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company's Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CEO, Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter client's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client's Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Owner, Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter client's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description of Services</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed description of services to be provided" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="serviceFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Fee (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter service fee" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment schedule" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="installments">Installments</SelectItem>
                          <SelectItem value="lumpsum">Lump Sum</SelectItem>
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
                  name="expenseReimbursement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pre-Approved Expense Reimbursement</FormLabel>
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
                  name="paymentMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode of Payment</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bank Transfer, UPI, Cheque" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="terminationNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Notice Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nonPaymentNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Non-Payment Notice Period (Days)</FormLabel>
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
                name="arbitrationCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitration City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter arbitration city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case "freelancer":
        return (
          <>
            <div className="grid gap-6">
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
                  name="clientType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter client's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="freelancerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Freelancer's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter freelancer's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="freelancerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Freelancer's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter freelancer's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description of Services</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed description of services to be provided" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
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
                  name="endDate"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="compensationAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compensation Amount (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter compensation amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Number of days after invoice receipt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expenseReimbursement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pre-Approved Expense Reimbursement</FormLabel>
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
                name="deliverables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deliverables</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List all deliverables" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliverableTimeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeline for Deliverables</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List deadlines for each deliverable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="terminationNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Notice Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nonPaymentNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Non-Payment Notice Period (Days)</FormLabel>
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
                name="arbitrationCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitration City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter arbitration city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case "consulting":
        return (
          <>
            <div className="grid gap-6">
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
                  name="consultantType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultant Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select consultant type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="entity">Entity</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="consultantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultant's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter consultant's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultantAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultant's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter consultant's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter client's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultingServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description of Consulting Services</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed description of consulting services to be provided" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Services (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description of any additional services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
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
                  name="endDate"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="consultingFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consulting Fee (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter consulting fee" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="installments">Installments</SelectItem>
                          <SelectItem value="lumpsum">Lump Sum</SelectItem>
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
                  name="expenseReimbursement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pre-Approved Expense Reimbursement</FormLabel>
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
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bank Transfer, UPI, Cheque" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="terminationNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Notice Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nonPaymentNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Non-Payment Notice Period (Days)</FormLabel>
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
                name="arbitrationCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitration City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter arbitration city" {...field} />
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
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agent Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter agent's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="companyAddress"
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
                name="agentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter agent's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productsCovered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Products/Services Covered</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List specific products or services the Agent will represent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="territory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Territory/Market</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter specified territory or market for sales activities" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent's Appointment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select appointment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="exclusive">Exclusive</SelectItem>
                        <SelectItem value="non-exclusive">Non-Exclusive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="commissionRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commission Rate</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter percentage or fixed amount per sale" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commissionBasis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commission Calculation Basis</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Gross/Net sales value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tieredStructure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiered Commission Structure</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specify structure if applicable or write N/A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="paymentDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Day</FormLabel>
                      <FormControl>
                        <Input placeholder="Specific day of each month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Bank transfer, cheque" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="confidentialityTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidentiality Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter any special provisions or leave as provided in the draft" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
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
                  name="endDate"
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

              <FormField
                control={form.control}
                name="noticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Period for Termination (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="arbitrationLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arbitration Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city/location for arbitration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jurisdiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jurisdiction (Governing Law)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city/region with legal jurisdiction" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
      case "vendor":
        return (
          <>
            <div className="grid gap-6">
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
                  name="vendorType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vendor type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="vendorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter vendor's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vendorAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter vendor's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vendorTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor's Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CEO, Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company's Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Director, Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="companyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter registered address of the company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goodsDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description of Goods/Services</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter details of goods/services to be supplied" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
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
                  name="endDate"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pricePerUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Unit/Service (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 30, 45" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="paymentMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode of Payment</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bank Transfer, UPI, Cheque" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter delivery address for goods/services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="terminationNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Notice Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nonPaymentNoticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Non-Payment Notice Period (Days)</FormLabel>
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
                name="arbitrationCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitration City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city for arbitration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case "dpa":
        return (
          <>
            <div className="grid gap-6">
              <h3 className="text-lg font-semibold">Controller Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="controllerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Controller Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter controller name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="controllerContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name and designation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="controllerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Controller Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter controller's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="controllerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="controllerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Processor Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="processorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Processor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter processor name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="processorContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name and designation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="processorAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processor Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter processor's complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="processorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="processorPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">Scope of Processing</h3>
              <FormField
                control={form.control}
                name="processingPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose of Processing</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Marketing Automation, Customer Support" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="processingNature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nature of Processing</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Storage, Analysis, Data Export" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="processingDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration of Processing</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 12 months or As per Service Agreement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Data Categories</h3>
              <FormField
                control={form.control}
                name="personalData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Name, Email Address, Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sensitiveData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sensitive Personal Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Health Data, Financial Data" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otherData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Data (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specify any additional data" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataSubjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories of Data Subjects</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Employees, Customers, End Users" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="processingInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions for Processing</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Data must be anonymized for reporting purposes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Security Measures</h3>
              <FormField
                control={form.control}
                name="encryptionStandards"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Encryption Standards</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AES 256-bit encryption" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accessControl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Control</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Role-based access control" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataBackup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Backup</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Weekly automated backups" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalMeasures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Measures (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specify any additional security measures" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="retentionPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retention Period</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 30 days after service termination" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Sub-Processors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subProcessorApproval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub-Processor Approval Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
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
                name="subProcessorDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Processor Details (if applicable)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Name of Sub-Processor, Purpose, Location, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold mt-6">Reporting and Notifications</h3>
              <FormField
                control={form.control}
                name="breachNotificationPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breach Notification Period</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Notify within 24 hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reportingFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reporting Format</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Incident report template" {...field} />
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

  if (!type) {
    return <div>Invalid document type</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Create {getFormTitle()}
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to generate your {getFormTitle().toLowerCase()}
        </p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderFormFields()}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? `Generating ${getFormTitle()}...`
                : `Generate ${getFormTitle()}`}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}