'use client'

import { useState, useCallback } from 'react'
import { FileContent } from './file-content'
import { XIcon, FileIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Tab {
  path: string
  label: string
}

interface Props {
  sandboxId?: string
  selectedPath?: string
  onSelectPath: (path: string) => void
}

export function TabbedFileViewer({ sandboxId, selectedPath, onSelectPath }: Props) {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)

  const openTab = useCallback(
    (path: string) => {
      const label = path.split('/').pop() || path
      setTabs((prev) => {
        if (prev.some((t) => t.path === path)) return prev
        return [...prev, { path, label }]
      })
      setActiveTab(path)
      onSelectPath(path)
    },
    [onSelectPath]
  )

  const closeTab = useCallback(
    (path: string) => {
      setTabs((prev) => prev.filter((t) => t.path !== path))
      if (activeTab === path) {
        const remaining = tabs.filter((t) => t.path !== path)
        const next = remaining[remaining.length - 1]
        setActiveTab(next?.path || null)
        if (next) onSelectPath(next.path)
      }
    },
    [activeTab, tabs, onSelectPath]
  )

  return (
    <div className="flex flex-col h-full">
      {tabs.length > 0 && (
        <div className="flex border-b border-primary/18 bg-background">
          {tabs.map((tab) => (
            <div
              key={tab.path}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 text-xs border-b-2 cursor-pointer',
                activeTab === tab.path
                  ? 'border-primary text-primary'
                  : 'border-transparent hover:bg-accent/50'
              )}
              onClick={() => {
                setActiveTab(tab.path)
                onSelectPath(tab.path)
              }}
            >
              <FileIcon className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{tab.label}</span>
              <button
                className="ml-1 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.path)
                }}
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      {activeTab && sandboxId ? (
        <FileContent sandboxId={sandboxId} path={activeTab.substring(1)} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          Select a file to view
        </div>
      )}
    </div>
  )
}
