import { 
  Document, InsertDocument, 
  Consultation, InsertConsultation,
  documents,
  consultations,
  users,
  pricingPlans,
  userSubscriptions,
  PricingPlan,
  InsertPricingPlan,
  UserSubscription,
  InsertUserSubscription
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Document operations
  getDocuments(): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocument(id: number, doc: Partial<InsertDocument>): Promise<Document>;
  deleteDocument(id: number): Promise<void>;
  uploadDocument(file: Express.Multer.File, metadata: Partial<InsertDocument>): Promise<Document>;

  // Consultation operations
  getConsultations(): Promise<Consultation[]>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;

  // Pricing plan operations
  getPricingPlans(): Promise<PricingPlan[]>;
  createPricingPlan(plan: InsertPricingPlan): Promise<PricingPlan>;
  getUserSubscription(userId: number): Promise<UserSubscription | undefined>;
  createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;

  // Session store for authentication
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documents);
  }

  async getDocument(id: number): Promise<Document | undefined> {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc;
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [newDoc] = await db.insert(documents).values(doc).returning();
    return newDoc;
  }

  async updateDocument(id: number, doc: Partial<InsertDocument>): Promise<Document> {
    const [updatedDoc] = await db
      .update(documents)
      .set({ ...doc, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();

    if (!updatedDoc) {
      throw new Error("Document not found");
    }

    return updatedDoc;
  }

  async deleteDocument(id: number): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  async uploadDocument(file: Express.Multer.File, metadata: Partial<InsertDocument>): Promise<Document> {
    const doc: InsertDocument = {
      title: metadata.title || file.originalname,
      type: metadata.type || 'unknown',
      content: {},
      status: 'draft',
      userId: metadata.userId!,
      filename: file.originalname,
      fileSize: `${Math.round(file.size / 1024)} KB`,
      fileUrl: `/uploads/${file.filename}`, // This would be a real URL in production
    };

    return this.createDocument(doc);
  }

  async getConsultations(): Promise<Consultation[]> {
    return await db.select().from(consultations);
  }

  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const [newConsultation] = await db
      .insert(consultations)
      .values(consultation)
      .returning();
    return newConsultation;
  }

  // New methods for pricing plans and subscriptions
  async getPricingPlans(): Promise<PricingPlan[]> {
    return await db.select().from(pricingPlans);
  }

  async createPricingPlan(plan: InsertPricingPlan): Promise<PricingPlan> {
    const [newPlan] = await db.insert(pricingPlans).values(plan).returning();
    return newPlan;
  }

  async getUserSubscription(userId: number): Promise<UserSubscription | undefined> {
    const [subscription] = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .orderBy(userSubscriptions.createdAt, "desc");
    return subscription;
  }

  async createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    const [newSubscription] = await db
      .insert(userSubscriptions)
      .values(subscription)
      .returning();
    return newSubscription;
  }
}

export const storage = new DatabaseStorage();