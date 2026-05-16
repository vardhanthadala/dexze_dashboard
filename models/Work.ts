import mongoose from "mongoose";

const WorkSchema =
    new mongoose.Schema(
        {
            shortTitle: {
                type: String,
                required: true,
            },

            projectTitle: {
                type: String,
                required: true,
            },


            workTypes: {
                type: [String],
                required: true,
            },

            thumbnail: {
                type: String,
                required: true,
            },

            // Metadata
            published: {
                type: String, 
            },
            country: {
                type: String,
            },
            industry: {
                type: String,
            },
            websiteLink: {
                type: String,
            },
            bannerImage: {
                type: String,
            },

            // Brand Overview Section
            showBrandOverview: {
                type: Boolean,
                default: false,
            },
            brandOverviewTitle: {
                type: String,
            },
            awardName: {
                type: String,
            },
            awardDescription: {
                type: String,
            },
            brandShortDescription: {
                type: String,
            },
            brandKeywords: {
                type: [String],
            },
            brandOverviewBanner: {
                type: String,
            },

            // Visual Identity Section
            showVisualIdentity: {
                type: Boolean,
                default: false,
            },
            visualTitle: {
                type: String,
            },
            visualSubtitle: {
                type: String,
            },
            visualDescription: {
                type: String,
            },
            visualImages: {
                type: [String],
            },
            visualYoutubeLink: {
                type: String,
            },
        },
        {
            timestamps: true,
        }
    );

// Delete the model if it exists to force schema update in development
if (mongoose.models && mongoose.models.Work) {
    delete (mongoose as any).models.Work;
}

const Work =
    mongoose.model(
        "Work",
        WorkSchema
    );

export default Work;