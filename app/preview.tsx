'use client'

import { Preview } from './preview/preview'
import { Panel, PanelHeader } from '@/components/panels/panels'
import { EyeIcon } from 'lucide-react'

export function Preview({ className }: { className: string }) {
  return (
    <Panel className={className} role="region" aria-label="Preview Panel">
      <PanelHeader>
        <EyeIcon className="w-4 mr-2" aria-hidden="true" />
        <span className="font-mono uppercase font-semibold">Preview</span>
      </PanelHeader>
      <div className="flex-1 min-h-0">
        <Preview />
      </div>
    </Panel>
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
