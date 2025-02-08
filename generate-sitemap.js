const fs = require("fs");
const path = require("path");

// Define your website URL
const BASE_URL = "https://www.joshuasevy.com";

// Define static pages (make sure they match `app-routing.module.ts`)
const staticPages = [
  { path: "/", priority: "1.0" },
  { path: "/about", priority: "0.8" },
  { path: "/resume", priority: "0.8" },
  { path: "/contact", priority: "0.6" },
  { path: "/blog", priority: "0.7" } // Add blog home page
];

// Function to load blog posts dynamically
// Example: Fetch posts from a mock JSON file or an API
const loadBlogPosts = () => {
  // Replace this with an API call if needed
  const blogPosts = [
    { id: 1, title: "Getting Started with Angular", publishDate: "2025-02-08" },
    { id: 2, title: "Improving App Performance", publishDate: "2025-01-15" }
  ];

  // Convert blog posts to sitemap entries
  return blogPosts.map(post => ({
    path: `/blog/${post.id}`,
    priority: "0.6",
    lastmod: post.publishDate
  }));
};

// Combine static pages and blog posts
const allPages = [
  ...staticPages,
  ...loadBlogPosts()
];

// Generate the sitemap XML structure
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
  .map(
    ({ path, priority, lastmod }) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${lastmod || new Date().toISOString().split("T")[0]}</lastmod>
    <priority>${priority}</priority>
  </url>
  `
  )
  .join("\n")}
</urlset>`;

// Write the sitemap.xml file to the `public` folder
const outputPath = path.join(__dirname, "public", "sitemap.xml");
fs.writeFileSync(outputPath, sitemap);

console.log("✅ Sitemap generated successfully: ", outputPath);
