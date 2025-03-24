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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ReactNode } from "react";

// Type definitions for form fields
type FormFields = {
  // Common Fields
  dateOfAgreement?: string;

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
  marketingServiceProvider?: string;
  marketingServiceProviderAddress?: string;
  marketingClientName?: string;
  marketingClientAddress?: string;
  marketingServicesScope?: string;
  marketingCampaignObjectives?: string;
  marketingTargetAudience?: string;
  marketingChannels?: string;
  marketingDeliverables?: string;
  marketingTimeline?: string;
  marketingKPIs?: string;
  marketingReportingFrequency?: string;
  marketingBudget?: string;
  marketingPaymentTerms?: string;
  marketingIntellectualProperty?: string;
  marketingContentRights?: string;
  marketingConfidentiality?: string;
  marketingTermination?: string;
  marketingIndemnification?: string;
  marketingGoverningLaw?: string;
  marketingDispute?: string;

  // DPA Fields
  dpaProcessorName?: string;
  dpaProcessorAddress?: string;
  dpaControllerName?: string;
  dpaControllerAddress?: string;
  dpaDataTypes?: string;
  dpaDataSubjects?: string;
  dpaProcessingPurpose?: string;
  dpaProcessingDuration?: string;
  dpaSecurityMeasures?: string;
  dpaSubProcessors?: string;
  dpaSubProcessorRequirements?: string;
  dpaDataBreachNotification?: string;
  dpaBreachTimeline?: string;
  dpaDataTransfers?: string;
  dpaDataProtectionImpact?: string;
  dpaAudits?: string;
  dpaConfidentiality?: string;
  dpaDataDeletion?: string;
  dpaTermination?: string;
  dpaGoverningLaw?: string;
  dpaLiability?: string;
  dpaComplianceRequirements?: string;
};

interface RouteParams {
  type: string;
}

// Helper functions
const getFormSchema = (type: string) => {
  switch (type) {
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
        marketingServiceProvider: z.string().min(1, "Service provider name is required"),
        marketingServiceProviderAddress: z.string().min(1, "Service provider address is required"),
        marketingClientName: z.string().min(1, "Client name is required"),
        marketingClientAddress: z.string().min(1, "Client address is required"),
        marketingServicesScope: z.string().min(1, "Services scope is required"),
        marketingCampaignObjectives: z.string().min(1, "Campaign objectives are required"),
        marketingTargetAudience: z.string().min(1, "Target audience is required"),
        marketingChannels: z.string().min(1, "Marketing channels are required"),
        marketingDeliverables: z.string().min(1, "Deliverables are required"),
        marketingTimeline: z.string().min(1, "Timeline is required"),
        marketingKPIs: z.string().min(1, "KPIs are required"),
        marketingReportingFrequency: z.string().min(1, "Reporting frequency is required"),
        marketingBudget: z.string().min(1, "Budget is required"),
        marketingPaymentTerms: z.string().min(1, "Payment terms are required"),
        marketingIntellectualProperty: z.string().min(1, "IP terms are required"),
        marketingContentRights: z.string().min(1, "Content rights are required"),
        marketingConfidentiality: z.string().min(1, "Confidentiality terms are required"),
        marketingTermination: z.string().min(1, "Termination terms are required"),
        marketingIndemnification: z.string().min(1, "Indemnification terms are required"),
        marketingGoverningLaw: z.string().min(1, "Governing law is required"),
        marketingDispute: z.string().min(1, "Dispute resolution terms are required"),
      });
    case "dpa":
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        dpaProcessorName: z.string().min(1, "Processor name is required"),
        dpaProcessorAddress: z.string().min(1, "Processor address is required"),
        dpaControllerName: z.string().min(1, "Controller name is required"),
        dpaControllerAddress: z.string().min(1, "Controller address is required"),
        dpaDataTypes: z.string().min(1, "Data types are required"),
        dpaDataSubjects: z.string().min(1, "Data subjects are required"),
        dpaProcessingPurpose: z.string().min(1, "Processing purpose is required"),
        dpaProcessingDuration: z.string().min(1, "Processing duration is required"),
        dpaSecurityMeasures: z.string().min(1, "Security measures are required"),
        dpaSubProcessors: z.string().min(1, "Sub-processor information is required"),
        dpaSubProcessorRequirements: z.string().min(1, "Sub-processor requirements are required"),
        dpaDataBreachNotification: z.string().min(1, "Data breach notification procedure is required"),
        dpaBreachTimeline: z.string().min(1, "Breach notification timeline is required"),
        dpaDataTransfers: z.string().min(1, "Data transfer details are required"),
        dpaDataProtectionImpact: z.string().min(1, "Data protection impact is required"),
        dpaAudits: z.string().min(1, "Audit procedures are required"),
        dpaConfidentiality: z.string().min(1, "Confidentiality terms are required"),
        dpaDataDeletion: z.string().min(1, "Data deletion procedures are required"),
        dpaTermination: z.string().min(1, "Termination terms are required"),
        dpaGoverningLaw: z.string().min(1, "Governing law is required"),
        dpaLiability: z.string().min(1, "Liability terms are required"),
        dpaComplianceRequirements: z.string().min(1, "Compliance requirements are required"),
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
                  <FormItem>
                    <FormLabel>Freelancer Name</FormLabel>
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