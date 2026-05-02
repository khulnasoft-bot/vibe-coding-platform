import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const SANDBOX_SESSION_COOKIE = 'sandbox-session'

export async function GET() {
  const store = await cookies()
  const session = store.get(SANDBOX_SESSION_COOKIE)?.value

  if (!session) {
    return NextResponse.json({ sandboxId: null })
  }

  try {
    const data = JSON.parse(session)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ sandboxId: null })
  }
}

export async function POST(request: NextRequest) {
  const store = await cookies()
  const body = await request.json()

  store.set(SANDBOX_SESSION_COOKIE, JSON.stringify(body), {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const store = await cookies()
  store.delete(SANDBOX_SESSION_COOKIE)
  return NextResponse.json({ success: true })
}
