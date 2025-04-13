import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";

// NOTE: We don't need to modify the Request interface as passport already extends it
// This is just a simple mock solution for development
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertDocumentSchema, insertConsultationSchema, insertPricingPlanSchema, insertUserSubscriptionSchema, updateProfileSchema } from "@shared/schema";
import { setupAuth, comparePasswords, hashPassword } from "./auth";
import * as z from 'zod';

// Import LLM functions
import { analyzeLegalDocument, extractTextFromPDF } from "./llm";

// Create a mock user object for development
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

// Bypass authentication completely and use mock user
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // Simply attach the mock user to the request and continue
  req.user = mockUser;
  next();
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/avatars/',
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed formats: JPG, PNG, PDF, DOC, DOCX, TXT'));
    }
  },
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit to accommodate larger documents
  }
});

// Password update schema
const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function registerRoutes(app: Express): Server {
  // Set up authentication routes
  setupAuth(app);
  
  // User profile endpoint
  app.get("/api/user", isAuthenticated, async (req, res) => {
    try {
      // Return the authenticated user from the session
      res.json(req.user);
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Failed to get user profile"
      });
    }
  });

  // Profile update endpoint
  app.patch("/api/user/profile", isAuthenticated, async (req, res) => {
    try {
      const parsed = updateProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          message: "Invalid profile data",
          errors: parsed.error.errors 
        });
      }

      const updatedUser = await storage.updateUser(req.user!.id, parsed.data);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Failed to update profile"
      });
    }
  });

  // Avatar upload endpoint
  app.patch("/api/user/avatar", isAuthenticated, upload.single('avatar'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await storage.updateUserAvatar(req.user!.id, req.file.filename);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Failed to upload avatar"
      });
    }
  });

  // Document upload endpoint - protected by auth
  app.post("/api/documents/upload", isAuthenticated, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const document = await storage.uploadDocument(req.file, {
        title: req.body.title || req.file.originalname,
        type: req.body.type || 'unknown',
        userId: req.user!.id, // Get userId from authenticated user
      });

      res.status(201).json(document);
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Failed to upload document"
      });
    }
  });

  // Protected document routes
  app.get("/api/documents", isAuthenticated, async (req, res) => {
    const documents = await storage.getDocuments(req.user!.id);
    res.json(documents);
  });

  app.get("/api/documents/:id", isAuthenticated, async (req, res) => {
    const document = await storage.getDocument(Number(req.params.id), req.user!.id);
    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }
    res.json(document);
  });

  app.post("/api/documents", isAuthenticated, async (req, res) => {
    try {
      const parsed = insertDocumentSchema.safeParse({
        ...req.body,
        userId: req.user!.id
      });

      if (!parsed.success) {
        return res.status(400).json({ 
          message: "Invalid document data",
          errors: parsed.error.errors
        });
      }

      const document = await storage.createDocument(parsed.data);
      res.status(201).json(document);
    } catch (error: any) {
      console.error('Document creation error:', error);
      res.status(500).json({ 
        message: error.message || "Failed to create document"
      });
    }
  });

  app.patch("/api/documents/:id", isAuthenticated, async (req, res) => {
    const parsed = insertDocumentSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid document data" });
      return;
    }
    try {
      const document = await storage.updateDocument(Number(req.params.id), parsed.data, req.user!.id);
      res.json(document);
    } catch (error) {
      res.status(404).json({ message: "Document not found" });
    }
  });

  app.delete("/api/documents/:id", isAuthenticated, async (req, res) => {
    await storage.deleteDocument(Number(req.params.id), req.user!.id);
    res.status(204).send();
  });

  // Document download endpoint
  app.get("/api/documents/:id/download", isAuthenticated, async (req, res) => {
    try {
      const document = await storage.getDocument(Number(req.params.id), req.user!.id);
      if (!document || !document.filename) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Send the file
      const filePath = path.join(process.cwd(), 'uploads', document.filename);
      res.download(filePath, document.filename, (err) => {
        if (err) {
          console.error('Download error:', err);
          // Only send error if headers haven't been sent yet
          if (!res.headersSent) {
            res.status(500).json({ message: "Error downloading file" });
          }
        }
      });
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ message: "Could not process download request" });
    }
  });

  // Document export endpoint
  app.get("/api/documents/:id/export", isAuthenticated, async (req, res) => {
    try {
      const document = await storage.getDocument(Number(req.params.id), req.user!.id);
      if (!document || !document.filename) {
        return res.status(404).json({ message: "Document not found" });
      }

      const filePath = path.join(process.cwd(), 'uploads', document.filename);
      res.download(filePath, `${document.title}.pdf`, (err) => {
        if (err) {
          console.error('Export error:', err);
          if (!res.headersSent) {
            res.status(500).json({ message: "Error exporting file" });
          }
        }
      });
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ message: "Could not process export request" });
    }
  });
  
  // Document analysis with LLM
  app.post("/api/documents/analyze", isAuthenticated, async (req, res) => {
    try {
      const { documentId, content, model } = req.body;
      
      if (!documentId && !content) {
        return res.status(400).json({ 
          message: "Either documentId or content is required"
        });
      }
      
      // If documentId is provided, get the document
      let documentContent = content;
      let document;
      
      if (documentId) {
        document = await storage.getDocument(Number(documentId), req.user!.id);
        if (!document) {
          return res.status(404).json({ message: "Document not found" });
        }
        
        // Check if the document file exists
        if (document.filename) {
          const filePath = path.join(process.cwd(), 'uploads', document.filename);
          try {
            // Extract content from file based on type
            const ext = path.extname(document.filename).toLowerCase();
            if (ext === '.pdf') {
              // Use the PDF extraction function
              documentContent = await extractTextFromPDF(filePath);
            } else {
              // For now, we'll use the content parameter for other file types
              // In production, we'd implement extractors for other formats
              if (!content) {
                documentContent = `This is placeholder content for the ${ext} file: ${document.title}`;
              }
            }
          } catch (error) {
            console.error('Error extracting document content:', error);
            return res.status(500).json({ message: "Could not extract document content" });
          }
        } else {
          return res.status(400).json({ message: "Document has no associated file" });
        }
      }
      
      // Get analysis from LLM based on model selection
      const analysis = await analyzeLegalDocument(documentContent, model);
      
      res.json(analysis);
    } catch (error: any) {
      console.error('Document analysis error:', error);
      res.status(500).json({ 
        message: error.message || "Could not analyze document"
      });
    }
  });

  // Preview endpoint (updated with error handling)
  app.get('/api/preview/:filename', isAuthenticated, (req, res) => {
    try {
      const filePath = path.join(process.cwd(), 'uploads', req.params.filename);
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Preview error:', err);
          if (!res.headersSent) {
            res.status(500).json({ message: "Error previewing file" });
          }
        }
      });
    } catch (error) {
      console.error('Preview error:', error);
      res.status(500).json({ message: "Could not process preview request" });
    }
  });

  // Consultation endpoints - protected
  app.get("/api/consultations", isAuthenticated, async (req, res) => {
    const consultations = await storage.getConsultations(req.user!.id);
    res.json(consultations);
  });

  app.post("/api/consultations", isAuthenticated, async (req, res) => {
    const parsed = insertConsultationSchema.safeParse({
      ...req.body,
      userId: req.user!.id
    });
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid consultation data" });
      return;
    }
    const consultation = await storage.createConsultation(parsed.data);
    res.status(201).json(consultation);
  });
  
  // New endpoint for AI legal consultation
  app.post("/api/legal-consultation", isAuthenticated, async (req, res) => {
    try {
      const { question, model, context } = req.body;
      
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ message: "Question is required" });
      }
      
      // Validate model if provided
      const validModels = ['openai', 'claude', 'ollama'];
      const selectedModel = model && validModels.includes(model) ? model : 'openai';
      
      // Get response from LLM service
      const { getLegalConsultation } = require('./llm');
      const consultationResponse = await getLegalConsultation(
        question, 
        selectedModel, 
        context
      );
      
      // Log the consultation (optional)
      try {
        await storage.createConsultation({
          userId: req.user!.id,
          question,
          response: JSON.stringify(consultationResponse),
          status: 'completed',
        });
      } catch (logError) {
        console.error('Error saving consultation log:', logError);
        // Continue even if logging fails
      }
      
      res.json(consultationResponse);
    } catch (error: any) {
      console.error('Legal consultation error:', error);
      res.status(500).json({ 
        message: "Error processing legal consultation",
        error: error.message,
      });
    }
  });
  
  // Get expert availability
  app.get("/api/experts/:expertId/availability", isAuthenticated, async (req, res) => {
    try {
      const { expertId } = req.params;
      const { date } = req.query;
      
      // In a real app, this would fetch from the database
      // For now, return mock data
      res.json({
        expertId: Number(expertId),
        date: date || new Date().toISOString().split('T')[0],
        availableSlots: [
          "09:00 AM", 
          "10:00 AM", 
          "02:00 PM", 
          "03:00 PM"
        ]
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error fetching expert availability",
        error: error.message,
      });
    }
  });

  // Public pricing plans endpoints
  app.get("/api/pricing-plans", async (_req, res) => {
    try {
      const plans = await storage.getPricingPlans();
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Protected subscription endpoints
  app.get("/api/users/:userId/subscription", isAuthenticated, async (req, res) => {
    try {
      // Only allow users to access their own subscription
      if (Number(req.params.userId) !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const subscription = await storage.getUserSubscription(req.user!.id);
      if (!subscription) {
        res.status(404).json({ message: "No active subscription found" });
        return;
      }
      res.json(subscription);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Password update endpoint
  app.post("/api/user/password", isAuthenticated, async (req, res) => {
    try {
      const parsed = updatePasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          message: "Invalid password data",
          errors: parsed.error.errors 
        });
      }

      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isValidPassword = await comparePasswords(parsed.data.currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const hashedPassword = await hashPassword(parsed.data.newPassword);
      const updatedUser = await storage.updateUser(req.user!.id, { 
        password: hashedPassword,
        updatedAt: new Date()
      });

      res.json({ message: "Password updated successfully" });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Failed to update password"
      });
    }
  });

  // 2FA settings endpoint
  app.post("/api/user/2fa", isAuthenticated, async (req, res) => {
    try {
      const { enabled } = req.body;

      const updatedUser = await storage.updateUser(req.user!.id, {
        twoFactorEnabled: enabled,
        updatedAt: new Date()
      });

      res.json({ message: "2FA settings updated successfully", enabled });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Failed to update 2FA settings"
      });
    }
  });

  // Notification preferences endpoint
  app.post("/api/user/notifications", isAuthenticated, async (req, res) => {
    try {
      const { emailEnabled, smsEnabled } = req.body;

      const updatedUser = await storage.updateUser(req.user!.id, {
        emailNotificationsEnabled: emailEnabled,
        smsNotificationsEnabled: smsEnabled,
        updatedAt: new Date()
      });

      res.json({ 
        message: "Notification preferences updated successfully",
        emailEnabled,
        smsEnabled
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Failed to update notification preferences"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}