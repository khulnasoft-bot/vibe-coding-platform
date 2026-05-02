'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckIcon, XIcon, FileTextIcon } from 'lucide-react'
import { useSandboxStore } from '@/app/state'
import { useState, useCallback } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FileChange {
  path: string
  content: string
  status: 'pending' | 'accepted' | 'rejected'
}

interface Props {
  files: FileChange[]
  onAccept: (paths: string[]) => void
  onReject: (paths: string[]) => void
}

export function PreviewChanges({ files, onAccept, onReject }: Props) {
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set())

  const toggleSelect = useCallback((path: string) => {
    setSelectedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }, [])

  const acceptSelected = useCallback(() => {
    const paths = Array.from(selectedPaths)
    onAccept(paths)
    setSelectedPaths(new Set())
  }, [selectedPaths, onAccept])

  const rejectSelected = useCallback(() => {
    const paths = Array.from(selectedPaths)
    onReject(paths)
    setSelectedPaths(new Set())
  }, [selectedPaths, onReject])

  const acceptAll = useCallback(() => {
    onAccept(files.map((f) => f.path))
  }, [files, onAccept])

  const rejectAll = useCallback(() => {
    onReject(files.map((f) => f.path))
  }, [files, onReject])

  return (
    <Card className="m-2">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="flex items-center gap-2 text-sm">
          <FileTextIcon className="h-4 w-4" />
          Preview Changes ({files.length} files)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="mb-2 flex gap-2">
          <Button size="sm" variant="default" onClick={acceptAll}>
            <CheckIcon className="mr-1 h-3 w-3" />
            Accept All
          </Button>
          <Button size="sm" variant="destructive" onClick={rejectAll}>
            <XIcon className="mr-1 h-3 w-3" />
            Reject All
          </Button>
          {selectedPaths.size > 0 && (
            <>
              <Button size="sm" variant="default" onClick={acceptSelected}>
                Accept Selected ({selectedPaths.size})
              </Button>
              <Button size="sm" variant="destructive" onClick={rejectSelected}>
                Reject Selected ({selectedPaths.size})
              </Button>
            </>
          )}
        </div>
        <ScrollArea className="h-48">
          <div className="space-y-1">
            {files.map((file) => (
              <div
                key={file.path}
                className={`flex items-center gap-2 rounded p-1 text-xs ${
                  file.status === 'accepted'
                    ? 'bg-green-100'
                    : file.status === 'rejected'
                    ? 'bg-red-100'
                    : selectedPaths.has(file.path)
                    ? 'bg-blue-50'
                    : 'hover:bg-accent/50'
                } cursor-pointer`}
                onClick={() => toggleSelect(file.path)}
              >
                <input
                  type="checkbox"
                  checked={selectedPaths.has(file.path)}
                  onChange={() => toggleSelect(file.path)}
                  className="h-3 w-3"
                />
                <span className="font-mono">{file.path}</span>
                <span
                  className={`ml-auto text-xs ${
                    file.status === 'accepted'
                      ? 'text-green-600'
                      : file.status === 'rejected'
                      ? 'text-red-600'
                      : 'text-muted-foreground'
                  }`}
                >
                  {file.status}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
