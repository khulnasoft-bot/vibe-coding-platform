'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCommandErrorsLogs } from '@/app/state'
import { AlertCircle, FileWarning, Terminal } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ErrorSummaryPanel() {
  const { errors } = useCommandErrorsLogs()

  if (errors.length === 0) {
    return null
  }

  const groupedByCommand = errors.reduce(
    (acc, error) => {
      const key = `${error.command} ${error.args.join(' ')}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(error)
      return acc
    },
    {} as Record<string, typeof errors>
  )

  return (
    <Card className="m-2">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 text-red-500" />
          Error Summary ({errors.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <ScrollArea className="h-32">
          <div className="space-y-2">
            {Object.entries(groupedByCommand).map(
              ([command, errorLogs], idx) => (
                <div key={idx} className="rounded border p-2 text-xs">
                  <div className="mb-1 flex items-center gap-1 font-mono">
                    <Terminal className="h-3 w-3" />
                    {command}
                  </div>
                  {errorLogs.slice(0, 3).map((log, logIdx) => (
                    <div
                      key={logIdx}
                      className="ml-4 flex items-start gap-1 text-red-600"
                    >
                      <FileWarning className="mt-0.5 h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{log.data.slice(0, 100)}</span>
                    </div>
                  ))}
                  {errorLogs.length > 3 && (
                    <div className="ml-4 text-muted-foreground">
                      +{errorLogs.length - 3} more errors
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
