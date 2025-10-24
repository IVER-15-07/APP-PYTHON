Layer/Feature structure (temporary re-exports)

What this change does
- Adds a `src/features/*` and `src/shared/*` layout that re-exports existing pages, components and services.
- This is non-invasive: original files remain in place. The new files forward exports to the old locations so current imports keep working while the team migrates gradually.

Next steps
- Optionally update imports to point to `src/features/...` and `src/shared/...` and then remove original files.
- Run the project build and fix any path mismatches.

Notes
- Paths used are relative; after full migration you can simplify imports using Vite aliases (e.g. `@/features/...`).
