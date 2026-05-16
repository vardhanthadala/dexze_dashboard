import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Work from "@/models/Work";
import { verifyAdminAPI, unauthorizedResponse } from "@/lib/verifyToken";

// GET all works
export async function GET(req: NextRequest) {
    try {
        const admin = await verifyAdminAPI(req);
        if (!admin) return unauthorizedResponse();

        await connectDB();
        const works = await Work.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            works,
        });
    } catch (error) {
        console.error("API Error (GET):", error);
        return NextResponse.json({
            success: false,
            error: String(error),
        });
    }
}

// CREATE work
export async function POST(req: NextRequest) {
    try {
        const admin = await verifyAdminAPI(req);
        if (!admin) return unauthorizedResponse();

        await connectDB();
        const body = await req.json();

        const work = await Work.create({
            shortTitle: body.shortTitle,
            projectTitle: body.projectTitle,
            workTypes: body.workTypes,
            thumbnail: body.thumbnail,
            published: body.published,
            country: body.country,
            industry: body.industry,
            websiteLink: body.websiteLink,
            bannerImage: body.bannerImage,
            showBrandOverview: body.showBrandOverview,
            brandOverviewTitle: body.brandOverviewTitle,
            awardName: body.awardName,
            awardDescription: body.awardDescription,
            brandShortDescription: body.brandShortDescription,
            brandKeywords: body.brandKeywords,
            brandOverviewBanner: body.brandOverviewBanner,
            showVisualIdentity: body.showVisualIdentity,
            visualTitle: body.visualTitle,
            visualSubtitle: body.visualSubtitle,
            visualDescription: body.visualDescription,
            visualImages: body.visualImages,
            visualYoutubeLink: body.visualYoutubeLink,
        });

        return NextResponse.json({
            success: true,
            work,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error),
        });
    }
}

// DELETE work
export async function DELETE(req: NextRequest) {
    try {
        const admin = await verifyAdminAPI(req);
        if (!admin) return unauthorizedResponse();

        await connectDB();
        const { id } = await req.json();

        await Work.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error),
        });
    }
}

// UPDATE work
export async function PUT(req: NextRequest) {
    try {
        const admin = await verifyAdminAPI(req);
        if (!admin) return unauthorizedResponse();

        await connectDB();
        const body = await req.json();
        console.log("PUT BODY:", body);

        const updatedWork = await Work.findByIdAndUpdate(
            body.id,
            {
                shortTitle: body.shortTitle,
                projectTitle: body.projectTitle,
                workTypes: body.workTypes,
                thumbnail: body.thumbnail,
                published: body.published,
                country: body.country,
                industry: body.industry,
                websiteLink: body.websiteLink,
                bannerImage: body.bannerImage,
                showBrandOverview: body.showBrandOverview,
                brandOverviewTitle: body.brandOverviewTitle,
                awardName: body.awardName,
                awardDescription: body.awardDescription,
                brandShortDescription: body.brandShortDescription,
                brandKeywords: body.brandKeywords,
                brandOverviewBanner: body.brandOverviewBanner,
                showVisualIdentity: body.showVisualIdentity,
                visualTitle: body.visualTitle,
                visualSubtitle: body.visualSubtitle,
                visualDescription: body.visualDescription,
                visualImages: body.visualImages,
                visualYoutubeLink: body.visualYoutubeLink,
            },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            work: updatedWork,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error),
        });
    }
}