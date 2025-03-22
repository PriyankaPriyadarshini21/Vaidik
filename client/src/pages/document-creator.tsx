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

// Update the FormFields type with new fields for all types
type FormFields = {
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
  terminationNoticePeriod?: string;
  nonPaymentNoticePeriod?: string;
  arbitrationCity?: string;
  //Freelancer Agreement Fields
  freelancerName?: string;
  freelancerAddress?: string;
  endDate?: string;
  compensationAmount?: string;
  paymentTerms?: string;
  deliverables?: string;
  deliverableTimeline?: string;
  // Consulting Agreement Fields
  consultantName?: string;
  consultantType?: "individual" | "entity";
  consultantAddress?: string;
  clientName?: string;
  clientAddress?: string;
  consultingServices?: string;
  additionalServices?: string;
  startDate?: string;
  endDate?: string;
  consultingFee?: string;
  paymentTerms?: "installments" | "lumpsum";
  expenseReimbursement?: "yes" | "no";
  paymentMethod?: string;
  terminationNoticePeriod?: string;
  nonPaymentNoticePeriod?: string;
  arbitrationCity?: string;
};

// Dynamic form schema based on document type
const getFormSchema = (type: string) => {
  switch (type) {
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
      case "employment":
        return "Employee Agreement";
      case "service":
        return "Service Agreement";
      case "freelancer":
        return "Freelancer Agreement";
      case "consulting":
        return "Consulting Agreement";
      default:
        return "Document";
    }
  };

  const renderFormFields = () => {
    switch (type) {
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
                  render={({ field }) => (                    <FormItem>
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