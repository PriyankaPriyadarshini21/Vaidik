import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/layout/navigation";
import {
  AIDocuments,
  DocumentManagement,
  Settings,
  Help,
  DocumentCreator,
  DocumentReview,
  LegalConsultation,
  Pricing
} from "@/pages";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/ai-documents" component={AIDocuments} />
            <Route path="/create/:type" component={DocumentCreator} />
            <Route path="/review" component={DocumentReview} />
            <Route path="/consultation" component={LegalConsultation} />
            <Route path="/documents" component={DocumentManagement} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/settings" component={Settings} />
            <Route path="/help" component={Help} />
            <Route component={NotFound} />
          </Switch>
        </div>
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