const fs = require("fs");
const path = require("path");

const BASE_URL = "https://www.joshuasevy.com";

const staticPages = [
  { path: "/", priority: "1.0" },
  { path: "/about", priority: "0.8" },
  { path: "/resume", priority: "0.8" },
  { path: "/contact", priority: "0.6" },
  { path: "/blog", priority: "0.7" },
];

const GET_PUBLISHED_POSTS = `
  query SitemapPosts {
    posts(publishedOnly: true) {
      slug
      publish_date
      updated_at
    }
  }
`;

const loadBlogPosts = async () => {
  try {
    const response = await fetch("https://api.joshuasevy.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: GET_PUBLISHED_POSTS }),
    });

    const json = await response.json();
    const data = json.data;

    if (!data || !data.posts) {
      console.warn("No blog posts found or invalid response format");
      return [];
    }

    return data.posts
      .filter((post) => post && post.slug)
      .map((post) => ({
        path: `/blog/${post.slug}`,
        priority: "0.6",
        lastmod: post.updated_at || post.publish_date,
      }));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

const generateSitemap = async () => {
  try {
    const blogPosts = await loadBlogPosts();
    const allPages = [...staticPages, ...blogPosts];

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

    const outputPath = path.join(__dirname, "public", "sitemap.xml");
    fs.writeFileSync(outputPath, sitemap);

    console.log("✅ Sitemap generated successfully:", outputPath);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    process.exit(1);
  }
};

generateSitemap();
