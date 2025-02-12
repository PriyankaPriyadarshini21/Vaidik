import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/layout/navigation";
import DocumentDashboard from "@/pages/document-dashboard";
import AIConsultation from "@/pages/ai-consultation";
import DocumentReview from "@/pages/document-review";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={DocumentDashboard} />
          <Route path="/consultation" component={AIConsultation} />
          <Route path="/review" component={DocumentReview} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;