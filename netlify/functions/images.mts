import type { Config } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
export default async (req: Request) => {
  try {
    const store = getStore({ name: 'vault-images', consistency: 'strong' })
    if (req.method === 'POST') {
      const data = await req.formData()
      const file = data.get('file')
      if (!(file instanceof File) || !['image/png','image/jpeg','image/webp','image/gif'].includes(file.type) || file.size > 4 * 1024 * 1024) return Response.json({ error: 'ใช้ภาพ JPG, PNG, WebP หรือ GIF ไม่เกิน 4 MB' }, { status: 400 })
      const extensions: Record<string, string> = { 'image/png':'png', 'image/jpeg':'jpg', 'image/webp':'webp', 'image/gif':'gif' }
      const ext = extensions[file.type]
      const id = `${crypto.randomUUID()}.${ext}`
      await store.set(id, await file.arrayBuffer())
      return Response.json({ url: `/api/images?id=${id}` })
    }
    if (req.method !== 'GET') return new Response('Method not allowed', { status: 405 })
    const id = new URL(req.url).searchParams.get('id') || ''
    if (!/^[a-f0-9-]{36}\.(png|jpg|webp|gif)$/.test(id)) return new Response('Not found', { status: 404 })
    const data = await store.get(id, { type: 'arrayBuffer' })
    if (!data) return new Response('Not found', { status: 404 })
    const type = id.endsWith('jpg') ? 'jpeg' : id.split('.').pop()
    return new Response(data, { headers: { 'Content-Type': `image/${type}`, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } })
  } catch { return Response.json({ error: 'จัดการรูปภาพไม่สำเร็จ กรุณาลองใหม่' }, { status: 500 }) }
}
export const config: Config = { path: '/api/images' }
