import { HelpSupport } from "@/components/HelpSupport";

export default function Help() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Help & Support</h1>
        <p className="text-muted-foreground">
          Get help with using the platform and find answers to common questions
        </p>
      </div>
      <HelpSupport />
    </div>
  );
}