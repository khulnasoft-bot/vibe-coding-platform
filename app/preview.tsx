'use client'

import { PreviewComponent } from './preview/preview'
import { useSandboxStore } from './state'
import { useEffect, useState } from 'react'
import { Loader2Icon, GlobeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Preview({ className }: { className: string }) {
  const { status, url, urlUUID, sandboxId } = useSandboxStore()
  const [isWaiting, setIsWaiting] = useState(false)

  useEffect(() => {
    if (sandboxId && !url) {
      setIsWaiting(true)
    } else {
      setIsWaiting(false)
    }
  }, [sandboxId, url])

  return (
    <div className={className} role="region" aria-label="Preview Panel">
      <div className="flex items-center w-full">
        <div className="flex items-center font-mono font-semibold uppercase">
          <GlobeIcon className="mr-2 w-4" aria-hidden="true" />
          Preview
        </div>
        {isWaiting && (
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2Icon className="h-3 w-3 animate-spin" />
            Waiting for server...
          </div>
        )}
        {url && !isWaiting && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
              {url}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(url, '_blank')}
              aria-label="Open preview in new tab"
            >
              <GlobeIcon className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0 relative">
        {!sandboxId ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <GlobeIcon className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm">Create a sandbox to see live preview</p>
            </div>
          </div>
        ) : isWaiting ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Loader2Icon className="mx-auto h-8 w-8 mb-4 animate-spin" />
              <p className="text-sm">Starting development server...</p>
              <p className="text-xs mt-2">The preview will appear automatically</p>
            </div>
          </div>
        ) : (
          <PreviewComponent
            key={urlUUID}
            className="h-full"
            disabled={status === 'stopped'}
            url={url}
          />
        )}
      </div>
    </div>
  )
}

export function Preview({ className }: Props) {
  const { status, url, urlUUID } = useSandboxStore()
  return (
    <PreviewComponent
      key={urlUUID}
      className={className}
      disabled={status === 'stopped'}
      url={url}
    />
  )
}
