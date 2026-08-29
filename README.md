# shrtn

A tiny real link shortener. MERN: MongoDB, Express, React, Node. Built to
actually deploy somewhere, not a toy that stops at `localhost`.

- `server/` — Express API, serves the built frontend too.
- `client/` — React frontend, Vite.

## Run it locally

```bash
# a local Mongo, or point MONGODB_URI at any Mongo instance
docker run -d -p 27017:27017 mongo:7

cd server && npm install
MONGODB_URI=mongodb://127.0.0.1:27017/shrtn PORT=4321 node index.js
```

In another terminal, for the frontend with hot reload (proxies /api and /s
to the server above, see `client/vite.config.js`):

```bash
cd client && npm install && npm run dev
```

## Deploying it as one process

```bash
cd client && npm install && npm run build
cp -r dist ../server/public
```

`server/index.js` serves `server/public` as static files and falls back to
`index.html` for any route React handles client-side. One process, one port,
one deploy.
