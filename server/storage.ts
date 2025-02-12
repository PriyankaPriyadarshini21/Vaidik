import { 
  Document, InsertDocument, 
  Consultation, InsertConsultation 
} from "@shared/schema";

export interface IStorage {
  // Document operations
  getDocuments(): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocument(id: number, doc: Partial<InsertDocument>): Promise<Document>;
  deleteDocument(id: number): Promise<void>;

  // Consultation operations
  getConsultations(): Promise<Consultation[]>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
}

export class MemStorage implements IStorage {
  private documents: Map<number, Document>;
  private consultations: Map<number, Consultation>;
  private docId: number;
  private consultId: number;

  constructor() {
    this.documents = new Map();
    this.consultations = new Map();
    this.docId = 1;
    this.consultId = 1;
  }

  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const id = this.docId++;
    const document: Document = {
      ...doc,
      id,
      createdAt: new Date(),
      status: doc.status || "draft"  // Ensure status is set
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, doc: Partial<InsertDocument>): Promise<Document> {
    const existing = this.documents.get(id);
    if (!existing) throw new Error("Document not found");

    const updated: Document = {
      ...existing,
      ...doc,
      status: doc.status || existing.status
    };
    this.documents.set(id, updated);
    return updated;
  }

  async deleteDocument(id: number): Promise<void> {
    this.documents.delete(id);
  }

  async getConsultations(): Promise<Consultation[]> {
    return Array.from(this.consultations.values());
  }

  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const id = this.consultId++;
    const newConsultation: Consultation = {
      ...consultation,
      id,
      createdAt: new Date()
    };
    this.consultations.set(id, newConsultation);
    return newConsultation;
  }
}

export const storage = new MemStorage();