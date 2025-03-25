import { useParams, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
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

// Type definitions
interface RouteParams {
  type: string;
}

interface FormFields {
  // Common Fields
  dateOfAgreement?: string;

  // Service Agreement Fields
  serviceCompanyName?: string;
  serviceCompanyType?: string;
  serviceCompanyAddress?: string;
  serviceCompanyTitle?: string;
  serviceClientName?: string;
  serviceClientAddress?: string;
  serviceClientTitle?: string;
  serviceDescription?: string;
  serviceStartDate?: string;
  serviceEndDate?: string;
  serviceFee?: string;
  servicePaymentSchedule?: string;
  serviceExpenseReimbursement?: "yes" | "no";
  servicePaymentMode?: string;
  serviceTerminationNoticePeriod?: string;
  serviceTerminationNonPayment?: string;
  serviceArbitrationCity?: string;

  // Consulting Agreement Fields
  consultingConsultantName?: string;
  consultingConsultantType?: string;
  consultingConsultantAddress?: string;
  consultingClientName?: string;
  consultingClientAddress?: string;
  consultingServicesDescription?: string;
  consultingAdditionalServices?: string;
  consultingStartDate?: string;
  consultingEndDate?: string;
  consultingFee?: string;
  consultingPaymentTerms?: string;
  consultingExpenseReimbursement?: "yes" | "no";
  consultingPaymentMethod?: string;
  consultingTerminationNoticePeriod?: string;
  consultingTerminationNonPayment?: string;
  consultingArbitrationCity?: string;
}

interface FormProps {
  form: UseFormReturn<FormFields>;
  type: string;
}

// Helper function to get form schema
const getFormSchema = (type: string) => {
  switch (type) {
    case "service": {
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        serviceCompanyName: z.string().min(1, "Company name is required"),
        serviceCompanyType: z.string().min(1, "Company type is required"),
        serviceCompanyAddress: z.string().min(1, "Company address is required"),
        serviceCompanyTitle: z.string().min(1, "Company title is required"),
        serviceClientName: z.string().min(1, "Client name is required"),
        serviceClientAddress: z.string().min(1, "Client address is required"),
        serviceClientTitle: z.string().min(1, "Client title is required"),
        serviceDescription: z.string().min(1, "Service description is required"),
        serviceStartDate: z.string().min(1, "Start date is required"),
        serviceEndDate: z.string().min(1, "End date is required"),
        serviceFee: z.string().min(1, "Service fee is required"),
        servicePaymentSchedule: z.string().min(1, "Payment schedule is required"),
        serviceExpenseReimbursement: z.enum(["yes", "no"]),
        servicePaymentMode: z.string().min(1, "Payment mode is required"),
        serviceTerminationNoticePeriod: z.string().min(1, "Termination notice period is required"),
        serviceTerminationNonPayment: z.string().min(1, "Non-payment termination period is required"),
        serviceArbitrationCity: z.string().min(1, "Arbitration city is required"),
      });
    }
    case "consulting": {
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
        consultingConsultantName: z.string().min(1, "Consultant's name is required"),
        consultingConsultantType: z.string().min(1, "Consultant's type is required"),
        consultingConsultantAddress: z.string().min(1, "Consultant's address is required"),
        consultingClientName: z.string().min(1, "Client's name is required"),
        consultingClientAddress: z.string().min(1, "Client's address is required"),
        consultingServicesDescription: z.string().min(1, "Description of services is required"),
        consultingAdditionalServices: z.string(),
        consultingStartDate: z.string().min(1, "Start date is required"),
        consultingEndDate: z.string().min(1, "End date is required"),
        consultingFee: z.string().min(1, "Consulting fee is required"),
        consultingPaymentTerms: z.string().min(1, "Payment terms are required"),
        consultingExpenseReimbursement: z.enum(["yes", "no"]),
        consultingPaymentMethod: z.string().min(1, "Payment method is required"),
        consultingTerminationNoticePeriod: z.string().min(1, "Termination notice period is required"),
        consultingTerminationNonPayment: z.string().min(1, "Non-payment termination period is required"),
        consultingArbitrationCity: z.string().min(1, "Arbitration city is required"),
      });
    }
    default: {
      return z.object({
        dateOfAgreement: z.string().min(1, "Date is required"),
      });
    }
  }
};

