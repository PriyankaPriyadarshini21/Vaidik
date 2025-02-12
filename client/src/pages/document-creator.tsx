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
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Dynamic form schema based on document type
const getFormSchema = (type: string) => {
  const baseSchema = {
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
  };

  switch (type) {
    case "nda":
      return z.object({
        ...baseSchema,
        partyOne: z.string().min(1, "First party name is required"),
        partyTwo: z.string().min(1, "Second party name is required"),
        duration: z.string().min(1, "Duration is required"),
        confidentialityLevel: z.enum(["standard", "strict", "very-strict"]),
      });
    case "employment":
      return z.object({
        ...baseSchema,
        employerName: z.string().min(1, "Employer name is required"),
        employeeName: z.string().min(1, "Employee name is required"),
        position: z.string().min(1, "Position is required"),
        startDate: z.string().min(1, "Start date is required"),
        compensation: z.string().min(1, "Compensation is required"),
      });
    default:
      return z.object(baseSchema);
  }
};

// Type inference helper
type FormSchema<T extends string> = z.infer<ReturnType<typeof getFormSchema>>;

export default function DocumentCreator() {
  const { type } = useParams<{ type: string }>();
  const { toast } = useToast();

  // Create form schema based on document type
  const formSchema = getFormSchema(type || "");
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      ...(type === "nda" && {
        partyOne: "",
        partyTwo: "",
        duration: "",
        confidentialityLevel: "standard",
      }),
      ...(type === "employment" && {
        employerName: "",
        employeeName: "",
        position: "",
        startDate: "",
        compensation: "",
      }),
    },
  });

  const onSubmit = async (values: FormValues) => {
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
      case "nda":
        return (
          <>
            <FormField
              control={form.control}
              name="partyOne"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Party</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first party name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partyTwo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Second Party</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter second party name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter agreement duration" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confidentialityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confidentiality Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="strict">Strict</SelectItem>
                      <SelectItem value="very-strict">Very Strict</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case "employment":
        return (
          <>
            <FormField
              control={form.control}
              name="employerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter employer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employeeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter employee name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter job position" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="compensation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compensation</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter compensation details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Create {type.toUpperCase()} Document
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to generate your document
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
                ? "Generating Document..."
                : "Generate Document"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}