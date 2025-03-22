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

// Update the FormFields type with new fields
type FormFields = {
  title: string;
  description?: string;
  dateOfAgreement: string;
  companyName: string;
  employerAddress: string;
  employeeFullName: string;
  employeeAddress: string;
  jobTitle: string;
  startDate: string;
  baseSalary: string;
  salaryFrequency: "monthly" | "yearly";
  bonusDetails: string;
  benefits: string;
  workHoursPerWeek: string;
  workStartTime: string;
  workEndTime: string;
  nonCompetePeriod: string;
  nonSolicitationPeriod: string;
  employerNoticePeriod: string;
  employeeNoticePeriod: string;
  governingLocation: string;
};

// Dynamic form schema based on document type
const getFormSchema = (type: string) => {
  const baseSchema = {
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
  };

  switch (type) {
    case "employment":
      return z.object({
        ...baseSchema,
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
    default:
      return z.object(baseSchema);
  }
};

export default function DocumentCreator() {
  const { type } = useParams<{ type: string }>();
  const { toast } = useToast();

  // Create form schema based on document type
  const formSchema = getFormSchema(type || "");

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
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
          Create Employee Agreement
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to generate your employee agreement
        </p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter document description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderFormFields()}

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Generating Agreement..."
                : "Generate Employee Agreement"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}