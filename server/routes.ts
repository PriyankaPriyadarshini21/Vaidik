import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertDocumentSchema, insertConsultationSchema, insertPricingPlanSchema, insertUserSubscriptionSchema } from "@shared/schema";
import { setupAuth } from "./auth";

// Authentication middleware
function isAuthenticated(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export function registerRoutes(app: Express): Server {
  // Set up authentication routes
  setupAuth(app);

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
    const parsed = insertDocumentSchema.safeParse({
      ...req.body,
      userId: req.user!.id
    });
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid document data" });
      return;
    }
    const document = await storage.createDocument(parsed.data);
    res.status(201).json(document);
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

  // Protected file preview
  app.get('/api/preview/:filename', isAuthenticated, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'uploads', req.params.filename));
  });

  const httpServer = createServer(app);
  return httpServer;
}