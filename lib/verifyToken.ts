import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";
import { COOKIE_NAME } from "./cookies";

export async function verifyAdminAPI(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return null;
  }

  return payload;
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  );
}
