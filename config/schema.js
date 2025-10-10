import { boolean, integer, json, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  subscriptionId: varchar(" subscriptionId", { length: 255 }),
});

export const coursesTable = pgTable("courses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar("cid", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  description: varchar("description", { length: 1000 }),
  noOfChapters: integer("  noOfChapters").notNull(),
  includeVideo: boolean("includeVideo").default(false),
  category: varchar("category", { length: 255 }).notNull(),
  courseJson: json("courseJson"),
  courseContent: json().default({}),
  userEmail: varchar("userEmail", { length: 255 })
    .references(() => usersTable.email)
    .notNull(),
       bannerImageUrl: varchar().default(''),
});

export const enrollCourseTable=pgTable('enrollCourse',{
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
   cid:varchar('cid').references(()=>coursesTable.cid),
  userEmail: varchar("userEmail", { length: 255 })
    .references(() => usersTable.email)
    .notNull(),
   completedChapters: json()

})