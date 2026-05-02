import { NextResponse, type NextRequest } from 'next/server'
import { Sandbox } from '@vercel/sandbox'
import z from 'zod/v3'
import { validateSandboxId, validateFilePath } from '@/lib/security'

const FileParamsSchema = z.object({
  sandboxId: z.string(),
  path: z.string(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sandboxId: string }> }
) {
  const { sandboxId } = await params
  const fileParams = FileParamsSchema.safeParse({
    path: request.nextUrl.searchParams.get('path'),
    sandboxId,
  })

  if (fileParams.success === false) {
    return NextResponse.json(
      { error: 'Invalid parameters. You must pass a `path` as query' },
      { status: 400 }
    )
  }

  if (!validateSandboxId(sandboxId)) {
    return NextResponse.json(
      { error: 'Invalid sandbox ID' },
      { status: 400 }
    )
  }

  if (!validateFilePath(fileParams.data.path)) {
    return NextResponse.json(
      { error: 'Invalid file path' },
      { status: 400 }
    )
  }

  try {
    const sandbox = await Sandbox.get(fileParams.data)
    const stream = await sandbox.readFile(fileParams.data)
    if (!stream) {
      return NextResponse.json(
        { error: 'File not found in the Sandbox' },
        { status: 404 }
      )
    }

    return new NextResponse(
      new ReadableStream({
        async pull(controller) {
          for await (const chunk of stream) {
            controller.enqueue(chunk)
          }
          controller.close()
        },
      })
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sandboxId: string }> }
) {
  const { sandboxId } = await params
  const path = request.nextUrl.searchParams.get('path')

  if (!validateSandboxId(sandboxId)) {
    return NextResponse.json(
      { error: 'Invalid sandbox ID' },
      { status: 400 }
    )
  }

  if (!path || !validateFilePath(path)) {
    return NextResponse.json(
      { error: 'Invalid file path' },
      { status: 400 }
    )
  }

  try {
    const sandbox = await Sandbox.get({ sandboxId })
    const content = await request.text()

    await sandbox.writeFiles([
      {
        path,
        content: Buffer.from(content, 'utf8'),
      },
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to write file' },
      { status: 500 }
    )
  }
}
