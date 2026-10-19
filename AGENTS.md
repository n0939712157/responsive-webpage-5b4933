# My Vault architecture

Thai-first, responsive shared knowledge workspace built with TanStack Start, React 19, TypeScript, Vite, and Netlify.

## Key files

- `src/routes/index.tsx`: root route mounting the workspace.
- `src/components/vault.tsx`: shared workspace shell, navigation, searchable resource cards, detail pages, record editor, guide steps, uploads, favorites, export, and settings.
- `src/routes/__root.tsx`: Thai HTML shell, finished product metadata, providers, and toast container.
- `src/styles.css`: Tailwind setup and product CSS variables, desktop/mobile breakpoints, light/deep navy themes, illustrations, reduced motion.
- `db/schema.ts`: canonical Drizzle schema for entries; ordered guide steps are JSON serialized in a text column.
- `db/index.ts`: lazy server-only database factory, native Netlify adapter.
- `netlify/functions/entries.mts`: validated shared CRUD at `/api/entries`.
- `netlify/functions/images.mts`: restricted raster uploads and retrieval at `/api/images`; Netlify Blobs with immediate read-after-write consistency.
- `netlify/database/migrations`: generated schema migration and initial editable content seed migration. Netlify applies these at deployment; never manually migrate or push.
- `public/img`: custom code-native SVG resource illustrations.
- `public/scripts/search-vault.py`: downloadable standard-library Python search helper for exported JSON.
- `reference/my-vault.html`: user-supplied source reference, outside public assets.

## Conventions and decisions

Use Thai UI copy, visible labels, accessible icon buttons, and Radix dialogs. Keep error, loading, empty, pending, success, and destructive-confirmation states. Use CSS variables for theme colors and preserve reduced-motion behavior. Local storage is only for browser theme preference; application records belong in Netlify Database, uploaded images in Blobs. Keep database modules out of client imports.

The app is intentionally a shared link-based workspace, not an account-based system. All visitors have the same record permissions and shared favorites. Do not present the profile initial as an authenticated user. If accounts become a requirement, use the Netlify Identity skill and enforce access on APIs.

Views and detail records have shareable query URLs (`?view=guide&entry=3`) and browser history handling. These represent separate in-app screens in the root route, without requiring generated route files for each category.

Stored content and scripts render as plain text. Never use unsafe HTML rendering or execute uploaded/stored scripts. Browser search modules substitute an encoded query into an HTTP(S) URL template. Python runs on the user's machine only. The JSON export references images by URL; it is not an offline image archive. Uploaded image objects are retained when a record is deleted to avoid breaking other records using the same image.

Keep `drizzle-orm` and `drizzle-kit` on compatible beta versions for the Netlify adapter. Generate schema changes with `pnpm exec drizzle-kit generate --name descriptive_name`; include corresponding migrations. Existing applied migrations are immutable.

The build pipeline validates the project. Follow session instructions about not starting local build, test, typecheck, or dev-server commands when that restriction applies. Review edits by reading source files.
