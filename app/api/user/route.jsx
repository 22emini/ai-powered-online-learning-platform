import { usersTable } from "@/config/schema";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { email, name } = await req.json();
        if (!email || !name) {
            return NextResponse.json({ error: "Missing email or name" }, { status: 400 });
        }
        // if user exists
        const users = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if (users?.length === 0) {
            const result = await db.insert(usersTable)
                .values({ name, email })
                .returning(usersTable);
            console.log(result);
            return NextResponse.json(result);
        }
        return NextResponse.json(users[0]);
    } catch (error) {
        console.error("POST /api/user error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}