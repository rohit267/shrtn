import express from 'express'
import mongoose from 'mongoose'
import { nanoid } from 'nanoid'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shrtn'

await mongoose.connect(MONGODB_URI)
console.log('connected to MongoDB')

const linkSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  hits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})
const Link = mongoose.model('Link', linkSchema)

const app = express()
app.use(express.json())

app.post('/api/links', async (req, res) => {
  const { url } = req.body
  if (!url || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: 'url must start with http:// or https://' })
  }
  const code = nanoid(7)
  const link = await Link.create({ code, url })
  res.status(201).json({ code: link.code, url: link.url })
})

app.get('/api/links', async (req, res) => {
  const links = await Link.find().sort({ createdAt: -1 }).limit(20)
  res.json(links)
})

app.get('/s/:code', async (req, res) => {
  const link = await Link.findOneAndUpdate(
    { code: req.params.code },
    { $inc: { hits: 1 } },
  )
  if (!link) return res.status(404).send('no such short link')
  res.redirect(link.url)
})

// Built React lands here. See client/README for the build step.
app.use(express.static(path.join(__dirname, 'public')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => console.log(`listening on ${PORT}`))
