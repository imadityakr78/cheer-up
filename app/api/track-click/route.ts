import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        console.log("SHE CLICKED A BUTTON!");
        console.log("Option:", data.optionSelected);
        console.log("Time:", data.timestamp);

        // HERE IS WHERE YOUR BACKEND MAGIC HAPPENS!
        // -> Insert into PostgreSQL database
        // -> Trigger a Pusher event
        // -> Send yourself a Telegram/Discord webhook

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to log click' }, { status: 500 });
    }
}