'use client'

import { ToggleWelcome } from '@/components/modals/welcome'
import { VercelDashed } from '@/components/icons/vercel-dashed'
import { cn } from '@/lib/utils'
import { useSandboxStore } from './state'
import { Button } from '@/components/ui/button'
import { RefreshCw, Trash2 } from 'lucide-react'
import { useCallback } from 'react'

interface Props {
  className?: string
}

export function Header({ className }: Props) {
  const { sandboxId, setSandboxId, setStatus } = useSandboxStore()

  const handleReset = useCallback(() => {
    setSandboxId('')
    setStatus(undefined)
    fetch('/api/sandbox/session', { method: 'DELETE' }).catch(console.error)
  }, [setSandboxId, setStatus])

  const handleRecreate = useCallback(() => {
    handleReset()
    window.location.reload()
  }, [handleReset])

  return (
    <header className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center">
        <VercelDashed className="ml-1 md:ml-2.5 mr-1.5" />
        <span className="hidden md:inline text-sm uppercase font-mono font-bold tracking-tight">
          OSS Vibe Coding Platform
        </span>
      </div>
      <div className="flex items-center ml-auto space-x-1.5">
        {sandboxId && (
          <>
            <span className="hidden md:inline text-xs font-mono text-muted-foreground">
              {sandboxId.slice(0, 12)}...
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecreate}
              title="Recreate Sandbox"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              title="Reset Session"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
        <ToggleWelcome />
      </div>
    </header>
  )
}
