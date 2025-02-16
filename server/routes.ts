import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertDocumentSchema, insertConsultationSchema } from "@shared/schema";

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
  // Document upload endpoint
  app.post("/api/documents/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const document = await storage.uploadDocument(req.file, {
        title: req.body.title || req.file.originalname,
        type: req.body.type || 'unknown',
      });

      res.status(201).json(document);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to upload document" 
      });
    }
  });

  // Documents endpoints
  app.get("/api/documents", async (_req, res) => {
    const documents = await storage.getDocuments();
    res.json(documents);
  });

  app.get("/api/documents/:id", async (req, res) => {
    const document = await storage.getDocument(Number(req.params.id));
    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }
    res.json(document);
  });

  app.post("/api/documents", async (req, res) => {
    const parsed = insertDocumentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid document data" });
      return;
    }
    const document = await storage.createDocument(parsed.data);
    res.status(201).json(document);
  });

  app.patch("/api/documents/:id", async (req, res) => {
    const parsed = insertDocumentSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid document data" });
      return;
    }
    try {
      const document = await storage.updateDocument(Number(req.params.id), parsed.data);
      res.json(document);
    } catch (error) {
      res.status(404).json({ message: "Document not found" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    await storage.deleteDocument(Number(req.params.id));
    res.status(204).send();
  });

  // AI Consultation endpoints
  app.get("/api/consultations", async (_req, res) => {
    const consultations = await storage.getConsultations();
    res.json(consultations);
  });

  app.post("/api/consultations", async (req, res) => {
    const parsed = insertConsultationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid consultation data" });
      return;
    }
    const consultation = await storage.createConsultation(parsed.data);
    res.status(201).json(consultation);
  });

  // Serve uploaded files
  app.get('/api/preview/:filename', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'uploads', req.params.filename));
  });

  const httpServer = createServer(app);
  return httpServer;
}