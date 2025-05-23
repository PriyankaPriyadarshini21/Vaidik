import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence, motion } from "framer-motion";
import Navigation from "@/components/layout/navigation";
import {
  AIDocuments,
  AIConsultation,
  DocumentManagement,
  Settings,
  Help,
  DocumentCreator,
  DocumentReview,
  LegalConsultation,
  Pricing,
  Profile,
  DocumentDashboard
} from "@/pages";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/auth";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      {/* Removed Auth route and going directly to the main content */}
      <Route path="*">
        <AnimatePresence mode="wait">
          <motion.div 
            className="flex min-h-screen bg-background"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Navigation />
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto px-4 py-8">
                <Switch>
                  <ProtectedRoute path="/" component={Dashboard} />
                  <ProtectedRoute path="/ai-documents" component={AIDocuments} />
                  <ProtectedRoute path="/ai-consultation" component={AIConsultation} />
                  <ProtectedRoute path="/create/:type" component={DocumentCreator} />
                  <ProtectedRoute path="/documents/new" component={DocumentDashboard} />
                  <ProtectedRoute path="/review" component={DocumentReview} />
                  <ProtectedRoute path="/consultation" component={LegalConsultation} />
                  <ProtectedRoute path="/documents" component={DocumentManagement} />
                  <ProtectedRoute path="/pricing" component={Pricing} />
                  <ProtectedRoute path="/settings" component={Settings} />
                  <ProtectedRoute path="/help" component={Help} />
                  <ProtectedRoute path="/profile" component={Profile} />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </main>
          </motion.div>
        </AnimatePresence>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;