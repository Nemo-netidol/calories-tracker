const LOCAL_BASE_URL = import.meta.env.VITE_LOCAL_API_URL

const request = async (method: string, path: string, body?: any) => {
  const res = await fetch(`${LOCAL_BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important to send/receive cookies
    body: body ? JSON.stringify(body) : undefined
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `API error: ${res.status}`);
  }
  
  return res.json()
}

const get = async (path: string) => await request('GET', path)
const post = async (path: string, body: any) => await request('POST', path, body)
const put = async (path: string, body: any) => await request('PUT', path, body)
const del = async (path: string) => await request('DELETE', path)

export { get, post, put, del }
