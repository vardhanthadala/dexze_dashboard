"use client";

import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  Upload,
  X,
  Plus,
  ImageIcon,
  ArrowLeft,
  Trash2,
  Pencil,
  Calendar,
  Globe,
  Building2,
  LinkIcon,
  Trophy,
  Activity,
  Tags,
  Palette,
  Video,
} from "lucide-react";

import Image from "next/image";
import toast from "react-hot-toast";

export default function DashboardPage() {

  const router = useRouter();

  // ─────────────────────────────
  // STATES
  // ─────────────────────────────

  const [view, setView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [shortTitle, setShortTitle] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [published, setPublished] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  const [typeInput, setTypeInput] = useState("");
  const [works, setWorks] = useState<any[]>([]);
  const [thumbnail, setThumbnail] = useState("");
  const [bannerImage, setBannerImage] = useState("");

  // Brand Overview States
  const [showBrandOverview, setShowBrandOverview] = useState(false);
  const [brandOverviewTitle, setBrandOverviewTitle] = useState("");
  const [awardName, setAwardName] = useState("");
  const [awardDescription, setAwardDescription] = useState("");
  const [brandShortDescription, setBrandShortDescription] = useState("");
  const [brandKeywords, setBrandKeywords] = useState<string[]>([]);
  const [brandKeywordInput, setBrandKeywordInput] = useState("");
  const [brandOverviewBanner, setBrandOverviewBanner] = useState("");
  
  // Visual Identity States
  const [showVisualIdentity, setShowVisualIdentity] = useState(false);
  const [visualTitle, setVisualTitle] = useState("");
  const [visualSubtitle, setVisualSubtitle] = useState("");
  const [visualDescription, setVisualDescription] = useState("");
  const [visualImages, setVisualImages] = useState<string[]>([]);
  const [visualYoutubeLink, setVisualYoutubeLink] = useState("");

  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const brandBannerInputRef = useRef<HTMLInputElement>(null);
  const visualImagesInputRef = useRef<HTMLInputElement>(null);

  // ─────────────────────────────
  // LOGOUT
  // ─────────────────────────────

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out");
      router.push("/admin");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // ─────────────────────────────
  // FETCH WORKS
  // ─────────────────────────────

  const fetchWorks = async () => {
    try {
      const res = await fetch("/api/works");
      const data = await res.json();
      if (data.success) {
        setWorks(data.works);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  // ─────────────────────────────
  // DELETE WORK
  // ─────────────────────────────

  const deleteWork = async (id: string) => {
    try {
      const res = await fetch("/api/works", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Work deleted");
        fetchWorks();
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // ─────────────────────────────
  // WORK TYPES
  // ─────────────────────────────

  const addWorkType = () => {
    const trimmed = typeInput.trim();
    if (trimmed && !workTypes.includes(trimmed)) {
      setWorkTypes([...workTypes, trimmed]);
      setTypeInput("");
    }
  };

  const handleTypeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addWorkType();
    }
  };

  const removeWorkType = (type: string) => {
    setWorkTypes(workTypes.filter((t) => t !== type));
  };

  // Brand Keywords Helpers
  const addBrandKeyword = () => {
    const trimmed = brandKeywordInput.trim();
    if (trimmed && !brandKeywords.includes(trimmed)) {
      setBrandKeywords([...brandKeywords, trimmed]);
      setBrandKeywordInput("");
    }
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addBrandKeyword();
    }
  };

  const removeBrandKeyword = (keyword: string) => {
    setBrandKeywords(brandKeywords.filter((k) => k !== keyword));
  };

  // ─────────────────────────────
  // CLOUDINARY UPLOAD
  // ─────────────────────────────

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const reader = new FileReader();
      const base64: string = await new Promise((resolve) => {
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: base64 }),
      });

      const data = await res.json();
      return data.url || null;
    } catch (error) {
      console.log(error);
      toast.error("Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadThumbnail = async (file: File) => {
    const url = await uploadToCloudinary(file);
    if (url) {
      setThumbnail(url);
      toast.success("Thumbnail uploaded");
    }
  };

  const uploadBanner = async (file: File) => {
    const url = await uploadToCloudinary(file);
    if (url) {
      setBannerImage(url);
      toast.success("Banner image uploaded");
    }
  };

  const uploadBrandOverviewBanner = async (file: File) => {
    const url = await uploadToCloudinary(file);
    if (url) {
      setBrandOverviewBanner(url);
      toast.success("Brand overview banner uploaded");
    }
  };

  const uploadVisualImages = async (files: FileList) => {
    const urls: string[] = [];
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const url = await uploadToCloudinary(files[i]);
      if (url) urls.push(url);
    }
    setVisualImages([...visualImages, ...urls]);
    toast.success(`${urls.length} image(s) uploaded`);
    setUploading(false);
  };

  // ─────────────────────────────
  // FILE SELECT
  // ─────────────────────────────

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadThumbnail(e.target.files[0]);
    }
  };

  const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadBanner(e.target.files[0]);
    }
  };

  const handleBrandBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadBrandOverviewBanner(e.target.files[0]);
    }
  };

  const handleVisualImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await uploadVisualImages(e.target.files);
    }
  };

  // ─────────────────────────────
  // DRAG & DROP
  // ─────────────────────────────

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadThumbnail(e.dataTransfer.files[0]);
    }
  };

  // ─────────────────────────────
  // REMOVE IMAGE
  // ─────────────────────────────

  const removeThumbnail = () => {
    setThumbnail("");
  };

  // ─────────────────────────────
  // RESET FORM & SWITCH VIEW
  // ─────────────────────────────

  const openForm = () => {
    setEditingId(null);
    setShortTitle("");
    setProjectTitle("");
    setPublished("");
    setCountry("");
    setIndustry("");
    setWebsiteLink("");
    setWorkTypes([]);
    setThumbnail("");
    setBannerImage("");

    // Reset Brand Overview
    setShowBrandOverview(false);
    setBrandOverviewTitle("");
    setAwardName("");
    setAwardDescription("");
    setBrandShortDescription("");
    setBrandKeywords([]);
    setBrandKeywordInput("");
    setBrandOverviewBanner("");

    // Reset Visual Identity
    setShowVisualIdentity(false);
    setVisualTitle("");
    setVisualSubtitle("");
    setVisualDescription("");
    setVisualImages([]);
    setVisualYoutubeLink("");

    setView("form");
  };

  const editWork = (work: any) => {
    setEditingId(work._id);
    setShortTitle(work.shortTitle || work.heading || "");
    setProjectTitle(work.projectTitle || "");
    setPublished(work.published || "");
    setCountry(work.country || "");
    setIndustry(work.industry || "");
    setWebsiteLink(work.websiteLink || "");
    setWorkTypes(work.workTypes);
    setThumbnail(work.thumbnail || (work.images && work.images[0]) || "");
    setBannerImage(work.bannerImage || "");

    // Load Brand Overview
    setShowBrandOverview(work.showBrandOverview || false);
    setBrandOverviewTitle(work.brandOverviewTitle || "");
    setAwardName(work.awardName || "");
    setAwardDescription(work.awardDescription || "");
    setBrandShortDescription(work.brandShortDescription || "");
    setBrandKeywords(work.brandKeywords || []);
    setBrandOverviewBanner(work.brandOverviewBanner || "");

    // Load Visual Identity
    setShowVisualIdentity(work.showVisualIdentity || false);
    setVisualTitle(work.visualTitle || "");
    setVisualSubtitle(work.visualSubtitle || "");
    setVisualDescription(work.visualDescription || "");
    setVisualImages(work.visualImages || []);
    setVisualYoutubeLink(work.visualYoutubeLink || "");

    setView("form");
  };

  const closeForm = () => {
    setEditingId(null);
    setView("list");
  };

  // ─────────────────────────────
  // SUBMIT
  // ─────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!thumbnail) {
      toast.error("Please upload a thumbnail.");
      return;
    }
    if (workTypes.length === 0) {
      toast.error("Please add at least one type of work.");
      return;
    }
    if (!shortTitle.trim()) {
      toast.error("Please enter a short title.");
      return;
    }
    if (!projectTitle.trim()) {
      toast.error("Please enter a project title.");
      return;
    }

    try {
      const isEditing = !!editingId;
      const response = await fetch("/api/works", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isEditing && { id: editingId }),
          shortTitle,
          projectTitle,
          published,
          country,
          industry,
          websiteLink,
          workTypes,
          thumbnail,
          bannerImage,

          // Brand Overview
          showBrandOverview,
          brandOverviewTitle,
          awardName,
          awardDescription,
          brandShortDescription,
          brandKeywords,
          brandOverviewBanner,

          // Visual Identity
          showVisualIdentity,
          visualTitle,
          visualSubtitle,
          visualDescription,
          visualImages,
          visualYoutubeLink,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(isEditing ? "Work updated!" : "Work published successfully!");
        await fetchWorks();
        setEditingId(null);
        setShortTitle("");
        setProjectTitle("");
        setPublished("");
        setCountry("");
        setIndustry("");
        setWebsiteLink("");
        setWorkTypes([]);
        setThumbnail("");
        setBannerImage("");

        // Reset Brand Overview
        setShowBrandOverview(false);
        setBrandOverviewTitle("");
        setAwardName("");
        setAwardDescription("");
        setBrandShortDescription("");
        setBrandKeywords([]);
        setBrandKeywordInput("");
        setBrandOverviewBanner("");

        // Reset Visual Identity
        setShowVisualIdentity(false);
        setVisualTitle("");
        setVisualSubtitle("");
        setVisualDescription("");
        setVisualImages([]);
        setVisualYoutubeLink("");

        setView("list");
      } else {
        toast.error("Failed to save work");
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // ─────────────────────────────
  // UI
  // ─────────────────────────────

  return (
    <div className="flex min-h-screen bg-black text-white">

      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 ml-72 p-10 lg:p-14">

        {/* ════════════════════════════════════ */}
        {/*  LIST VIEW                          */}
        {/* ════════════════════════════════════ */}

        {view === "list" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Works</h1>
                <p className="text-zinc-500 text-sm">
                  {works.length} {works.length === 1 ? "project" : "projects"} published
                </p>
              </div>

              <button
                onClick={openForm}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                New Work
              </button>
            </div>

            {/* Works Grid */}
            {works.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5">
                  <ImageIcon className="w-7 h-7 text-zinc-600" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-2">No works yet</h3>
                <p className="text-zinc-600 text-sm mb-6">Add your first project to get started.</p>
                <button
                  onClick={openForm}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Work
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {works.map((work) => (
                  <div
                    key={work._id}
                    className="group bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={work.thumbnail || (work.images && work.images[0])}
                        alt={work.shortTitle || work.heading}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />



                      {/* Hover Actions */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => editWork(work)}
                          className="w-9 h-9 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all duration-200"
                        >
                          <Pencil className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => deleteWork(work._id)}
                          className="w-9 h-9 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-red-500/80 hover:border-red-500/50 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="text-sm font-medium text-zinc-500 mb-1 uppercase tracking-wider">
                        {work.shortTitle || work.heading}
                      </h3>
                      <h2 className="text-xl font-bold mb-3 truncate text-white">
                        {work.projectTitle || "Untitled Project"}
                      </h2>

                      {/* Work Type Tags */}
                      <div className="flex flex-wrap gap-2">
                        {work.workTypes.map((type: string) => (
                          <span
                            key={type}
                            className="px-3 py-1 rounded-full bg-white/5 border border-zinc-800 text-xs text-zinc-400 font-medium"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ════════════════════════════════════ */}
        {/*  FORM VIEW                          */}
        {/* ════════════════════════════════════ */}

        {view === "form" && (
          <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
              <button
                onClick={closeForm}
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 text-zinc-400" />
              </button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">
                  {editingId ? "Edit Work" : "Add New Work"}
                </h1>
                <p className="text-zinc-500 text-sm">
                  {editingId
                    ? "Update the images, work types, and content."
                    : "Upload images, specify work types, and add content."}
                </p>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl">

              {/* THUMBNAIL & WORK TYPES */}
              <section className="bg-zinc-950/50 border border-zinc-800 rounded-3xl p-8 space-y-8">
                <div className="flex items-center gap-3 pb-2 border-b border-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-zinc-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase">Thumbnail & Category</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-10">
                  {/* Left: Thumbnail Upload */}
                  <div className="flex-1 space-y-4">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      Thumbnail Image
                    </label>

                    {!thumbnail ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center py-12 px-6 ${
                          isDragging
                            ? "border-white bg-white/5"
                            : "border-zinc-800 bg-black hover:border-zinc-600 hover:bg-zinc-900/50"
                        }`}
                      >
                        <Upload className="w-8 h-8 text-zinc-600 mb-3" />
                        <p className="text-zinc-400 text-sm font-medium mb-1 text-center">
                          {uploading
                            ? "Uploading..."
                            : "Drag & drop thumbnail"}
                        </p>
                        <p className="text-zinc-600 text-xs">PNG, JPG, WEBP</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black group">
                        <Image
                          src={thumbnail}
                          alt="Thumbnail preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={removeThumbnail}
                            className="p-2.5 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right: Work Types */}
                  <div className="flex-1 space-y-4">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      Type of Work (Categories)
                    </label>

                    <div className="min-h-[140px] p-5 rounded-2xl border border-zinc-800 bg-black flex flex-col justify-between gap-4">
                      <div className="flex flex-wrap gap-2.5">
                        {workTypes.length > 0 ? (
                          workTypes.map((type) => (
                            <span
                              key={type}
                              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 border border-zinc-800 text-[10px] text-zinc-300 font-bold uppercase tracking-wider"
                            >
                              {type}
                              <button
                                type="button"
                                onClick={() => removeWorkType(type)}
                                className="hover:text-red-400 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))
                        ) : (
                          <p className="text-zinc-600 text-xs italic">No types added yet...</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={typeInput}
                          onChange={(e) => setTypeInput(e.target.value)}
                          onKeyDown={handleTypeKeyDown}
                          placeholder="Add type..."
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-700 outline-none focus:border-zinc-600"
                        />
                        <button
                          type="button"
                          onClick={addWorkType}
                          className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* PROJECT IDENTITY */}
              <section className="bg-zinc-950/50 border border-zinc-800 rounded-3xl p-8 space-y-8">
                <div className="flex items-center gap-3 pb-2 border-b border-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Pencil className="w-4 h-4 text-zinc-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase">Project Identity</h3>
                </div>

                <div className="space-y-6">
                  {/* Short Tag Line */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      Short Tag Line
                    </label>
                    <input
                      type="text"
                      value={shortTitle}
                      onChange={(e) => setShortTitle(e.target.value)}
                      placeholder="e.g. Graphic Design"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-zinc-600 transition-all"
                    />
                  </div>

                  {/* Project Title */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="Enter project name..."
                      className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-zinc-600 transition-all"
                    />
                  </div>
                </div>
              </section>

              {/* PROJECT METADATA */}
              <section className="bg-zinc-950/50 border border-zinc-800 rounded-3xl p-8 space-y-8">
                <div className="flex items-center gap-3 pb-2 border-b border-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-zinc-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase">Project Metadata</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Published */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5" />
                      Published Date
                    </label>
                    <input
                      type="date"
                      value={published}
                      onChange={(e) => setPublished(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-zinc-600 transition-all [color-scheme:dark]"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      <Globe className="w-3.5 h-3.5" />
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United Kingdom"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-zinc-600 transition-all"
                    />
                  </div>

                  {/* Industry */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      <Building2 className="w-3.5 h-3.5" />
                      Industry
                    </label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. E-commerce, Tech"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-zinc-600 transition-all"
                    />
                  </div>

                  {/* Website Link */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      <LinkIcon className="w-3.5 h-3.5" />
                      Website Link
                    </label>
                    <input
                      type="text"
                      value={websiteLink}
                      onChange={(e) => setWebsiteLink(e.target.value)}
                      placeholder="e.g. https://example.com"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-zinc-600 transition-all"
                    />
                  </div>

                  {/* Banner Image */}
                  <div className="md:col-span-2 space-y-3 pt-4 border-t border-zinc-800/50">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Main Banner Image
                    </label>
                    
                    {!bannerImage ? (
                      <div
                        onClick={() => bannerInputRef.current?.click()}
                        className="relative cursor-pointer rounded-2xl border-2 border-dashed border-zinc-800 bg-black hover:border-zinc-600 hover:bg-white/5 transition-all duration-300 flex flex-col items-center justify-center py-12"
                      >
                        <Upload className="w-6 h-6 text-zinc-600 mb-2" />
                        <p className="text-zinc-500 text-xs font-medium">Click to upload banner</p>
                        <input
                          ref={bannerInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleBannerSelect}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black group">
                        <Image
                          src={bannerImage}
                          alt="Banner preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => bannerInputRef.current?.click()}
                            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all"
                          >
                            Change Banner
                          </button>
                          <button
                            type="button"
                            onClick={() => setBannerImage("")}
                            className="p-2.5 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          ref={bannerInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleBannerSelect}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* BRAND OVERVIEW SECTION */}
              <section className="bg-zinc-950/50 border border-zinc-800 rounded-3xl p-8 space-y-8">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-zinc-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-wide uppercase">Brand Overview</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowBrandOverview(!showBrandOverview)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                      showBrandOverview ? "bg-white" : "bg-zinc-800"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-300 ${
                        showBrandOverview ? "translate-x-6 bg-black" : "translate-x-0 bg-zinc-500"
                      }`}
                    />
                  </button>
                </div>

                {showBrandOverview && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Brand Title & Short Desc */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">
                          Brand Overview Title
                        </label>
                        <input
                          type="text"
                          value={brandOverviewTitle}
                          onChange={(e) => setBrandOverviewTitle(e.target.value)}
                          placeholder="e.g. Brand Vision"
                          className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:border-zinc-600 transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">
                          Short Description
                        </label>
                        <input
                          type="text"
                          value={brandShortDescription}
                          onChange={(e) => setBrandShortDescription(e.target.value)}
                          placeholder="Brief brand summary..."
                          className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:border-zinc-600 transition-all"
                        />
                      </div>
                    </div>

                    {/* Award Name & Award Desc */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                          <Trophy className="w-3.5 h-3.5" />
                          Award Name
                        </label>
                        <input
                          type="text"
                          value={awardName}
                          onChange={(e) => setAwardName(e.target.value)}
                          placeholder="e.g. Design of the Year"
                          className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:border-zinc-600 transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">
                          Award Description
                        </label>
                        <input
                          type="text"
                          value={awardDescription}
                          onChange={(e) => setAwardDescription(e.target.value)}
                          placeholder="Little description about award..."
                          className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:border-zinc-600 transition-all"
                        />
                      </div>
                    </div>

                    {/* Keywords */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        <Tags className="w-3.5 h-3.5" />
                        Key Words
                      </label>
                      
                      <div className="p-5 rounded-2xl border border-zinc-800 bg-black space-y-4">
                        <div className="flex flex-wrap gap-2.5">
                          {brandKeywords.length > 0 ? (
                            brandKeywords.map((word) => (
                              <span
                                key={word}
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 border border-zinc-800 text-[10px] text-zinc-300 font-bold uppercase tracking-wider"
                              >
                                {word}
                                <button
                                  type="button"
                                  onClick={() => removeBrandKeyword(word)}
                                  className="hover:text-red-400 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))
                          ) : (
                            <p className="text-zinc-600 text-xs italic">No keywords added...</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={brandKeywordInput}
                            onChange={(e) => setBrandKeywordInput(e.target.value)}
                            onKeyDown={handleKeywordKeyDown}
                            placeholder="Add keyword..."
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-700 outline-none focus:border-zinc-600"
                          />
                          <button
                            type="button"
                            onClick={addBrandKeyword}
                            className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Brand Overview Banner */}
                    <div className="space-y-3 pt-4 border-t border-zinc-800/50">
                      <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        <ImageIcon className="w-3.5 h-3.5" />
                        Brand Overview Banner Image
                      </label>
                      
                      {!brandOverviewBanner ? (
                        <div
                          onClick={() => brandBannerInputRef.current?.click()}
                          className="relative cursor-pointer rounded-2xl border-2 border-dashed border-zinc-800 bg-black hover:border-zinc-600 hover:bg-white/5 transition-all duration-300 flex flex-col items-center justify-center py-12"
                        >
                          <Upload className="w-6 h-6 text-zinc-600 mb-2" />
                          <p className="text-zinc-500 text-xs font-medium">Click to upload brand banner</p>
                          <input
                            ref={brandBannerInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleBrandBannerSelect}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black group">
                          <Image
                            src={brandOverviewBanner}
                            alt="Brand Banner preview"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => brandBannerInputRef.current?.click()}
                              className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all"
                            >
                              Change Banner
                            </button>
                            <button
                              type="button"
                              onClick={() => setBrandOverviewBanner("")}
                              className="p-2.5 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            ref={brandBannerInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleBrandBannerSelect}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* VISUAL IDENTITY SECTION */}
              <section className="bg-zinc-950/50 border border-zinc-800 rounded-3xl p-8 space-y-8">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Palette className="w-4 h-4 text-zinc-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-wide uppercase">Visual Identity</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowVisualIdentity(!showVisualIdentity)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                      showVisualIdentity ? "bg-white" : "bg-zinc-800"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-300 ${
                        showVisualIdentity ? "translate-x-6 bg-black" : "translate-x-0 bg-zinc-500"
                      }`}
                    />
                  </button>
                </div>

                {showVisualIdentity && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Title */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={visualTitle}
                          onChange={(e) => setVisualTitle(e.target.value)}
                          placeholder="e.g. Visual Experience"
                          className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:border-zinc-600 transition-all"
                        />
                      </div>

                      {/* Subtitle */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">
                          Small Subtitle
                        </label>
                        <input
                          type="text"
                          value={visualSubtitle}
                          onChange={(e) => setVisualSubtitle(e.target.value)}
                          placeholder="Short catchy subtitle..."
                          className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:border-zinc-600 transition-all"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        Description
                      </label>
                      <textarea
                        value={visualDescription}
                        onChange={(e) => setVisualDescription(e.target.value)}
                        placeholder="Detailed visual identity description..."
                        rows={4}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-zinc-600 resize-none transition-all"
                      />
                    </div>

                    {/* Youtube Link */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        <Video className="w-3.5 h-3.5" />
                        YouTube Video Link
                      </label>
                      <input
                        type="text"
                        value={visualYoutubeLink}
                        onChange={(e) => setVisualYoutubeLink(e.target.value)}
                        placeholder="e.g. https://www.youtube.com/watch?v=..."
                        className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:border-zinc-600 transition-all"
                      />
                    </div>

                    {/* Multi Image Upload */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        <ImageIcon className="w-3.5 h-3.5" />
                        Project Photos
                      </label>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {visualImages.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-800 group">
                            <Image src={img} alt={`Visual ${idx}`} fill unoptimized className="object-cover" />
                            <button
                              type="button"
                              onClick={() => setVisualImages(visualImages.filter((_, i) => i !== idx))}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => visualImagesInputRef.current?.click()}
                          className="aspect-square rounded-xl border-2 border-dashed border-zinc-800 bg-black flex flex-col items-center justify-center hover:border-zinc-600 hover:bg-white/5 transition-all group"
                        >
                          <Plus className="w-6 h-6 text-zinc-600 group-hover:text-zinc-400 mb-1" />
                          <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 font-bold uppercase">Add Photo</span>
                        </button>
                      </div>
                      <input
                        ref={visualImagesInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleVisualImagesSelect}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </section>


              {/* SUBMIT */}
              <div className="pt-2 flex gap-4">
                <button
                  type="submit"
                  className="px-10 py-4 rounded-2xl bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all duration-300"
                >
                  {editingId ? "Update Work" : "Publish Work"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-8 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
              </div>

            </form>
          </>
        )}

      </main>
    </div>
  );
}