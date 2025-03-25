import { useParams, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent, 
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ReactNode } from "react";

// Type definitions for form fields
type FormFields = {
  // Common Fields
  dateOfAgreement?: string;

  // Employment Agreement Fields
  employmentCompanyName?: string;
  employmentEmployerAddress?: string;
  employmentEmployeeName?: string;
  employmentEmployeeAddress?: string;
  employmentJobTitle?: string;
  employmentStartDate?: string;
  employmentBaseSalary?: string;
  employmentSalaryFrequency?: string;
  employmentBonusDetails?: string;
  employmentBenefits?: string;
  employmentWorkHoursPerWeek?: string;
  employmentWorkStartTime?: string;
  employmentWorkEndTime?: string;
  employmentNonCompetePeriod?: string;
  employmentNonSolicitationPeriod?: string;
  employmentNoticeEmployer?: string;
  employmentNoticeEmployee?: string;
  employmentGoverningCity?: string;

  // NDA Fields  
  ndaCompanyName?: string;
  ndaCompanyAddress?: string;
  ndaEmployeeName?: string;
  ndaEmployeeAddress?: string;
  ndaConfidentialInfo?: string;
  ndaPermittedUse?: string;
  ndaExcludedInfo?: string;
  ndaReturnOfInfo?: string;
  ndaDuration?: string;
  ndaSurvivalTerms?: string;
  ndaRemedies?: string;
  ndaGoverningLaw?: string;
  ndaSignatureDate?: string;

  // Employee Handbook Fields
  handbookCompanyName?: string;
  handbookVersion?: string;
  handbookEffectiveDate?: string;
  handbookPurpose?: string;
  handbookScope?: string;
  handbookWorkingHours?: string;
  handbookAttendancePolicy?: string;
  handbookLeavePolicy?: string;
  handbookDressCode?: string;
  handbookCodeOfConduct?: string;
  handbookGrievanceProcess?: string;
  handbookDisciplinaryProcess?: string;
  handbookITPolicy?: string;
  handbookSafetyPolicy?: string;
  handbookConfidentialityPolicy?: string;
  handbookAcknowledgement?: string;

  // HR Policy Fields
  hrPolicyCompanyName?: string;
  hrPolicyVersion?: string;
  hrPolicyEffectiveDate?: string;
  hrPolicyScope?: string;
  hrPolicyEqualOpportunity?: string;
  hrPolicyRecruitment?: string;
  hrPolicyCompensation?: string;
  hrPolicyPerformanceManagement?: string;
  hrPolicyTraining?: string;
  hrPolicyWorkplace?: string;
  hrPolicyHealth?: string;
  hrPolicySafety?: string;
  hrPolicyGrievance?: string;
  hrPolicyDisciplinary?: string;
  hrPolicyTermination?: string;
  hrPolicyAmendments?: string;

  // Vendor Agreement Fields
  vendorName?: string;
  vendorType?: string;
  vendorAddress?: string;
  vendorTitle?: string;
  companyName?: string;
  companyAddress?: string;
  companyTitle?: string;
  goodsServicesDescription?: string;
  agreementStartDate?: string;
  agreementEndDate?: string;
  pricePerUnit?: string;
  paymentTermsDays?: string;
  paymentMode?: string;
  deliveryAddress?: string;
  terminationNoticePeriod?: string;
  terminationNoticePeriodNonPayment?: string;
  arbitrationCity?: string;

  // Freelancer Agreement Fields
  freelancerName?: string;
  freelancerAddress?: string;
  freelancerContactInfo?: string;
  freelancerExpertise?: string;
  freelancerClientName?: string;
  freelancerClientAddress?: string;
  freelancerProjectScope?: string;
  freelancerDeliverables?: string;
  freelancerTimeline?: string;
  freelancerMilestones?: string;
  freelancerPaymentRate?: string;
  freelancerPaymentTerms?: string;
  freelancerExpenses?: string;
  freelancerEquipment?: string;
  freelancerWorkHours?: string;
  freelancerLocation?: string;
  freelancerIntellectualProperty?: string;
  freelancerConfidentiality?: string;
  freelancerNonCompete?: string;
  freelancerIndependentStatus?: string;
  freelancerTermination?: string;
  freelancerModification?: string;
  freelancerGoverningLaw?: string;
  freelancerDispute?: string;

  // Marketing Agreement Fields
  marketingDateOfAgreement?: string;
  marketingClientName?: string;
  marketingClientAddress?: string;
  marketingAgencyName?: string;
  marketingAgencyAddress?: string;
  marketingServicesScope?: string;
  marketingStartDate?: string;
  marketingEndDate?: string;
  marketingTotalAmount?: string;
  marketingPaymentSchedule?: string;
  marketingAdditionalCosts?: string;
  marketingTaxes?: string;
  marketingDeliverables?: string;
  marketingAgencyResponsibilities?: string;
  marketingClientResponsibilities?: string;
  marketingIpOwnership?: string;
  marketingAgencyUsageRights?: string;
  marketingPerformanceMetrics?: string;
  marketingTerminationNoticeDays?: string;
  marketingTerminationNonPaymentDays?: string;
  marketingTerminationImmediate?: string;
  marketingArbitrationVenue?: string;
  marketingClientSignatory?: string;
  marketingAgencySignatory?: string;

  // DPA Fields
  controllerName?: string;
  controllerAddress?: string;
  controllerContactPerson?: string;
  controllerEmail?: string;
  controllerPhone?: string;
  
  processorName?: string;
  processorAddress?: string;
  processorContactPerson?: string;
  processorEmail?: string;
  processorPhone?: string;
  
  processingPurpose?: string;
  processingNature?: string;
  processingDuration?: string;
  
  personalDataCategories?: string;
  sensitivePDataCategories?: string;
  otherDataCategories?: string;
  
  dataSubjectsCategories?: string;
  processingInstructions?: string;
  
  encryptionStandards?: string;
  accessControl?: string;
  dataBackup?: string;
  additionalSecurityMeasures?: string;
  
  retentionPeriod?: string;
  
  subProcessorApproval?: string;
  subProcessorDetails?: string;
  
  breachNotificationPeriod?: string;
  reportingFormat?: string;

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

  // Software License Agreement Fields
  softwareLicensorName?: string;
  softwareLicensorAddress?: string;
  softwareLicenseeName?: string;
  softwareLicenseeAddress?: string;
  softwareLicenseType?: string;
  softwareName?: string;
  softwarePurpose?: string;
  softwareLicenseFee?: string;
  softwareInitialPayment?: string;
  softwarePaymentSchedule?: string;
  softwareDeliveryTimeline?: string;
  softwareInstallationAssistance?: string;
  softwareStandardSupport?: string;
  softwareSupportDuration?: string;
  softwareAdditionalSupportCharges?: string;
  softwareWarrantyPeriod?: string;
  softwareAgreementDuration?: string;
  softwareTerminationPeriod?: string;
  softwareArbitrationCity?: string;

  // Software Development Agreement Fields
  softwareDevCompanyName?: string;
  softwareDevCompanyAddress?: string;
  softwareDevClientName?: string;
  softwareDevClientAddress?: string;
  softwareDevProjectName?: string;
  softwareDevProjectScope?: string;
  softwareDevSpecifications?: string;
  softwareDevTimeline?: string;
  softwareDevMilestones?: string;
  softwareDevDeliverables?: string;
  softwareDevPaymentAmount?: string;
  softwareDevPaymentSchedule?: string;
  softwareDevIpRights?: string;
  softwareDevAcceptanceCriteria?: string;
  softwareDevTestingProcedure?: string;
  softwareDevMaintenanceTerms?: string;
  softwareDevSupportTerms?: string;
  softwareDevConfidentiality?: string;
  softwareDevTermination?: string;
  softwareDevIndemnification?: string;
  softwareDevWarranty?: string;
  softwareDevGoverningLaw?: string;
  softwareDevDispute?: string;

  // Sales Agreement Fields
  salesSellerName?: string;
  salesSellerAddress?: string;
  salesBuyerName?: string;
  salesBuyerAddress?: string;
  salesProductDescription?: string;
  salesQuantity?: string;
  salesUnitPrice?: string;
  salesTotalPrice?: string;
  salesDeliveryTerms?: string;
  salesDeliveryDate?: string;
  salesPaymentTerms?: string;
  salesWarranty?: string;
  salesInspectionPeriod?: string;
  salesQualityStandards?: string;
  salesReturnPolicy?: string;
  salesLiabilityTerms?: string;
  salesForceTerms?: string;
  salesGoverningLaw?: string;
  salesArbitrationVenue?: string;
  salesNoticesPeriod?: string;

  // Event Management Agreement Fields
  eventClientName?: string;
  eventClientAddress?: string;
  eventManagerName?: string;
  eventManagerAddress?: string;
  eventName?: string;
  eventDates?: string;
  eventServices?: string;
  eventTermStart?: string;
  eventTermEnd?: string;
  eventTotalFee?: string;
  eventPaymentScheduleSigningPercentage?: string;
  eventPaymentSchedulePlanningPercentage?: string;
  eventPaymentScheduleCompletionPercentage?: string;
  eventPaymentMethod?: string;
  eventLatePaymentRate?: string;
  eventCancellationNoticePeriod?: string;
  eventRefundBeforeDate?: string;
  eventRefundBeforePercentage?: string;
  eventNoRefundAfterDate?: string;
  eventArbitrationLocation?: string;
  eventTerminationNoticePeriod?: string;

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

  // Commission Agreement Fields
  commissionDateOfAgreement?: string;
  commissionCompanyName?: string;
  commissionCompanyAddress?: string;
  commissionAgentName?: string;
  commissionAgentAddress?: string;
  commissionProductsServices?: string;
  commissionTerritory?: string;
  commissionAppointmentType?: string;
  commissionRate?: string;
  commissionCalculationBasis?: string;
  commissionTieredStructure?: string;
  commissionPaymentDay?: string;
  commissionPaymentMethod?: string;
  commissionConfidentialityTerms?: string;
  commissionStartDate?: string;
  commissionEndDate?: string;
  commissionNoticePeriod?: string;
  commissionArbitrationLocation?: string;
  commissionJurisdiction?: string;
};

