import type { Config } from '@netlify/functions'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'
import { database } from '../../db/index.js'
import { entries } from '../../db/schema.js'
const safeUrl = z.string().max(2000).refine(v => !v || /^https?:\/\//i.test(v) || /^\/api\/images\?id=/.test(v) || /^\/img\/[a-zA-Z0-9._-]+$/.test(v), 'URL ไม่ถูกต้อง')
const step = z.object({ title: z.string().max(300), description: z.string().max(10000), image: safeUrl })
const input = z.object({ title: z.string().trim().min(1).max(200), kind: z.enum(['knowledge','guide','website','prompt','module']), category: z.string().min(1).max(100), description: z.string().max(2000), content: z.string().max(100000), image: safeUrl, url: safeUrl, steps: z.array(step).max(100), script: z.string().max(100000), favorite: z.boolean() })
export default async (req: Request) => {
  try {
    const db = database()
    const id = Number(new URL(req.url).searchParams.get('id'))
    if (req.method === 'GET') {
      const rows = await db.select().from(entries).orderBy(desc(entries.updatedAt))
      return Response.json(rows.map(r => ({ ...r, steps: JSON.parse(r.steps) })), { headers: { 'Cache-Control': 'no-store' } })
    }
    if (req.method === 'POST' || req.method === 'PUT') {
      const parsed = input.safeParse(await req.json())
      if (!parsed.success) return Response.json({ error: 'กรุณาตรวจสอบข้อมูลและ URL ให้ถูกต้อง' }, { status: 400 })
      const values = { ...parsed.data, steps: JSON.stringify(parsed.data.steps), updatedAt: new Date() }
      if (req.method === 'PUT' && (!Number.isInteger(id) || id < 1)) return new Response('Invalid ID', { status: 400 })
      const [row] = req.method === 'POST' ? await db.insert(entries).values(values).returning() : await db.update(entries).set(values).where(eq(entries.id, id)).returning()
      if (!row) return new Response('Not found', { status: 404 })
      return Response.json({ ...row, steps: JSON.parse(row.steps) })
    }
    if (req.method === 'DELETE' && Number.isInteger(id) && id > 0) {
      await db.delete(entries).where(eq(entries.id, id))
      return new Response(null, { status: 204 })
    }
    return new Response('Method not allowed', { status: 405 })
  } catch {
    return Response.json({ error: 'เชื่อมต่อคลังข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง' }, { status: 500 })
  }
}
export const config: Config = { path: '/api/entries' }
