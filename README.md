# Bhoomi Intelligence prototype

A local, interactive demonstration of a national research and policy intelligence platform for land governance. All records, counts, map features, AI replies, and simulation outputs are fictional prototype data.

## Run locally

```sh
npm install
# Copy .env.example to .env.local and add a rotated OpenAI API key
npm run dev
```

Vite serves the app at `http://localhost:5173`.

## Included flows

- National overview dashboard and analytics visualisations
- Searchable research repository, detail pages, bookmarks, and dataset catalogue
- Keyword and demo semantic discovery, plus a predefined-response research assistant with evidence sources
- Interactive OpenStreetMap map with regional markers, popups, region selection, and layer controls
- Adjustable local policy scenario calculator and workspace scenario saving
- Research collaboration workspace, innovation submission flow, notifications, profile editing, and theme preference
- Global command palette with `⌘K` or `Ctrl+K`

The data adapter boundary is in `src/data/services.js`; it can be replaced with API calls when a backend exists. No backend is required for the prototype.

The AI assistant uses a small local Express endpoint and the OpenAI Responses API. The key stays in `.env.local` on the server and is not bundled into browser JavaScript. Never use a key exposed in chat or source control; rotate it first in the OpenAI dashboard.
