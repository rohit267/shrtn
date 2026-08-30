# shrtn

A tiny real link shortener. MERN: MongoDB, Express, React, Node.

**Live:** [shrtn-rohitmahto267.dormhost.app](https://shrtn-rohitmahto267.dormhost.app/), deployed on [DormHost.dev](https://dormhost.dev).

- `index.js`, `package.json` at the root — this is the deployable app.
- `client/` — the React frontend, Vite. Built into `public/` at deploy time,
  which `index.js` serves.

Root-level on purpose: a platform's Node buildpack looks for `package.json`
at the repository root, not in a subfolder.

## Run it locally

```bash
# a local Mongo, or point MONGODB_URI at any Mongo instance
docker run -d -p 27017:27017 mongo:7

npm install
MONGODB_URI=mongodb://127.0.0.1:27017/shrtn PORT=4321 node index.js
```

In another terminal, for the frontend with hot reload (proxies /api and /s
to the server above, see `client/vite.config.js`):

```bash
cd client && npm install && npm run dev
```

## Deploying it as one process

```bash
npm run heroku-postbuild   # builds client/, copies client/dist to ./public
npm start
```

`index.js` serves `./public` as static files and falls back to
`index.html` for any route React handles client-side. One process, one port,
one deploy. A platform that runs `heroku-postbuild` automatically (most
buildpack-based ones do) needs nothing more than `npm install` and `npm start`.
This one runs on [DormHost](https://dormhost.dev), that's exactly the flow it uses.
