const BASE_URL = import.meta.env.VITE_API_URL

const request = async (method, path, body) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

const get = async (path: string) => await request('GET', path)
const post = async (path: string, body: any) => await request('POST', path, body)
const put = async (path: string, body: any) => await request('PUT', path, body)
const del = async (path: string) => await request('DELETE', path)

export { get, post, put, del }
