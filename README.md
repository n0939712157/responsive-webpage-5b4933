# My Vault

My Vault is a Thai-language shared knowledge workspace for saving notes, illustrated step-by-step guides, website cards, reusable prompts, and browser/Python search modules. It supports mobile, tablet, and desktop layouts with warm white and deep navy themes and coral accents.

Built with React 19, TypeScript, TanStack Start/Router, Vite, Radix UI, Lucide icons, and CSS. Netlify Functions handle CRUD; Netlify Database with Drizzle stores records; Netlify Blobs stores uploaded images. The editable starting content includes design, content planning, website delivery, WordPress, SEO, and team handoff guides.

## Local development

Use Node 22.13+ and pnpm. Install dependencies with `pnpm install`, link the Netlify site if necessary, and run `netlify dev --port 8889`. Netlify provides the database and blob environment. Deploy through Netlify; pending SQL migrations in `netlify/database/migrations` are applied by the platform. Do not apply them manually.

## Using the workspace

Add a record, select its type and category (or enter a new category), and write a description and full content. Guides support ordered steps with individual images. Images accept a URL or an upload of JPG, PNG, WebP, or GIF up to 4 MB. Every record has a shareable detail URL. Use categories, full-text matching, favorites, sorting, and card/list views to find content.

This is a shared link-based workspace, without user accounts or per-user permissions. Anyone with access to the website can read, create, edit, and delete records. Favorites are shared, while the theme preference is local to each browser. Refresh the page to retrieve changes from other devices. Do not store credentials in the workspace.

Search modules use a URL template containing `{query}` and open results in a browser tab. Python code is saved as text and can be copied or downloaded; the server does not execute it. Workspace settings exports all records as JSON and offers a standard-library Python helper:

```sh
python public/scripts/search-vault.py my-vault-backup.json "keyword"
python public/scripts/search-vault.py my-vault-backup.json "keyword" --open
```

Exported JSON contains record content and image URLs; it does not bundle image binaries. The source HTML supplied for this project is retained in `reference/my-vault.html` as a reference, outside the public site.
