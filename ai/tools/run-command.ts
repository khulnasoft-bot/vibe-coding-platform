import type { UIMessageStreamWriter, UIMessage } from 'ai'
import type { DataPart } from '../messages/data-parts'
import { Command, Sandbox } from '@vercel/sandbox'
import { getRichError, withRetry } from './get-rich-error'
import { validateSandboxId, validateArgs, sanitizeArgument } from '@/lib/security'
import { tool } from 'ai'
import description from './run-command.md'
import z from 'zod/v3'

interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export const runCommand = ({ writer }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      sandboxId: z
        .string()
        .describe('The ID of the Vercel Sandbox to run the command in'),
      command: z
        .string()
        .describe(
          "The base command to run (e.g., 'npm', 'node', 'python', 'ls', 'cat'). Do NOT include arguments here. IMPORTANT: Each command runs independently in a fresh shell session - there is no persistent state between commands. You cannot use 'cd' to change directories for subsequent commands."
        ),
      args: z
        .array(z.string())
        .optional()
        .describe(
          "Array of arguments for the command. Each argument should be a separate string (e.g., ['install', '--verbose'] for npm install --verbose, or ['src/index.js'] to run a file, or ['-la', './src'] to list files). IMPORTANT: Use relative paths (e.g., 'src/file.js') or absolute paths instead of trying to change directories with 'cd' first, since each command runs in a fresh shell session."
        ),
      sudo: z
        .boolean()
        .optional()
        .describe('Whether to run the command with sudo'),
      wait: z
        .boolean()
        .describe(
          'Whether to wait for the command to finish before returning. If true, the command will block until it completes, and you will receive its output.'
        ),
    }),
    execute: async (
      { sandboxId, command, sudo, wait, args = [] },
      { toolCallId }
    ) => {
      // Validate sandbox ID
      if (!validateSandboxId(sandboxId)) {
        const error = { message: `Invalid sandbox ID format: ${sandboxId}` }
        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            sandboxId,
            command,
            args,
            error,
            status: 'error',
          },
        })
        return error.message
      }

      // Validate args
      if (!validateArgs(args)) {
        const error = { message: 'Invalid command arguments' }
        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            sandboxId,
            command,
            args,
            error,
            status: 'error',
          },
        })
        return error.message
      }

      // Sanitize arguments
      const sanitizedArgs = args.map(sanitizeArgument)

      // Validate command
      if (!command || command.length > 100 || command.includes('\0')) {
        const error = { message: 'Invalid command' }
        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            sandboxId,
            command,
            args,
            error,
            status: 'error',
          },
        })
        return error.message
      }

      writer.write({
        id: toolCallId,
        type: 'data-run-command',
        data: { sandboxId, command, args: sanitizedArgs, status: 'executing' },
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
          type: 'data-run-command',
          data: {
            sandboxId,
            command,
            args: sanitizedArgs,
            error: richError.error,
            status: 'error',
          },
        })

        return richError.message
      }

      let cmd: Command | null = null

      try {
        cmd = await withRetry(() =>
          sandbox!.runCommand({
            detached: true,
            cmd: command,
            args: sanitizedArgs,
            sudo,
          })
        )
      } catch (error) {
        const richError = getRichError({
          action: 'run command in sandbox',
          args: { sandboxId },
          error,
        })

        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            sandboxId,
            command,
            args: sanitizedArgs,
            error: richError.error,
            status: 'error',
          },
        })

        return richError.message
      }

      writer.write({
        id: toolCallId,
        type: 'data-run-command',
        data: {
          sandboxId,
          commandId: cmd.cmdId,
          command,
          args: sanitizedArgs,
          status: 'executing',
        },
      })

      if (!wait) {
        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            sandboxId,
            commandId: cmd.cmdId,
            command,
            args: sanitizedArgs,
            status: 'running',
          },
        })

        return `The command \`${command} ${sanitizedArgs.join(
          ' '
        )}\` has been started in the background in the sandbox with ID \`${sandboxId}\` with the commandId ${
          cmd.cmdId
        }.`
      }

      writer.write({
        id: toolCallId,
        type: 'data-run-command',
        data: {
          sandboxId,
          commandId: cmd.cmdId,
          command,
          args: sanitizedArgs,
          status: 'waiting',
        },
      })

      const done = await cmd.wait()
      try {
        const [stdout, stderr] = await Promise.all([
          done.stdout(),
          done.stderr(),
        ])

        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            sandboxId,
            commandId: cmd.cmdId,
            command,
            args: sanitizedArgs,
            exitCode: done.exitCode,
            status: 'done',
          },
        })

        return (
          `The command \`${command} ${sanitizedArgs.join(
            ' '
          )}\` has finished with exit code ${done.exitCode}.` +
          `Stdout of the command was: \n` +
          `\`\`\`\n${stdout}\n\`\`\`\n` +
          `Stderr of the command was: \n` +
          `\`\`\`\n${stderr}\n\`\`\``
        )
      } catch (error) {
        const richError = getRichError({
          action: 'wait for command to finish',
          args: { sandboxId, commandId: cmd.cmdId },
          error,
        })

        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            sandboxId,
            commandId: cmd.cmdId,
            command,
            args: sanitizedArgs,
            error: richError.error,
            status: 'error',
          },
        })

        return richError.message
      }
    },
  })