// Helper function to get form title
const getFormTitle = (type: string) => {
  switch (type) {
    case "consulting":
      return "Consulting Agreement";
    case "service":
      return "Service Agreement";
    default:
      return "Create Agreement";
  }
};

// Form fields rendering component
const renderFormFields = ({ type, form }: FormProps): ReactNode => {
  // Define the common date field that will be used across all forms
  const CommonDateField = (
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
    case "service": {
      return (
        <div className="space-y-8">
          {CommonDateField}

          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Company Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="serviceCompanyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name of the Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceCompanyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company's Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceCompanyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Address of the Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceCompanyTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company's Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title, e.g., CEO, Manager" {...field} />
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
                    <FormLabel>Client's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name of the Client" {...field} />
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
                    <FormLabel>Client's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Address of the Client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceClientTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client's Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Client's Title, e.g., Owner, Manager" {...field} />
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
                    <FormLabel>Description of Services</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details of Services to be Provided" {...field} />
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
                      <FormLabel>Start Date of Agreement</FormLabel>
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
                      <FormLabel>End Date of Agreement</FormLabel>
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
                name="serviceFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Fee (₹)</FormLabel>
                    <FormControl>
                      <Input placeholder="Amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="servicePaymentSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Schedule</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details of Payment Schedule (Installments/Lump Sum)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceExpenseReimbursement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reimbursement for Pre-Approved Expenses</FormLabel>
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
                name="servicePaymentMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode of Payment</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Termination Terms</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="serviceTerminationNoticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination Notice Period (Either Party)</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of Days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceTerminationNonPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination Notice Period (Company for Non-Payment)</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of Days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceArbitrationCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Governing City (Arbitration Venue)</FormLabel>
                    <FormControl>
                      <Input placeholder="City for Arbitration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );
    }
    case "consulting": {
      return (
        <div className="space-y-8">
          {CommonDateField}

          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Consultant Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="consultingConsultantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultant's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name of the Consultant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultingConsultantType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultant's Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select consultant type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="entity">Entity</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultingConsultantAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultant's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Consultant's Address" {...field} />
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
                name="consultingClientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name of the Client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultingClientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client's Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Client's Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Services & Duration</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="consultingServicesDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description of Consulting Services</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details of Consulting Services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultingAdditionalServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Consulting Services (If Any)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional Services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="consultingStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date of Agreement</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consultingEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date of Agreement</FormLabel>
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
                name="consultingFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consulting Fee (₹)</FormLabel>
                    <FormControl>
                      <Input placeholder="Amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultingPaymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Payment Schedule (Installments or Lump Sum)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultingExpenseReimbursement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reimbursement for Pre-Approved Expenses</FormLabel>
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
                name="consultingPaymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold">Termination Terms</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="consultingTerminationNoticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination Notice Period (Either Party)</FormLabel>
                    <FormControl>
                      <Input placeholder="Notice Period in Days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultingTerminationNonPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination Notice Period (Consultant for Non-Payment)</FormLabel>
                    <FormControl>
                      <Input placeholder="Notice Period in Days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultingArbitrationCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Governing City (Arbitration Venue)</FormLabel>
                    <FormControl>
                      <Input placeholder="City for Arbitration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      );
    }
    default: {
      return (
        <div className="space-y-8">
          {CommonDateField}
          <div className="grid gap-4">
            <p>This agreement type is not yet implemented.</p>
          </div>
        </div>
      );
    }
  }
};

// Main component
export default function DocumentCreator() {
  const params = useParams<RouteParams>();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const formSchema = getFormSchema(params.type);

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const createDocumentMutation = useMutation({
    mutationFn: async (data: FormFields) => {
      const response = await apiRequest("POST", "/api/documents", {
        title: `${getFormTitle(params.type)} - ${format(new Date(), "yyyy-MM-dd")}`,
        type: params.type,
        content: data,
        status: "draft",
      });
      return response.json();
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

  const onSubmit = async (data: FormFields) => {
    await createDocumentMutation.mutateAsync(data);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{getFormTitle(params.type)}</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {renderFormFields({ type: params.type, form })}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/documents")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createDocumentMutation.isPending}>
              {createDocumentMutation.isPending ? "Creating..." : "Create Agreement"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}