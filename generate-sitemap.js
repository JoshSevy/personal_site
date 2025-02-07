const fs = require("fs");
const path = require("path");

// Define your website URL
const BASE_URL = "https://www.joshuasevy.com";

// Define the pages (make sure they match `app-routing.module.ts`)
const pages = [
  { path: "/", priority: "1.0" },
  { path: "/about", priority: "0.8" },
  { path: "/resume", priority: "0.8" },
  { path: "/contact", priority: "0.6" }
];

// Generate the sitemap XML structure
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
  .map(
    ({ path, priority }) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>${priority}</priority>
  </url>
  `
  )
  .join("\n")}
</urlset>`;

// Write the sitemap.xml file to the `src/assets/` folder
const outputPath = path.join(__dirname, "src", "assets", "sitemap.xml");
fs.writeFileSync(outputPath, sitemap);

console.log("✅ Sitemap generated successfully: ", outputPath);
