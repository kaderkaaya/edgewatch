# EdgeWatch

Local Cloudflare Worker in front of a mock search API.

```text
curl :8787/search?q=rose  →  Worker  →  Express :3000
```

## Run

Two terminals, from the repo root:

```bash
npm run origin
npm run worker
```

Then:

```bash
curl "http://localhost:3000/search?q=rose"
curl "http://localhost:8787/search?q=rose"
```

Both should return the same JSON.
