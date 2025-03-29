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
  InsertUserSubscription,
  User,
  InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  updateUserAvatar(id: number, filename: string): Promise<User>;

  // Document operations
  getDocuments(userId: number): Promise<Document[]>;
  getDocument(id: number, userId: number): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocument(id: number, doc: Partial<InsertDocument>, userId: number): Promise<Document>;
  deleteDocument(id: number, userId: number): Promise<void>;
  uploadDocument(file: Express.Multer.File, metadata: Partial<InsertDocument>): Promise<Document>;

  // Consultation operations
  getConsultations(userId: number): Promise<Consultation[]>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;

  // Pricing plan operations
  getPricingPlans(): Promise<PricingPlan[]>;
  createPricingPlan(plan: InsertPricingPlan): Promise<PricingPlan>;
  getUserSubscription(userId: number): Promise<(UserSubscription & { planName?: string, features?: string[], price?: number }) | undefined>;
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

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        ...data,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  async updateUserAvatar(id: number, filename: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        avatarUrl: `/uploads/avatars/${filename}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  // Document methods with user context
  async getDocuments(userId: number): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.userId, userId));
  }

  async getDocument(id: number, userId: number): Promise<Document | undefined> {
    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .where(eq(documents.userId, userId));
    return doc;
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [newDoc] = await db.insert(documents).values(doc).returning();
    return newDoc;
  }

  async updateDocument(id: number, doc: Partial<InsertDocument>, userId: number): Promise<Document> {
    const [updatedDoc] = await db
      .update(documents)
      .set({ ...doc, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .where(eq(documents.userId, userId))
      .returning();

    if (!updatedDoc) {
      throw new Error("Document not found");
    }

    return updatedDoc;
  }

  async deleteDocument(id: number, userId: number): Promise<void> {
    await db
      .delete(documents)
      .where(eq(documents.id, id))
      .where(eq(documents.userId, userId));
  }

  async uploadDocument(file: Express.Multer.File, metadata: Partial<InsertDocument>): Promise<Document> {
    const doc: InsertDocument = {
      title: metadata.title || file.originalname,
      type: metadata.type || 'unknown',
      content: {},
      status: 'draft',
      userId: metadata.userId!,
      filename: file.filename,
      fileSize: `${Math.round(file.size / 1024)} KB`,
      fileUrl: `/uploads/${file.filename}`,
    };

    return this.createDocument(doc);
  }

  // Consultation methods with user context
  async getConsultations(userId: number): Promise<Consultation[]> {
    return await db
      .select()
      .from(consultations)
      .where(eq(consultations.userId, userId));
  }

  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const [newConsultation] = await db
      .insert(consultations)
      .values(consultation)
      .returning();
    return newConsultation;
  }

  // Pricing plans and subscriptions
  async getPricingPlans(): Promise<PricingPlan[]> {
    return await db.select().from(pricingPlans);
  }

  async createPricingPlan(plan: InsertPricingPlan): Promise<PricingPlan> {
    const [newPlan] = await db.insert(pricingPlans).values(plan).returning();
    return newPlan;
  }

  async getUserSubscription(userId: number): Promise<(UserSubscription & { planName?: string, features?: string[], price?: number }) | undefined> {
    // Get the latest subscription
    const [subscription] = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .orderBy(desc(userSubscriptions.createdAt));
    
    if (!subscription) {
      return undefined;
    }
    
    // Get pricing plan details to enrich subscription data
    const [plan] = await db
      .select()
      .from(pricingPlans)
      .where(eq(pricingPlans.id, subscription.planId));

    // Enrich the subscription with plan details
    return {
      ...subscription,
      planName: plan?.name,
      features: plan?.features || [],
      price: plan?.price,
    };
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