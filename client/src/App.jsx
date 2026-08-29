import { useEffect, useState } from 'react'
import './App.css'

// In dev, Vite proxies /api to the Express server (see vite.config.js).
// In production, Express serves the built frontend itself, so this is
// always a same-origin request either way.
export default function App() {
  const [url, setUrl] = useState('')
  const [links, setLinks] = useState([])
  const [error, setError] = useState('')

  const load = () => fetch('/api/links').then((r) => r.json()).then(setLinks)

  useEffect(() => {
    load()
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    if (!res.ok) {
      const body = await res.json()
      setError(body.error || 'something went wrong')
      return
    }
    setUrl('')
    load()
  }

  return (
    <main className="wrap">
      <h1>shrtn</h1>
      <p>A tiny link shortener. MongoDB stores the links, Express serves the API and this page.</p>

      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/a-very-long-url"
          required
        />
        <button type="submit">Shorten</button>
      </form>
      {error ? <p className="error">{error}</p> : null}

      <ul>
        {links.map((l) => (
          <li key={l.code}>
            <a href={`/s/${l.code}`}>/s/{l.code}</a>
            <span className="target"> &rarr; {l.url}</span>
            <span className="hits">{l.hits} hits</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
