# Job Listings Scraper

Simple CLI tool that extracts job listings from any company website using Firecrawl.

## Quick Start

1. Clone and install dependencies:
```bash
git clone https://github.com/aschlean/firecrawl-th.git
cd firecrawl-th
npm install
```

2. Get your Firecrawl API key from [docs.firecrawl.dev](https://docs.firecrawl.dev)

3. Create `.env` file:
```bash
echo "FIRECRAWL_API_KEY=your_api_key_here" > .env
```

4. Run:
```bash
npm start
```

5. Enter any company website (e.g., `openai.com`) when prompted

## Output Example

```json
[
  {
    "position": "Software Engineer",
    "location": "San Francisco, CA",
    "link": "https://company.com/jobs/123",
    "remote": true,
    "postedDate": "2024-01-20",
    "compensation": "$150,000 - $200,000"
  }
]
```

## Development

For hot reload during development:
```bash
npm run dev
```