interface RouteParams {
  type: string;
}

// Helper functions
const getFormSchema = (type: string) => {
  switch (type) {
    case "vendor":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        vendorName: z.string().min(1, "Vendor's name is required"),
        vendorType: z.string().min(1, "Vendor's type is required"),
        vendorAddress: z.string().min(1, "Vendor's address is required"),
        vendorTitle: z.string().min(1, "Vendor's title is required"),
        companyName: z.string().min(1, "Company's name is required"),
        companyAddress: z.string().min(1, "Company's address is required"),
        companyTitle: z.string().min(1, "Company representative's title is required"),
        goodsServicesDescription: z.string().min(1, "Description of goods/services is required"),
        agreementStartDate: z.string().min(1, "Start date is required"),
        agreementEndDate: z.string().min(1, "End date is required"),
        pricePerUnit: z.string().min(1, "Price per unit/service is required"),
        paymentTermsDays: z.string().min(1, "Payment terms are required"),
        paymentMode: z.string().min(1, "Mode of payment is required"),
        deliveryAddress: z.string().min(1, "Delivery address is required"),
        terminationNoticePeriod: z.string().min(1, "Termination notice period is required"),
        terminationNoticePeriodNonPayment: z.string().min(1, "Termination notice period for non-payment is required"),
        arbitrationCity: z.string().min(1, "Arbitration city is required"),
      });
    case "freelancer":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        freelancerName: z.string().min(1, "Freelancer name is required"),
        freelancerAddress: z.string().min(1, "Freelancer address is required"),
        freelancerContactInfo: z.string().min(1, "Contact information is required"),
        freelancerExpertise: z.string().min(1, "Expertise details are required"),
        freelancerClientName: z.string().min(1, "Client name is required"),
        freelancerClientAddress: z.string().min(1, "Client address is required"),
        freelancerProjectScope: z.string().min(1, "Project scope is required"),
        freelancerDeliverables: z.string().min(1, "Deliverables are required"),
        freelancerTimeline: z.string().min(1, "Timeline is required"),
        freelancerMilestones: z.string().min(1, "Milestones are required"),
        freelancerPaymentRate: z.string().min(1, "Payment rate is required"),
        freelancerPaymentTerms: z.string().min(1, "Payment terms are required"),
        freelancerExpenses: z.string().min(1, "Expense terms are required"),
        freelancerEquipment: z.string().min(1, "Equipment details are required"),
        freelancerWorkHours: z.string().min(1, "Work hours are required"),
        freelancerLocation: z.string().min(1, "Work location is required"),
        freelancerIntellectualProperty: z.string().min(1, "IP terms are required"),
        freelancerConfidentiality: z.string().min(1, "Confidentiality terms are required"),
        freelancerNonCompete: z.string().min(1, "Non-compete terms are required"),
        freelancerIndependentStatus: z.string().min(1, "Independent contractor status is required"),
        freelancerTermination: z.string().min(1, "Termination terms are required"),
        freelancerModification: z.string().min(1, "Modification terms are required"),
        freelancerGoverningLaw: z.string().min(1, "Governing law is required"),
        freelancerDispute: z.string().min(1, "Dispute resolution terms are required"),
      });
    case "marketing":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        marketingClientName: z.string().min(1, "Client's name is required"),
        marketingClientAddress: z.string().min(1, "Client's address is required"),
        marketingAgencyName: z.string().min(1, "Agency's name is required"),
        marketingAgencyAddress: z.string().min(1, "Agency's address is required"),
        marketingServicesScope: z.string().min(1, "Scope of services is required"),
        marketingStartDate: z.string().min(1, "Start date is required"),
        marketingEndDate: z.string().min(1, "End date is required"),
        marketingTotalAmount: z.string().min(1, "Total amount is required"),
        marketingPaymentSchedule: z.string().min(1, "Payment schedule is required"),
        marketingAdditionalCosts: z.string().min(1, "Additional costs information is required"),
        marketingTaxes: z.string().min(1, "Tax information is required"),
        marketingDeliverables: z.string().min(1, "Deliverables are required"),
        marketingAgencyResponsibilities: z.string().min(1, "Agency responsibilities are required"),
        marketingClientResponsibilities: z.string().min(1, "Client responsibilities are required"),
        marketingIpOwnership: z.string().min(1, "IP ownership terms are required"),
        marketingAgencyUsageRights: z.string().min(1, "Agency usage rights are required"),
        marketingPerformanceMetrics: z.string().min(1, "Performance metrics are required"),
        marketingTerminationNoticeDays: z.string().min(1, "Termination notice period is required"),
        marketingTerminationNonPaymentDays: z.string().min(1, "Non-payment termination period is required"),
        marketingTerminationImmediate: z.string().min(1, "Immediate termination terms are required"),
        marketingArbitrationVenue: z.string().min(1, "Arbitration venue is required"),
        marketingClientSignatory: z.string().min(1, "Client's signatory details are required"),
        marketingAgencySignatory: z.string().min(1, "Agency's signatory details are required"),
      });
    case "dpa":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        controllerName: z.string().min(1, "Controller name is required"),
        controllerAddress: z.string().min(1, "Controller address is required"),
        controllerContactPerson: z.string().min(1, "Controller contact person is required"),
        controllerEmail: z.string().email("Valid email is required"),
        controllerPhone: z.string().min(1, "Controller phone number is required"),
        
        processorName: z.string().min(1, "Processor name is required"),
        processorAddress: z.string().min(1, "Processor address is required"),
        processorContactPerson: z.string().min(1, "Processor contact person is required"),
        processorEmail: z.string().email("Valid email is required"),
        processorPhone: z.string().min(1, "Processor phone number is required"),
        
        processingPurpose: z.string().min(1, "Processing purpose is required"),
        processingNature: z.string().min(1, "Nature of processing is required"),
        processingDuration: z.string().min(1, "Duration of processing is required"),
        
        personalDataCategories: z.string().min(1, "Personal data categories are required"),
        sensitivePDataCategories: z.string(),
        otherDataCategories: z.string(),
        
        dataSubjectsCategories: z.string().min(1, "Data subjects categories are required"),
        processingInstructions: z.string().min(1, "Processing instructions are required"),
        
        encryptionStandards: z.string().min(1, "Encryption standards are required"),
        accessControl: z.string().min(1, "Access control measures are required"),
        dataBackup: z.string().min(1, "Data backup measures are required"),
        additionalSecurityMeasures: z.string(),
        
        retentionPeriod: z.string().min(1, "Retention period is required"),
        
        subProcessorApproval: z.string().min(1, "Sub-processor approval status is required"),
        subProcessorDetails: z.string(),
        
        breachNotificationPeriod: z.string().min(1, "Breach notification period is required"),
        reportingFormat: z.string().min(1, "Reporting format is required"),
      });
    case "service":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        serviceProviderName: z.string().min(1, "Service provider name is required"),
        serviceProviderAddress: z.string().min(1, "Service provider address is required"),
        serviceClientName: z.string().min(1, "Client name is required"),
        serviceClientAddress: z.string().min(1, "Client address is required"),
        serviceDescription: z.string().min(1, "Service description is required"),
        serviceDuration: z.string().min(1, "Service duration is required"),
        serviceStartDate: z.string().min(1, "Start date is required"),
        serviceEndDate: z.string().min(1, "End date is required"),
        serviceFees: z.string().min(1, "Service fees are required"),
        servicePaymentTerms: z.string().min(1, "Payment terms are required"),
        serviceDeliverables: z.string().min(1, "Deliverables are required"),
        serviceTimeline: z.string().min(1, "Timeline is required"),
        servicePerformanceMetrics: z.string().min(1, "Performance metrics are required"),
        serviceTermination: z.string().min(1, "Termination terms are required"),
        serviceConfidentiality: z.string().min(1, "Confidentiality terms are required"),
        serviceIntellectualProperty: z.string().min(1, "IP terms are required"),
        serviceIndemnification: z.string().min(1, "Indemnification terms are required"),
        serviceLimitation: z.string().min(1, "Limitation terms are required"),
        serviceGoverningLaw: z.string().min(1, "Governing law is required"),
        serviceDisputeResolution: z.string().min(1, "Dispute resolution terms are required"),
      });

    case "software-license":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        softwareLicensorName: z.string().min(1, "Licensor's name is required"),
        softwareLicensorAddress: z.string().min(1, "Licensor's address is required"),
        softwareLicenseeName: z.string().min(1, "Licensee's name is required"),
        softwareLicenseeAddress: z.string().min(1, "Licensee's address is required"),
        softwareLicenseType: z.string().min(1, "License type is required"),
        softwareName: z.string().min(1, "Software name is required"),
        softwarePurpose: z.string().min(1, "Purpose of software use is required"),
        softwareLicenseFee: z.string().min(1, "License fee is required"),
        softwareInitialPayment: z.string().min(1, "Initial payment amount is required"),
        softwarePaymentSchedule: z.string(),
        softwareDeliveryTimeline: z.string().min(1, "Delivery timeline is required"),
        softwareInstallationAssistance: z.string().min(1, "Installation assistance details are required"),
        softwareStandardSupport: z.string().min(1, "Standard support details are required"),
        softwareSupportDuration: z.string().min(1, "Support duration is required"),
        softwareAdditionalSupportCharges: z.string(),
        softwareWarrantyPeriod: z.string().min(1, "Warranty period is required"),
        softwareAgreementDuration: z.string().min(1, "Agreement duration is required"),
        softwareTerminationPeriod: z.string().min(1, "Termination notice period is required"),
        softwareArbitrationCity: z.string().min(1, "Arbitration city is required"),
      });
    case "commission":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        commissionCompanyName: z.string().min(1, "Company Name is required"),
        commissionCompanyAddress: z.string().min(1, "Company Address is required"),
        commissionAgentName: z.string().min(1, "Agent Name is required"),
        commissionAgentAddress: z.string().min(1, "Agent Address is required"),
        commissionProductsServices: z.string().min(1, "Products/Services are required"),
        commissionTerritory: z.string().min(1, "Territory/Market is required"),
        commissionAppointmentType: z.string().min(1, "Appointment Type is required"),
        commissionRate: z.string().min(1, "Commission Rate is required"),
        commissionCalculationBasis: z.string().min(1, "Calculation Basis is required"),
        commissionTieredStructure: z.string().min(1, "Tiered Structure information is required"),
        commissionPaymentDay: z.string().min(1, "Payment Day is required"),
        commissionPaymentMethod: z.string().min(1, "Payment Method is required"),
        commissionConfidentialityTerms: z.string().min(1, "Confidentiality Terms are required"),
        commissionStartDate: z.string().min(1, "Start Date is required"),
        commissionEndDate: z.string().min(1, "End Date is required"),
        commissionNoticePeriod: z.string().min(1, "Notice Period is required"),
        commissionArbitrationLocation: z.string().min(1, "Arbitration Location is required"),
        commissionJurisdiction: z.string().min(1, "Jurisdiction is required"),
      });
    case "employment":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        employmentCompanyName: z.string().min(1, "Company name is required"),
        employmentEmployerAddress: z.string().min(1, "Employer's address is required"),
        employmentEmployeeName: z.string().min(1, "Employee's full name is required"),
        employmentEmployeeAddress: z.string().min(1, "Employee's address is required"),
        employmentJobTitle: z.string().min(1, "Job title is required"),
        employmentStartDate: z.string().min(1, "Start date is required"),
        employmentBaseSalary: z.string().min(1, "Base salary is required"),
        employmentSalaryFrequency: z.string().min(1, "Salary frequency is required"),
        employmentBonusDetails: z.string(),
        employmentBenefits: z.string().min(1, "Benefits are required"),
        employmentWorkHoursPerWeek: z.string().min(1, "Work hours per week are required"),
        employmentWorkStartTime: z.string().min(1, "Work start time is required"),
        employmentWorkEndTime: z.string().min(1, "Work end time is required"),
        employmentNonCompetePeriod: z.string().min(1, "Non-compete period is required"),
        employmentNonSolicitationPeriod: z.string().min(1, "Non-solicitation period is required"),
        employmentNoticeEmployer: z.string().min(1, "Employer notice period is required"),
        employmentNoticeEmployee: z.string().min(1, "Employee notice period is required"),
        employmentGoverningCity: z.string().min(1, "Governing city/state is required"),
      });
    case "nda":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        ndaCompanyName: z.string().min(1, "Company name is required"),
        ndaCompanyAddress: z.string().min(1, "Company address is required"), 
        ndaEmployeeName: z.string().min(1, "Employee name is required"),
        ndaEmployeeAddress: z.string().min(1, "Employee address is required"),
        ndaConfidentialInfo: z.string().min(1, "Confidential information description is required"),
        ndaPermittedUse: z.string().min(1, "Permitted use terms are required"),
        ndaExcludedInfo: z.string().min(1, "Excluded information is required"),
        ndaReturnOfInfo: z.string().min(1, "Return of information terms are required"),
        ndaDuration: z.string().min(1, "Duration is required"),
        ndaSurvivalTerms: z.string().min(1, "Survival terms are required"),
        ndaRemedies: z.string().min(1, "Remedies are required"),
        ndaGoverningLaw: z.string().min(1, "Governing law is required"),
        ndaSignatureDate: z.string().min(1, "Signature date is required"),
      });
    case "handbook":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        handbookCompanyName: z.string().min(1, "Company name is required"),
        handbookVersion: z.string().min(1, "Version number is required"),
        handbookEffectiveDate: z.string().min(1, "Effective date is required"),
        handbookPurpose: z.string().min(1, "Purpose is required"),
        handbookScope: z.string().min(1, "Scope is required"),
        handbookWorkingHours: z.string().min(1, "Working hours policy is required"),
        handbookAttendancePolicy: z.string().min(1, "Attendance policy is required"),
        handbookLeavePolicy: z.string().min(1, "Leave policy is required"),
        handbookDressCode: z.string().min(1, "Dress code is required"),
        handbookCodeOfConduct: z.string().min(1, "Code of conduct is required"),
        handbookGrievanceProcess: z.string().min(1, "Grievance process is required"),
        handbookDisciplinaryProcess: z.string().min(1, "Disciplinary process is required"),
        handbookITPolicy: z.string().min(1, "IT policy is required"),
        handbookSafetyPolicy: z.string().min(1, "Safety policy is required"),
        handbookConfidentialityPolicy: z.string().min(1, "Confidentiality policy is required"),
        handbookAcknowledgement: z.string().min(1, "Acknowledgement is required"),
      });
    case "hr-policy":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        hrPolicyCompanyName: z.string().min(1, "Company name is required"),
        hrPolicyVersion: z.string().min(1, "Version number is required"),
        hrPolicyEffectiveDate: z.string().min(1, "Effective date is required"),
        hrPolicyScope: z.string().min(1, "Policy scope is required"),
        hrPolicyEqualOpportunity: z.string().min(1, "Equal opportunity policy is required"),
        hrPolicyRecruitment: z.string().min(1, "Recruitment policy is required"),
        hrPolicyCompensation: z.string().min(1, "Compensation policy is required"),
        hrPolicyPerformanceManagement: z.string().min(1, "Performance management policy is required"),
        hrPolicyTraining: z.string().min(1, "Training policy is required"),
        hrPolicyWorkplace: z.string().min(1, "Workplace policy is required"),
        hrPolicyHealth: z.string().min(1, "Health policy is required"),
        hrPolicySafety: z.string().min(1, "Safety policy is required"),
        hrPolicyGrievance: z.string().min(1, "Grievance policy is required"),
        hrPolicyDisciplinary: z.string().min(1, "Disciplinary policy is required"),
        hrPolicyTermination: z.string().min(1, "Termination policy is required"),
        hrPolicyAmendments: z.string().min(1, "Amendments policy is required"),
      });
    case "software-development":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        softwareDevCompanyName: z.string().min(1, "Company name is required"),
        softwareDevCompanyAddress: z.string().min(1, "Company address is required"),
        softwareDevClientName: z.string().min(1, "Client name is required"),
        softwareDevClientAddress: z.string().min(1, "Client address is required"),
        softwareDevProjectName: z.string().min(1, "Project name is required"),
        softwareDevProjectScope: z.string().min(1, "Project scope is required"),
        softwareDevSpecifications: z.string().min(1, "Specifications are required"),
        softwareDevTimeline: z.string().min(1, "Timeline is required"),
        softwareDevMilestones: z.string().min(1, "Milestones are required"),
        softwareDevDeliverables: z.string().min(1, "Deliverables are required"),
        softwareDevPaymentAmount: z.string().min(1, "Payment amount is required"),
        softwareDevPaymentSchedule: z.string().min(1, "Payment schedule is required"),
        softwareDevIpRights: z.string().min(1, "IP rights are required"),
        softwareDevAcceptanceCriteria: z.string().min(1, "Acceptance criteria is required"),
        softwareDevTestingProcedure: z.string().min(1, "Testing procedure is required"),
        softwareDevMaintenanceTerms: z.string().min(1, "Maintenance terms are required"),
        softwareDevSupportTerms: z.string().min(1, "Support terms are required"),
        softwareDevConfidentiality: z.string().min(1, "Confidentiality terms are required"),
        softwareDevTermination: z.string().min(1, "Termination terms are required"),
        softwareDevIndemnification: z.string().min(1, "Indemnification terms are required"),
        softwareDevWarranty: z.string().min(1, "Warranty terms are required"),
        softwareDevGoverningLaw: z.string().min(1, "Governing law is required"),
        softwareDevDispute: z.string().min(1, "Dispute resolution terms are required"),
      });
    case "event":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        eventClientName: z.string().min(1, "Client name is required"),
        eventClientAddress: z.string().min(1, "Client address is required"),
        eventManagerName: z.string().min(1, "Event manager name is required"),
        eventManagerAddress: z.string().min(1, "Event manager address is required"),
        eventName: z.string().min(1, "Event name/description is required"),
        eventDates: z.string().min(1, "Event date(s) are required"),
        eventServices: z.string().min(1, "Services to be provided are required"),
        eventTermStart: z.string().min(1, "Term start date is required"),
        eventTermEnd: z.string().min(1, "Term end date is required"),
        eventTotalFee: z.string().min(1, "Total fee is required"),
        eventPaymentScheduleSigningPercentage: z.string().min(1, "Signing payment percentage is required"),
        eventPaymentSchedulePlanningPercentage: z.string().min(1, "Planning payment percentage is required"),
        eventPaymentScheduleCompletionPercentage: z.string().min(1, "Completion payment percentage is required"),
        eventPaymentMethod: z.string().min(1, "Payment method is required"),
        eventLatePaymentRate: z.string().min(1, "Late payment interest rate is required"),
        eventCancellationNoticePeriod: z.string().min(1, "Cancellation notice period is required"),
        eventRefundBeforeDate: z.string().min(1, "Refund cutoff date is required"),
        eventRefundBeforePercentage: z.string().min(1, "Refund percentage is required"),
        eventNoRefundAfterDate: z.string().min(1, "No refund after date is required"),
        eventArbitrationLocation: z.string().min(1, "Arbitration location is required"),
        eventTerminationNoticePeriod: z.string().min(1, "Termination notice period is required"),
      });

    case "sales":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        salesSellerName: z.string().min(1, "Seller name is required"),
        salesSellerAddress: z.string().min(1, "Seller address is required"),
        salesBuyerName: z.string().min(1, "Buyer name is required"),
        salesBuyerAddress: z.string().min(1, "Buyer address is required"),
        salesProductDescription: z.string().min(1, "Product description is required"),
        salesQuantity: z.string().min(1, "Quantity is required"),
        salesUnitPrice: z.string().min(1, "Unit price is required"),
        salesTotalPrice: z.string().min(1, "Total price is required"),
        salesDeliveryTerms: z.string().min(1, "Delivery terms are required"),
        salesDeliveryDate: z.string().min(1, "Delivery date is required"),
        salesPaymentTerms: z.string().min(1, "Payment terms are required"),
        salesWarranty: z.string().min(1, "Warranty terms are required"),
        salesInspectionPeriod: z.string().min(1, "Inspection period is required"),
        salesQualityStandards: z.string().min(1, "Quality standards are required"),
        salesReturnPolicy: z.string().min(1, "Return policy is required"),
        salesLiabilityTerms: z.string().min(1, "Liability terms are required"),
        salesForceTerms: z.string().min(1, "Force majeure terms are required"),
        salesGoverningLaw: z.string().min(1, "Governing law is required"),
        salesArbitrationVenue: z.string().min(1, "Arbitration venue is required"),
        salesNoticesPeriod: z.string().min(1, "Notices period is required"),
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
        subscriptionRocFilings: z.string().min(1, "ROC filings are required"),
        subscriptionAllotmentTimeline: z.string().min(1, "Allotment timeline is required"),
        subscriptionArbitrationCity: z.string().min(1, "Arbitration city is required"),
      });
    default:
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
      });
  }
};

