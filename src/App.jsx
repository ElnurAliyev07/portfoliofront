import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./components/Home"
import BlogDetail from "./pages/BlogDetail"
import ProjectDetail from "./pages/ProjectDetail"
import AllProjects from "./pages/AllProjects"
import AllBlogs from "./pages/AllBlogs"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ana səhifə - bütün bölmələr burada */}
        <Route path="/" element={<Home />} />

        {/* Bloq postlarının detal səhifəsi */}
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/all-blogs" element={<AllBlogs />} />

        {/* Layihələrin detal səhifəsi */}
        <Route path="/project/:projectId" element={<ProjectDetail />} />

        <Route path="/all-projects" element={<AllProjects />} />

        {/* Əlavə səhifələr lazım olsa buraya əlavə et */}
      </Routes>
    </BrowserRouter>
  )
}
