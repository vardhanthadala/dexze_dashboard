import { NextResponse } from "next/server";

import { connectDB }
    from "@/lib/mongodb";

export async function GET() {

    try {

        const conn =
            await connectDB();

        console.log(conn);

        return NextResponse.json({
            success: true,
            message:
                "MongoDB connected",
        });

    } catch (error: any) {

        console.log(
            "DB ERROR:",
            error
        );

        return NextResponse.json({
            success: false,
            error:
                error.message,
        });
    }
}