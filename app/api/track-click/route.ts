import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
    try {
        console.log("🟢 API HIT: Someone clicked a button!");

        // 1. Grab data
        const data = await request.json();
        console.log("📦 Data received from frontend:", data);

        // 2. Check for the Database URL
        if (!process.env.DATABASE_URL) {
            console.log("🔴 ERROR: DATABASE_URL is missing! Check your .env.local file.");
            return NextResponse.json({ error: 'Missing DB URL' }, { status: 500 });
        }

        // 3. Connect to Neon
        console.log("🟡 Connecting to Neon database...");
        const sql = neon(process.env.DATABASE_URL);

        // 4. Insert data
        await sql`
      INSERT INTO user_clicks (clicked_by, action, option_selected)
      VALUES (
        ${data.clickedBy}, 
        ${data.action || 'WhatsApp Button Click'}, 
        ${data.optionSelected}
      )
    `;

        console.log("✅ SUCCESS: Row inserted into database!");
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("🔴 NEON DATABASE ERROR:", error);
        return NextResponse.json({ error: 'Failed to log click' }, { status: 500 });
    }
}