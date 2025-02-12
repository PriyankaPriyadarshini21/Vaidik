import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDocumentSchema, insertConsultationSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
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

  const httpServer = createServer(app);
  return httpServer;
}
