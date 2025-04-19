const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

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

// GraphQL query to fetch all blog posts
const GET_POSTS_QUERY = `
  query GetPosts {
    posts {
      id
      title
      publish_date
    }
  }
`;

// Function to load blog posts from GraphQL API
const loadBlogPosts = async () => {
  try {
    const response = await fetch('https://api.joshuasevy.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_POSTS_QUERY
      })
    });

    const { data } = await response.json();
    
    if (!data || !data.posts) {
      console.warn('No blog posts found or invalid response format');
      return [];
    }

    // Convert blog posts to sitemap entries
    return data.posts.map(post => ({
      path: `/blog/${post.id}`,
      priority: "0.6",
      lastmod: post.publish_date
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

// Generate sitemap
const generateSitemap = async () => {
  try {
    // Fetch blog posts
    const blogPosts = await loadBlogPosts();
    
    // Combine static pages and blog posts
    const allPages = [
      ...staticPages,
      ...blogPosts
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

    console.log("✅ Sitemap generated successfully:", outputPath);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
};

// Run the sitemap generation
generateSitemap();
