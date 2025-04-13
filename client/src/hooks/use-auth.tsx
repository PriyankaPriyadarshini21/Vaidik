import { createContext, ReactNode, useContext } from "react";
import { type User as SelectUser, type InsertUser } from "@shared/schema";

// Mock auth context type
type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: any;
  logoutMutation: any;
  registerMutation: any;
};

// Mock user data
const mockUser: SelectUser = {
  id: 1,
  username: "demo_user",
  email: "demo@example.com",
  password: "hashed_password",
  fullName: "Demo User",
  company: "Demo Company",
  phone: "555-1234",
  isEmailVerified: true,
  avatarUrl: null,
  twoFactorEnabled: false,
  emailNotificationsEnabled: true,
  smsNotificationsEnabled: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Mock authentication context
const mockAuthContext: AuthContextType = {
  user: mockUser,
  isLoading: false,
  error: null,
  loginMutation: {
    mutate: () => {},
    isPending: false,
    error: null
  },
  logoutMutation: {
    mutate: () => {},
    isPending: false,
    error: null
  },
  registerMutation: {
    mutate: () => {},
    isPending: false,
    error: null 
  }
};

// Create auth context with mock data
const AuthContext = createContext<AuthContextType>(mockAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}