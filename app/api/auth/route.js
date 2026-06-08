export async function POST(request) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return Response.json({ ok: false, error: 'ADMIN_PASSWORD not set' }, { status: 500 })
    }
    if (password === adminPassword) {
      return Response.json({ ok: true })
    }
    return Response.json({ ok: false }, { status: 401 })
  } catch (e) {
    return Response.json({ ok: false }, { status: 500 })
  }
}
