import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
    
    // Add an interface for authenticated requests (for TypeScript type checking)
    interface AuthenticatedRequest extends Request {
      user: User;
    }
    
    // Extend Request interface to fix TypeScript errors
    interface Request {
      // Define isAuthenticated return type as a type predicate
      isAuthenticated(): this is AuthenticatedRequest;
    }
  }
}

const scryptAsync = promisify(scrypt);

// Export these functions for use in routes
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // For development, use a simplified session setup without Passport
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: true, // Changed to true for development
    store: storage.sessionStore,
    name: 'vidhik.sid',
    cookie: {
      secure: false, // Changed to false for development
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    }
  };

  // Create a mock user for development
  const mockUser = {
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

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  
  // Skip Passport initialization and instead use our own auth bypass
  // app.use(passport.initialize());
  // app.use(passport.session());
  
  // Add a custom middleware to set the user for all requests
  app.use((req, res, next) => {
    req.user = mockUser;
    // Type predicate version of isAuthenticated
    req.isAuthenticated = function(this: Express.Request): this is Express.AuthenticatedRequest {
      return true;
    };
    next();
  });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }
        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login after registration failed" });
        }
        const { password: _, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        message: error.message || "Failed to register user"
      });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error | null, user: Express.User | false, info: { message: string } | undefined) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }
        const { password: _, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
          return res.status(500).json({ message: "Logout failed" });
        }
        req.logout(() => {
          res.clearCookie('vidhik.sid');
          res.status(200).json({ message: "Logged out successfully" });
        });
      });
    } else {
      res.status(200).json({ message: "Already logged out" });
    }
  });

  // Modified API user endpoint to always return the mock user
  app.get("/api/user", (req, res) => {
    // Always return the mock user, no authentication check needed
    const { password: _, ...userWithoutPassword } = mockUser;
    res.json(userWithoutPassword);
  });
}