const getFormTitle = (type: string) => {
  switch (type) {
    case "dpa":
      return "Data Processing Agreement";
    case "vendor":
      return "Vendor Agreement";
    case "marketing":
      return "Marketing Agreement";
    case "software-license":
      return "Software License Agreement";
    case "software-development":
      return "Software Development Agreement";
    case "consulting":
      return "Consulting Agreement";
    case "freelancer":
      return "Freelancer Agreement";
    case "service":
      return "Service Agreement";
    case "sales":
      return "Sales Agreement";
    case "subscription":
      return "Subscription Agreement";
    case "employment":
      return "Employment Agreement";
    case "nda":
      return "Non-Disclosure Agreement";
    case "handbook":
      return "Employee Handbook";
    case "hr-policy":
      return "HR Policy Agreement";
    case "commission":
      return "Commission Agreement";
    case "event":
      return "Event Management Agreement";
    default:
      return "Create Agreement";
  }
};

const getDefaultValues = (type: string) => {
  const today = format(new Date(), "yyyy-MM-dd");
  return {
    dateOfAgreement: today,
  };
};

const renderFormFields = (type: string, form: any): ReactNode => {
  const commonDateField = (
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
  );

  switch (type) {
    case "employment":
      return (
        <div className="space-y-8">
          {commonDateField}
          
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Employer & Employee Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="employmentCompanyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of the Employer's Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentEmployerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Address of the Employer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentEmployeeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee's Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name of the Employee" {...field} />
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
                    <FormLabel>Employee's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Address of the Employee" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Job Details</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="employmentJobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Job Title for the Employee" {...field} />
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
                    <FormLabel>Start Date of Employment</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Compensation & Benefits</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="employmentBaseSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Salary</FormLabel>
                    <FormControl>
                      <Input placeholder="Amount in ₹" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentSalaryFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Frequency</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentBonusDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bonus Details (if any)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details of any bonus, if applicable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentBenefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefits</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List of benefits provided, e.g., health insurance, provident fund, gratuity, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Work Schedule</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="employmentWorkHoursPerWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Hours Per Week</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of hours, e.g., 40" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentWorkStartTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" placeholder="Start Time, e.g., 9:00 AM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentWorkEndTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work End Time</FormLabel>
                    <FormControl>
                      <Input type="time" placeholder="End Time, e.g., 6:00 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Terms & Conditions</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="employmentNonCompetePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Non-Compete Period</FormLabel>
                    <FormControl>
                      <Input placeholder="Duration, e.g., 12 months" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentNonSolicitationPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Non-Solicitation Period</FormLabel>
                    <FormControl>
                      <Input placeholder="Duration, e.g., 12 months" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentNoticeEmployer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Period (Employer Termination)</FormLabel>
                    <FormControl>
                      <Input placeholder="Notice Period, e.g., 30 days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentNoticeEmployee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Period (Employee Resignation)</FormLabel>
                    <FormControl>
                      <Input placeholder="Notice Period, e.g., 30 days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentGoverningCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Governing City/State</FormLabel>
                    <FormControl>
                      <Input placeholder="City or State for legal jurisdiction" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );

    case "event":
      return (
        <div className="space-y-8">
          {commonDateField}
          
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Client & Event Manager Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="eventClientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name of Client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventClientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Client's Address" {...field} />
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
                      <Input placeholder="Name of Event Manager/Company" {...field} />
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
                      <Textarea placeholder="Event Manager's Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Event Details</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="eventName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name/Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Name/Description of the Event" {...field} />
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
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services to be Provided</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List of services: Planning, Venue selection, Vendor management, etc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Agreement Term & Payment</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="eventTermStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventTermEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term End Date</FormLabel>
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
                name="eventTotalFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Fee (INR)</FormLabel>
                    <FormControl>
                      <Input placeholder="Amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Payment Schedule</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="eventPaymentScheduleSigningPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signing Payment Percentage</FormLabel>
                    <FormControl>
                      <Input placeholder="Percentage upon signing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventPaymentSchedulePlanningPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planning Phase Payment Percentage</FormLabel>
                    <FormControl>
                      <Input placeholder="Percentage upon planning completion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventPaymentScheduleCompletionPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Payment Percentage</FormLabel>
                    <FormControl>
                      <Input placeholder="Percentage upon event completion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="eventLatePaymentRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Late Payment Interest Rate (% per month)</FormLabel>
                    <FormControl>
                      <Input placeholder="Rate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Cancellation & Refund Policy</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="eventCancellationNoticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cancellation Notice Period (Days)</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventRefundBeforeDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refund Available Before Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventRefundBeforePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refund Percentage</FormLabel>
                    <FormControl>
                      <Input placeholder="Percentage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventNoRefundAfterDate"
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

            <h3 className="text-lg font-semibold">Legal Terms</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="eventArbitrationLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitration Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventTerminationNoticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination Notice Period (Days)</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );

    case "commission":
      return (
        <div className="space-y-8">
          {commonDateField}
          
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Basic Information</h3>
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
                name="commissionCompanyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Company's Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commissionAgentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name of Agent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commissionAgentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Agent's Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Commission Details</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="commissionProductsServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Products/Services Covered</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specific products or services the Agent will represent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commissionTerritory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Territory/Market</FormLabel>
                    <FormControl>
                      <Input placeholder="Specified territory or market for sales activities" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commissionAppointmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent's Appointment Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Exclusive or Non-Exclusive" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commissionRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission Rate</FormLabel>
                    <FormControl>
                      <Input placeholder="Percentage or fixed amount per sale" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commissionCalculationBasis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission Calculation Basis</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Gross/Net sales value, excluding any deductions like taxes or shipping" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commissionTieredStructure"
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
            </div>

            <h3 className="text-lg font-semibold">Payment Details</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="commissionPaymentDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Day</FormLabel>
                    <FormControl>
                      <Input placeholder="Specific day of each month when commissions will be paid" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commissionPaymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Input placeholder="Bank transfer, cheque, or other method" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Terms and Conditions</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="commissionConfidentialityTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidentiality Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any special provisions or leave as provided in the draft" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="commissionStartDate"
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
                  name="commissionEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" placeholder="Leave blank if ongoing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="commissionNoticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Period for Termination</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of days required for termination notice" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commissionArbitrationLocation"
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
                name="commissionJurisdiction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurisdiction (Governing Law)</FormLabel>
                    <FormControl>
                      <Input placeholder="City/Region with legal jurisdiction" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );
    case "vendor":
      return (
        <div className="space-y-8">
          {commonDateField}
          
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Vendor Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="vendorCompanyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of vendor company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vendorCompanyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Company Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Complete address of vendor company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vendorContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of primary contact person" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vendorContactDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Details</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Phone, email, and other contact information" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Client Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="clientCompanyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of client company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientCompanyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Company Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Complete address of client company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Service Details</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="servicesDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed description of services to be provided" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliverySchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Schedule</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Timeline and schedule for service delivery" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="qualityStandards"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quality Standards</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Required quality standards and specifications" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Payment Terms</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="pricingTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Pricing structure and terms" {...field} />
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
                      <Textarea placeholder="Payment timeline and milestones" {...field} />
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
                      <Textarea placeholder="Key performance indicators and metrics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Legal Terms</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="warrantyTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Warranty terms and conditions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="liabilityTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liability Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Liability and limitations" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insuranceRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Requirements</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Required insurance coverage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terminationConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination Conditions</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Conditions for contract termination" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confidentialityTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidentiality Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Confidentiality and non-disclosure terms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="intellectualPropertyRights"
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
                name="complianceRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compliance Requirements</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Regulatory and compliance requirements" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="disputeResolutionProcess"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dispute Resolution Process</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Process for resolving disputes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="governingLawJurisdiction" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Governing Law</FormLabel>
                    <FormControl>
                      <Input placeholder="Jurisdiction and governing law" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amendmentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amendment Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Terms for contract modifications" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );
    case "service":
      return (
        <div className="space-y-8">
          {commonDateField}
          
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Service Provider Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="serviceProviderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Provider Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of service provider" {...field} />
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
            </div>

            <h3 className="text-lg font-semibold">Client Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="serviceClientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of client" {...field} />
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

            <h3 className="text-lg font-semibold">Service Details</h3>
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
              <FormField
                control={form.control}
                name="serviceDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="Duration of services" {...field} />
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
            </div>

            <h3 className="text-lg font-semibold">Payment Terms</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="serviceFees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Fees</FormLabel>
                    <FormControl>
                      <Input placeholder="Fee structure for services" {...field} />
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
                      <Textarea placeholder="Payment schedule and terms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Deliverables and Timeline</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="serviceDeliverables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deliverables</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List of deliverables" {...field} />
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
                      <Textarea placeholder="Project timeline and milestones" {...field} />
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
                      <Textarea placeholder="Performance standards and KPIs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Legal Terms</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="serviceTermination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Conditions for contract termination" {...field} />
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
                      <Textarea placeholder="Confidentiality obligations" {...field} />
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
                    <FormLabel>Intellectual Property</FormLabel>
                    <FormControl>
                      <Textarea placeholder="IP rights and ownership" {...field} />
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
                      <Textarea placeholder="Indemnification terms" {...field} />
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
                      <Textarea placeholder="Liability limitations" {...field} />
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
                      <Textarea placeholder="Dispute resolution process" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );
      
    case "dpa":
      return (
        <div className="space-y-8">
          {commonDateField}

          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Data Processor Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="dpaProcessorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Processor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of data processor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaProcessorAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Processor Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Complete address of data processor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Data Controller Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="dpaControllerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Controller Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of data controller" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaControllerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Controller Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Complete address of data controller" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Data Processing Details</h3>
            <div className="grid gap-4">
              {/* Add all DPA specific fields */}
              <FormField
                control={form.control}
                name="dpaDataTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Types of Personal Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description of personal data types to be processed" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaDataSubjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Subjects</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description of data subjects" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaProcessingPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processing Purpose</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Purpose of data processing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaProcessingDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processing Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="Duration of data processing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaSecurityMeasures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Measures</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description of security measures" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaSubProcessors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Processors</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List of sub-processors involved" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaSubProcessorRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Processor Requirements</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Requirements for sub-processors" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaDataBreachNotification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Breach Notification</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Procedure for notifying data breaches" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaBreachTimeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breach Notification Timeline</FormLabel>
                    <FormControl>
                      <Input placeholder="Timeline for breach notification" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaDataTransfers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Transfers</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details of data transfers" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaDataProtectionImpact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Protection Impact Assessment</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description of data protection impact assessment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaAudits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audits</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description of audit procedures" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaConfidentiality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidentiality</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Confidentiality obligations" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaDataDeletion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Deletion</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Procedure for data deletion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaTermination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Termination clause" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaGoverningLaw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Governing Law</FormLabel>
                    <FormControl>
                      <Input placeholder="Governing law" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaLiability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liability</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Liability clause" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpaComplianceRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compliance Requirements</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Compliance requirements" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );

    case "freelancer":
      return (
        <div className="space-y-8">
          {commonDateField}

          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Freelancer Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="freelancerName"
                render={({ field }) => (
                  <FormItem>                  <FormLabel>Freelancer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of freelancer" {...field} />
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
                    <FormLabel>Freelancer Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Complete address of freelancer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerContactInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Freelancer Contact Information</FormLabel>
                    <FormControl>
                      <Input placeholder="Email address or phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerExpertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Freelancer Expertise</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe freelancer's skills and experience" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerClientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerClientAddress"
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
              <FormField
                control={form.control}
                name="freelancerProjectScope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Scope</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed description of the project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerDeliverables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deliverables</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List of deliverables" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerTimeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Timeline</FormLabel>
                    <FormControl>
                      <Input placeholder="Project start and end dates" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerMilestones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestones</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List of project milestones" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerPaymentRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Rate</FormLabel>
                    <FormControl>
                      <Input placeholder="Hourly rate or project fee" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerPaymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Payment schedule and terms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerExpenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expenses</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Terms regarding expenses" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerEquipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Equipment to be provided" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerWorkHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="Expected work hours per week/month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Work location details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerIntellectualProperty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intellectual Property</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Intellectual property rights" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerConfidentiality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidentiality</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Confidentiality agreement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerNonCompete"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Non-Compete</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Non-compete clause" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerIndependentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Independent Contractor Status</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Confirmation of independent contractor status" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerTermination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Termination clause" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerModification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modification</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Modification clause" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerGoverningLaw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Governing Law</FormLabel>
                    <FormControl>
                      <Input placeholder="Governing law" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freelancerDispute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dispute Resolution</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Dispute resolution clause" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );

    case "marketing":
      return (
        <div className="space-y-8">
          {commonDateField}

          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Service Provider Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="marketingServiceProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marketing Service Provider</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of service provider" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingServiceProviderAddress"
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
                name="marketingClientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingClientAddress"
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
              <FormField
                control={form.control}
                name="marketingServicesScope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services Scope</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed description of services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingCampaignObjectives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Objectives</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Objectives of the marketing campaign" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingTargetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description of the target audience" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingChannels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marketing Channels</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List of marketing channels to be used" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingDeliverables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deliverables</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List of deliverables" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingTimeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeline</FormLabel>
                    <FormControl>
                      <Input placeholder="Campaign start and end dates" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingKPIs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KPIs</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List of KPIs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingReportingFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reporting Frequency</FormLabel>
                    <FormControl>
                      <Input placeholder="Reporting frequency" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input placeholder="Marketing budget" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingPaymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Payment schedule and terms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingIntellectualProperty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intellectual Property</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Intellectual property rights" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingContentRights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Rights</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Content ownership and usage rights" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingConfidentiality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidentiality</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Confidentiality agreement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingTermination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Termination clause" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingIndemnification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indemnification</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Indemnification clause" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingGoverningLaw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Governing Law</FormLabel>
                    <FormControl>
                      <Input placeholder="Governing law" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingDispute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dispute Resolution</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Dispute resolution clause" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );

    case "event":
      return (
        <div className="space-y-8">
          {commonDateField}
          
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Client & Event Manager Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="eventClientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name of Client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventClientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Client's Address" {...field} />
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
                      <Input placeholder="Name of Event Manager/Company" {...field} />
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
                      <Textarea placeholder="Event Manager's Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Event Details</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="eventName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name/Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Name/Description of the Event" {...field} />
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
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services to be Provided</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={`Planning and coordination
Venue selection and booking
Vendor management
Event promotion and marketing
On-site event management
Post-event services
Other additional services`} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Agreement Term & Payment</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="eventTermStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventTermEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term End Date</FormLabel>
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
                name="eventTotalFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Fee (INR)</FormLabel>
                    <FormControl>
                      <Input placeholder="Amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Payment Schedule</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="eventPaymentScheduleSigningPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signing Payment Percentage</FormLabel>
                    <FormControl>
                      <Input placeholder="Percentage upon signing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventPaymentSchedulePlanningPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planning Phase Payment Percentage</FormLabel>
                    <FormControl>
                      <Input placeholder="Percentage upon planning completion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventPaymentScheduleCompletionPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Payment Percentage</FormLabel>
                    <FormControl>
                      <Input placeholder="Percentage upon event completion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="eventLatePaymentRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Late Payment Interest Rate (% per month)</FormLabel>
                    <FormControl>
                      <Input placeholder="Rate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Cancellation & Refund Policy</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="eventCancellationNoticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cancellation Notice Period (Days)</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventRefundBeforeDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refund Available Before Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventRefundBeforePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refund Percentage</FormLabel>
                    <FormControl>
                      <Input placeholder="Percentage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventNoRefundAfterDate"
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

            <h3 className="text-lg font-semibold">Legal Terms</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="eventArbitrationLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitration Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventTerminationNoticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination Notice Period (Days)</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );

    case "service":
      return (
        <div className="space-y-8">
          {commonDateField}
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Service Provider Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="serviceProviderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Provider Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of service provider" {...field} />
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
                      <Input placeholder="Full legal name of client" {...field} />
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
            <h3 className="text-lg font-semibold">Service Details</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="serviceDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed description of services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="Duration of service" {...field} />
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
                    <FormLabel>Service Start Date</FormLabel>
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
                    <FormLabel>Service End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceFees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Fees</FormLabel>
                    <FormControl>
                      <Input placeholder="Service fees" {...field} />
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
                      <Textarea placeholder="Payment schedule and terms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceDeliverables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deliverables</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List of deliverables" {...field} />
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
                      <Textarea placeholder="Project timeline" {...field} />
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
                      <Textarea placeholder="Key performance indicators" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceTermination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Termination clause" {...field} />
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
                    <FormLabel>Confidentiality</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Confidentiality agreement" {...field} />
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
                    <FormLabel>Intellectual Property</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Intellectual property rights" {...field} />
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
                      <Textarea placeholder="Indemnification clause" {...field} />
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
                      <Textarea placeholder="Limitation of liability clause" {...field} />
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
                      <Input placeholder="Governing law" {...field} />
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
                      <Textarea placeholder="Dispute resolution clause" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );

    case "software-license":
      return (
        <div className="space-y-8">
          {commonDateField}
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Licensor & Licensee Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="softwareLicensorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licensor's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name or Company Name of the Licensor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareLicensorAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licensor's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Address of the Licensor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareLicenseeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licensee's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name or Company Name of the Licensee" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareLicenseeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licensee's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Address of the Licensee" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">License Details</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="softwareLicenseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of License</FormLabel>
                    <FormControl>
                      <Input placeholder="Specify Non-Exclusive or Exclusive" {...field} />
                    </FormControl>
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
                      <Input placeholder="Name of the Software" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwarePurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose of Software Use</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specific purpose or industry for permitted use" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Payment Terms</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="softwareLicenseFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Fee Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="₹Amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareInitialPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Payment Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="₹Amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwarePaymentSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subsequent Payment Schedule</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specify payment schedule details (if any)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Support & Warranty</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="softwareDeliveryTimeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Timeline</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of Days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareInstallationAssistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installation Assistance</FormLabel>
                    <FormControl>
                      <Input placeholder="Yes/No, and any conditions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareStandardSupport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standard Support</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details, e.g., email, phone, or online" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareSupportDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="Duration, e.g., one year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareAdditionalSupportCharges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Support Charges</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details of additional fees, if applicable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareWarrantyPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty Period</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of Days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Agreement Terms</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="softwareAgreementDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration of Agreement</FormLabel>
                    <FormControl>
                      <Input placeholder="Specify duration, e.g., one year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareTerminationPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination Notice Period</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of Days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareArbitrationCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City for Arbitration Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="City Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );
    case "software-license":
      return (
        <div className="space-y-8">
          {commonDateField}
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Licensor & Licensee Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="softwareLicensorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licensor's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name or Company Name of the Licensor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareLicensorAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licensor's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Address of the Licensor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareLicenseeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licensee's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name or Company Name of the Licensee" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareLicenseeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licensee's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Address of the Licensee" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">License Details</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="softwareLicenseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of License</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select license type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="non-exclusive">Non-Exclusive</SelectItem>
                          <SelectItem value="exclusive">Exclusive</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                      <Input placeholder="Name of the Software" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwarePurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose of Software Use</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specific purpose or industry for permitted use" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Payment Terms</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="softwareLicenseFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Fee Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="₹Amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareInitialPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Payment Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="₹Amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwarePaymentSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subsequent Payment Schedule</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specify payment schedule details (if any)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Support & Installation</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="softwareDeliveryTimeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Timeline</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of Days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareInstallationAssistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installation Assistance</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareStandardSupport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standard Support Provided</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details, e.g., email, phone, or online" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareSupportDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="Duration, e.g., one year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareAdditionalSupportCharges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Support Charges</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details of additional fees, if applicable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Agreement Terms</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="softwareWarrantyPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty Period</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of Days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareAgreementDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration of Agreement</FormLabel>
                    <FormControl>
                      <Input placeholder="Specify duration, e.g., one year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareTerminationPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination Notice Period</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of Days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareArbitrationCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City for Arbitration Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="City Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );

    case "software-development":
      return (
        <div className="space-y-8">
          {commonDateField}
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Company Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="softwareDevCompanyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevCompanyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Complete address of company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevClientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevClientAddress"
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
            <h3 className="text-lg font-semibold">Software Development Details</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="softwareDevProjectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of the software project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevProjectScope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Scope</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description of the project scope" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevSpecifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specifications</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Technical specifications" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevTimeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeline</FormLabel>
                    <FormControl>
                      <Input placeholder="Project timeline" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevMilestones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestones</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Project milestones" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevDeliverables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deliverables</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List of deliverables" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevPaymentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="Total payment amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevPaymentSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Schedule</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Payment schedule" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevIpRights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Rights</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Intellectual property rights" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevAcceptanceCriteria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acceptance Criteria</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Acceptance criteria for deliverables" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevTestingProcedure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testing Procedure</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Software testing procedure" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevMaintenanceTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maintenance Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Maintenance terms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevSupportTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Support terms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevConfidentiality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidentiality</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Confidentiality agreement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevTermination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Termination clause" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevIndemnification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indemnification</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Indemnification clause" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevWarranty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Warranty terms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevGoverningLaw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Governing Law</FormLabel>
                    <FormControl>
                      <Input placeholder="Governing law" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="softwareDevDispute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dispute Resolution</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Dispute resolution clause" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );

    case "sales":
      return (
        <div className="space-y-8">
          {commonDateField}
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Seller Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="salesSellerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seller Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of seller" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesSellerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seller Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Complete address of seller" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesBuyerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buyer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of buyer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesBuyerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buyer Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Complete address of buyer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <h3 className="text-lg font-semibold">Sales Details</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="salesProductDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description of the product" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="Quantity of products" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesUnitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Unit price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesTotalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Total price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesDeliveryTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Delivery terms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesDeliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesPaymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Payment terms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesWarranty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Warranty terms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesInspectionPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inspection Period</FormLabel>
                    <FormControl>
                      <Input placeholder="Inspection period" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesQualityStandards"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quality Standards</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Quality standards" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesReturnPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Policy</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Return policy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesLiabilityTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liability Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Liability terms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesForceTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Force Majeure</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Force majeure clause" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesGoverningLaw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Governing Law</FormLabel>
                    <FormControl>
                      <Input placeholder="Governing law" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesArbitrationVenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitration Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="Arbitration venue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesNoticesPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notices Period</FormLabel>
                    <FormControl>
                      <Input placeholder="Notices period" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );

    case "subscription":
      return (
        <div className="space-y-8">
          {commonDateField}
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Issuer Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="subscriptionIssuerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name of issuer" {...field} />
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
                      <Textarea placeholder="Complete address of issuer" {...field} />
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
                      <Input placeholder="Full legal name of subscriber" {...field} />
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
                      <Textarea placeholder="Complete address of subscriber" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <h3 className="text-lg font-semibold">Subscription Details</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="subscriptionNumShares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Shares</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of shares" {...field} />
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
                    <FormLabel>Share Class</FormLabel>
                    <FormControl>
                      <Input placeholder="Share class" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subscriptionPricePerShare"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Share</FormLabel>
                    <FormControl>
                      <Input placeholder="Price per share" {...field} />
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
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="Total amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subscriptionPaymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Input placeholder="Payment method" {...field} />
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
              <FormField
                control={form.control}
                name="subscriptionBoardApprovalDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board Approval Date</FormLabel>
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
                    <FormLabel>Compliance Status</FormLabel>
                    <FormControl>
                      <Input placeholder="Compliance status" {...field} />
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
                    <FormLabel>ROC Filings</FormLabel>
                    <FormControl>
                      <Input placeholder="ROC filings" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subscriptionAllotmentTimeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allotment Timeline</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Allotment timeline" {...field} />
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
                      <Input placeholder="Arbitration city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-8">
          {commonDateField}
        </div>
      );
  }
};

export default function DocumentCreator() {
  const params = useParams<RouteParams>();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const createDocumentMutation = useMutation({
    mutationFn: async (data: FormFields) => {
      try {
        const response = await apiRequest("POST", "/api/documents", {
          title: `${getFormTitle(params.type)} - ${format(new Date(), "yyyy-MM-dd")}`,
          type: params.type,
          content: data,
          status: "draft"
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create document");
        }

        return response.json();
      } catch (error: any) {
        throw new Error(error.message || "Failed to create document");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Success",
        description: "Document created successfully",
      });
      setLocation("/documents");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormFields>({
    resolver: zodResolver(getFormSchema(params.type)),
    defaultValues: getDefaultValues(params.type),
  });

  const onSubmit = async (data: FormFields) => {
    try {
      await createDocumentMutation.mutateAsync(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  if (!params.type) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold text-center">
          Invalid document type
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{getFormTitle(params.type)}</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {renderFormFields(params.type, form)}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/documents")}
              disabled={createDocumentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createDocumentMutation.isPending}
              className="min-w-[120px]"
            >
              {createDocumentMutation.isPending ? (
                <span className="animate-pulse">Creating...</span>
              ) : (
                "Create Agreement"
              )}
            </Button>
          </div>

          {form.formState.errors.root && (
            <p className="text-sm text-red-500 mt-2">
              {form.formState.errors.root.message}
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}