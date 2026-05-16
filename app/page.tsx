"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import LoginPage from "../components/LoginPage";
import { Plus, Search, Filter, MoreHorizontal, ExternalLink } from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const projects = [
    { title: "Brand Identity", client: "Hueglam", date: "May 12, 2024", status: "Active" },
    { title: "E-commerce Platform", client: "Wellness Co", date: "May 10, 2024", status: "Completed" },
    { title: "Mobile Application", client: "Home Studio", date: "May 08, 2024", status: "Draft" },
    { title: "Marketing Campaign", client: "Partner Brands", date: "May 05, 2024", status: "Active" },
    { title: "UI/UX Redesign", client: "Nyoraa", date: "May 01, 2024", status: "In Review" },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar onLogout={() => setIsLoggedIn(false)} />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 md:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Works</h1>
            <p className="text-zinc-500">Manage and oversee all your creative projects.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search works..." 
                className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all w-64"
              />
            </div>
            <button className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-hover transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Work
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Projects", value: "24", change: "+4 this month" },
            { label: "Active Now", value: "12", change: "On track" },
            { label: "Completed", value: "148", change: "98% satisfaction" },
          ].map((stat, i) => (
            <div key={i} className="premium-card p-6 bg-zinc-900/50">
              <p className="text-zinc-500 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-primary text-xs font-semibold">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Projects Table */}
        <section className="premium-card overflow-hidden bg-zinc-900/30">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="font-bold">Recent Projects</h2>
            <button className="text-zinc-500 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-zinc-500 text-sm border-b border-zinc-800">
                  <th className="px-6 py-4 font-medium">Project Name</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {projects.map((project, i) => (
                  <tr key={i} className="group hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-zinc-200">{project.title}</td>
                    <td className="px-6 py-4 text-zinc-400">{project.client}</td>
                    <td className="px-6 py-4 text-zinc-500 text-sm">{project.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        project.status === "Active" ? "bg-green-500/10 text-green-500" :
                        project.status === "Completed" ? "bg-primary/10 text-primary" :
                        "bg-zinc-800 text-zinc-500"
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-zinc-500 hover:text-white"><ExternalLink className="w-4 h-4" /></button>
                        <button className="p-1 text-zinc-500 hover:text-white"><MoreHorizontal className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

