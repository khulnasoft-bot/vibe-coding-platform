import { type GatewayModelId } from '@ai-sdk/gateway'

export enum Models {
  AnthropicClaudeOpus46 = 'anthropic/claude-opus-4.6',
  AnthropicClaudeSonnet46 = 'anthropic/claude-sonnet-4.6',
  OpenAIGPT53Codex = 'openai/gpt-5.3-codex',
  XaiGrok41Reasoning = 'xai/grok-4.1-fast-reasoning',
  // Additional provider models
  AnthropicClaudeHaiku46 = 'anthropic/claude-haiku-4.6',
  OpenAIGPT41 = 'openai/gpt-4.1',
  OpenAIGPT41Mini = 'openai/gpt-4.1-mini',
  GoogleGemini25Pro = 'google/gemini-2.5-pro',
  GoogleGemini25Flash = 'google/gemini-2.5-flash',
  AzureOpenAI = 'azure/openai-deployment', // Requires AZURE_OPENAI_API_KEY
}

export const SUPPORTED_MODELS: GatewayModelId[] = [
  Models.AnthropicClaudeOpus46,
  Models.AnthropicClaudeSonnet46,
  Models.AnthropicClaudeHaiku46,
  Models.OpenAIGPT53Codex,
  Models.OpenAIGPT41,
  Models.OpenAIGPT41Mini,
  Models.XaiGrok41Reasoning,
  Models.GoogleGemini25Pro,
  Models.GoogleGemini25Flash,
  // Models.AzureOpenAI, // Uncomment when Azure credentials are configured
]

export const DEFAULT_MODEL = Models.AnthropicClaudeOpus46

export const MODEL_NAMES: Record<string, string> = {
  [Models.AnthropicClaudeOpus46]: 'Claude Opus 4.6',
  [Models.AnthropicClaudeSonnet46]: 'Claude Sonnet 4.6',
  [Models.AnthropicClaudeHaiku46]: 'Claude Haiku 4.6',
  [Models.OpenAIGPT53Codex]: 'GPT-5.3 Codex',
  [Models.OpenAIGPT41]: 'GPT-4.1',
  [Models.OpenAIGPT41Mini]: 'GPT-4.1 Mini',
  [Models.XaiGrok41Reasoning]: 'Grok 4.1 Reasoning',
  [Models.GoogleGemini25Pro]: 'Gemini 2.5 Pro',
  [Models.GoogleGemini25Flash]: 'Gemini 2.5 Flash',
  [Models.AzureOpenAI]: 'Azure OpenAI',
}

export const TEST_PROMPTS = [
  'Generate a Next.js app that allows to list and search Pokemons',
  'Create a `golang` server that responds with "Hello World" to any request',
]
