import { Route } from "wouter";

// Modified to bypass authentication for now
export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  // Directly render the component without authentication checks
  return <Route path={path} component={Component} />;
}
