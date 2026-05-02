import { MODEL_NAMES, SUPPORTED_MODELS } from '@/ai/constants'
import { NextResponse } from 'next/server'

export async function GET() {
  // Filter out models that require missing env vars
  const availableModels = SUPPORTED_MODELS.filter((model) => {
    if (model.includes('azure')) {
      return !!process.env.AZURE_OPENAI_API_KEY
    }
    return true
  })

  return NextResponse.json(
    {
      models: availableModels.map((id) => ({
        id,
        name: MODEL_NAMES[id] ?? id,
      })),
    },
    { headers: { 'Cache-Control': 'public, max-age=300' } }
  )
}
