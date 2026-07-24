# Blog drafts

Write posts here as markdown files, then publish through the admin form at
`/admin/posts/add`. This folder isn't read by the app, it's just a versioned
place to draft.

## Workflow

1. Copy `_template.md` to a new file, e.g. `2026-08-01-my-post.md`.
2. Fill in the frontmatter and write the body below it.
3. Log in and go to `/admin/posts/add`.
4. Copy each frontmatter field into its matching form field:
   - `title` → Title
   - `slug` → URL slug (leave blank to auto-generate from the title)
   - `excerpt` → Excerpt
   - `tags` → Tags (comma-separated)
   - `author` → Author
   - `hero_image_url` → upload the image instead, the form fills this in for you
5. Paste the body (everything below the `---`) into the Body editor and check
   the preview.
6. Check "Published" when it's ready to go live, then Create post.

Keep `published: false` in the frontmatter (and leave the checkbox unchecked)
for drafts you're not ready to publish yet.
