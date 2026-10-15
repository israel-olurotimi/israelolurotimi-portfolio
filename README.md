# Israel Olurotimi

Portfolio of Israel Olurotimi, presenting product design, interaction design, brand identity and creative direction.

**Website:** https://israelolurotimi.com

## Architecture

- `index.html`: site markup, CSS and browser interactions
- `assets/`: case-study media, fonts and downloadable CVs
- `api/`: Vercel serverless integrations for music, books and game scores
- `sw.js`, `manifest.webmanifest`: offline caching and installation
- `vercel.json`: deployment headers
- `tests/`: dependency-free source checks

The site currently uses a single HTML entry point. Extracting its scripts and styles requires browser regression testing before release.

## Develop

With Python 3, run `python3 -m http.server 8000` and open http://localhost:8000. For serverless API routes, use a configured Vercel development environment.

With Node.js 20 or later, run `npm test` for the source checks. There are no runtime npm dependencies.

## Server environment

Configure `LASTFM_API_KEY`, `LASTFM_USER`, `HARDCOVER_API_TOKEN` and either `KV_REST_API_URL` + `KV_REST_API_TOKEN` or the corresponding `UPSTASH_REDIS_*` values through Vercel. Never commit credentials or expose them to client code.

## Maintenance

Use feature branches and pull requests. Verify desktop and mobile layouts, keyboard navigation, motion preferences, case studies, downloads, and API error states before merging. Production deployment requires release approval.

Browser-delivered HTML, scripts and assets are inspectable by visitors. Public repository access does not grant permission to reuse original portfolio designs, client artwork or proprietary materials. Third-party rights remain with their respective owners.
