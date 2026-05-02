'use client'

import { Logs } from './logs/logs'
import { ErrorSummaryPanel } from '@/components/error-monitor/error-summary-panel'
import { Panel, PanelHeader } from '@/components/panels/panels'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TerminalIcon } from 'lucide-react'

export function Logs() {
  return (
    <Panel className="flex flex-col">
      <PanelHeader>
        <TerminalIcon className="w-4 mr-2" />
        <span className="font-mono uppercase font-semibold">Logs</span>
      </PanelHeader>
      <ErrorSummaryPanel />
      <ScrollArea className="flex-1">
        <Logs />
      </ScrollArea>
    </Panel>
  )
}
