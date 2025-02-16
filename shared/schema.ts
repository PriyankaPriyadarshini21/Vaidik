import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  content: jsonb("content").notNull(),
  status: text("status").notNull().default("draft"),
  filename: text("filename"),
  fileUrl: text("file_url"),
  fileSize: text("file_size"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents)
  .pick({
    title: true,
    type: true,
    content: true,
    status: true,
    filename: true,
    fileUrl: true,
    fileSize: true,
    expiresAt: true,
  });

export const insertConsultationSchema = createInsertSchema(consultations).pick({
  question: true,
  response: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;