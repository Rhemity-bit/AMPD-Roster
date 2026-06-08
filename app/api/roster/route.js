export async function POST(request) {
  try {
    const { password } = await request.json()
    
    // TEMPORARY BYPASS: No environment variables needed!
    if (password === "roster123") {
      return Response.json({ ok: true })
    }
    
    return Response.json({ ok: false }, { status: 401 })
  } catch (e) {
    return Response.json({ ok: false }, { status: 500 })
  }
}
