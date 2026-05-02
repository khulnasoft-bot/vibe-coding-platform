import type { UIMessageStreamWriter, UIMessage } from 'ai'
import type { DataPart } from '../messages/data-parts'
import { Sandbox } from '@vercel/sandbox'
import { getContents, type File } from './generate-files/get-contents'
import { getRichError, withRetry } from './get-rich-error'
import { getWriteFiles } from './generate-files/get-write-files'
import { validateSandboxId, validateFilePath } from '@/lib/security'
import { tool } from 'ai'
import description from './generate-files.md'
import z from 'zod/v3'

interface Params {
  modelId: string
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export const generateFiles = ({ writer, modelId }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      sandboxId: z.string(),
      paths: z.array(z.string()),
    }),
    execute: async ({ sandboxId, paths }, { toolCallId, messages }) => {
      // Validate sandbox ID
      if (!validateSandboxId(sandboxId)) {
        const error = { message: `Invalid sandbox ID format: ${sandboxId}` }
        writer.write({
          id: toolCallId,
          type: 'data-generating-files',
          data: { error, paths: [], status: 'error' },
        })
        return error.message
      }

      // Validate file paths
      for (const path of paths) {
        if (!validateFilePath(path)) {
          const error = { message: `Invalid file path: ${path}` }
          writer.write({
            id: toolCallId,
            type: 'data-generating-files',
            data: { error, paths: [], status: 'error' },
          })
          return error.message
        }
      }

      writer.write({
        id: toolCallId,
        type: 'data-generating-files',
        data: { paths: [], status: 'generating' },
      })

      let sandbox: Sandbox | null = null

      try {
        sandbox = await withRetry(() => Sandbox.get({ sandboxId }))
      } catch (error) {
        const richError = getRichError({
          action: 'get sandbox by id',
          args: { sandboxId },
          error,
        })

        writer.write({
          id: toolCallId,
          type: 'data-generating-files',
          data: { error: richError.error, paths: [], status: 'error' },
        })

        return richError.message
      }

      const writeFiles = getWriteFiles({ sandbox, toolCallId, writer })
      const iterator = getContents({ messages, modelId, paths })
      const uploaded: File[] = []

      try {
        for await (const chunk of iterator) {
          if (chunk.files.length > 0) {
            // Validate generated file paths
            for (const file of chunk.files) {
              if (!validateFilePath(file.path)) {
                const error = { message: `Invalid generated file path: ${file.path}` }
                writer.write({
                  id: toolCallId,
                  type: 'data-generating-files',
                  data: { error, paths: [], status: 'error' },
                })
                return error.message
              }
            }

            const error = await writeFiles(chunk)
            if (error) {
              return error
            } else {
              uploaded.push(...chunk.files)
            }
          } else {
            writer.write({
              id: toolCallId,
              type: 'data-generating-files',
              data: {
                status: 'generating',
                paths: chunk.paths,
              },
            })
          }
        }
      } catch (error) {
        const richError = getRichError({
          action: 'generate file contents',
          args: { modelId, paths },
          error,
        })

        writer.write({
          id: toolCallId,
          type: 'data-generating-files',
          data: {
            error: richError.error,
            status: 'error',
            paths,
          },
        })

        return richError.message
      }

      writer.write({
        id: toolCallId,
        type: 'data-generating-files',
        data: { paths: uploaded.map((file) => file.path), status: 'done' },
      })

      return `Successfully generated and uploaded ${
        uploaded.length
      } files. Their paths and contents are as follows:
        ${uploaded
          .map((file) => `Path: ${file.path}\nContent: ${file.content}\n`)
          .join('\n')}`
    },
  })
