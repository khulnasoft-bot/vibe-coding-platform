import { NextResponse } from 'next/server'
import { Sandbox } from '@vercel/sandbox'

interface Params {
  sandboxId: string
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { sandboxId } = await params

  try {
    const sandbox = await Sandbox.get({ sandboxId })

    return NextResponse.json({
      sandboxId: sandbox.sandboxId,
      status: 'running',
    })
  } catch (error) {
    return NextResponse.json({
      sandboxId,
      status: 'stopped',
    })
  }
}
