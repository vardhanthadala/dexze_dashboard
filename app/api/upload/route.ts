import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { verifyAdminAPI, unauthorizedResponse } from "@/lib/verifyToken";

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminAPI(req);
    if (!admin) return unauthorizedResponse();

    const body = await req.json();
    const fileStr = body.data;

    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "dexze-works",
    });

    return NextResponse.json({
      success: true,
      url: uploadedResponse.secure_url,
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}