'use client'

import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
  FileIcon,
  SearchIcon,
} from 'lucide-react'
import { FileContent } from '@/components/file-explorer/file-content'
import { Panel, PanelHeader } from '@/components/panels/panels'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { buildFileTree, type FileNode } from './build-file-tree'
import { useState, useMemo, useEffect, useCallback, memo } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  className: string
  disabled?: boolean
  paths: string[]
  sandboxId?: string
}

export const FileExplorer = memo(function FileExplorer({
  className,
  disabled,
  paths,
  sandboxId,
}: Props) {
  const fileTree = useMemo(() => buildFileTree(paths), [paths])
  const [selected, setSelected] = useState<FileNode | null>(null)
  const [fs, setFs] = useState<FileNode[]>(fileTree)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingPath, setEditingPath] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    setFs(fileTree)
  }, [fileTree])

  const selectFile = useCallback((node: FileNode) => {
    if (node.type === 'file') {
      setSelected(node)
    }
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, node: FileNode) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (node.type === 'folder') {
          toggleFolder(node.path)
        } else {
          selectFile(node)
        }
      }
    },
    [toggleFolder, selectFile]
  )

  const startEditing = useCallback(
    (path: string, currentContent: string) => {
      setEditingPath(path)
      setEditContent(currentContent)
    },
    []
  )

  const saveEdit = useCallback(
    async (sandboxId: string) => {
      if (!editingPath) return
      try {
        const response = await fetch(
          `/api/sandboxes/${sandboxId}/files?path=${encodeURIComponent(editingPath)}`,
          {
            method: 'PUT',
            body: editContent,
          }
        )
        if (response.ok) {
          setEditingPath(null)
          setEditContent('')
        }
      } catch (error) {
        console.error('Failed to save file:', error)
      }
    },
    [editingPath, editContent]
  )

  const selectFile = useCallback((node: FileNode) => {
    if (node.type === 'file') {
      setSelected(node)
    }
  }, [])

  const renderFileTree = useCallback(
    (nodes: FileNode[], depth = 0) => {
      return nodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          depth={depth}
          selected={selected}
          onToggleFolder={toggleFolder}
          onSelectFile={selectFile}
          onStartEditing={startEditing}
          renderFileTree={renderFileTree}
          onKeyDown={(e) => handleKeyDown(e, node)}
        />
      ))
    },
    [selected, toggleFolder, selectFile, startEditing, handleKeyDown]
  )

  return (
    <Panel className={className} role="region" aria-label="File Explorer">
      <PanelHeader>
        <FileIcon className="w-4 mr-2" />
        <span className="font-mono uppercase font-semibold">
          Sandbox Remote Filesystem
        </span>
        {selected && !disabled && (
          <span className="ml-auto text-gray-500">{selected.path}</span>
        )}
      </PanelHeader>

      <div className="p-2 border-b border-primary/18">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full rounded border border-primary/18 bg-background pl-8 pr-2 py-1 text-sm"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search files"
          />
        </div>
      </div>

      <div className="flex text-sm h-[calc(100%-5rem-1px)]">
        <ScrollArea className="w-1/4 border-r border-primary/18 flex-shrink-0">
          <div role="tree" aria-label="File tree">{renderFileTree(filteredTree)}</div>
        </ScrollArea>
        {sandboxId && !disabled && (
          <div className="w-3/4 flex-shrink-0">
            <TabbedFileViewer
              sandboxId={sandboxId}
              selectedPath={selected?.path}
              onSelectPath={(path) => {
                const node = findNodeByPath(fileTree, path)
                if (node) setSelected(node)
              }}
            />
          </div>
        )}
      </div>
    </Panel>
  )
})

// Memoized file tree node component
const FileTreeNode = memo(function FileTreeNode({
  node,
  depth,
  selected,
  onToggleFolder,
  onSelectFile,
  onStartEditing,
  onKeyDown,
  renderFileTree,
}: {
  node: FileNode
  depth: number
  selected: FileNode | null
  onToggleFolder: (path: string) => void
  onSelectFile: (node: FileNode) => void
  onStartEditing?: (path: string, content: string) => void
  onKeyDown?: (e: React.KeyboardEvent, node: FileNode) => void
  renderFileTree: (nodes: FileNode[], depth: number) => React.ReactNode
}) {
  const handleClick = useCallback(() => {
    if (node.type === 'folder') {
      onToggleFolder(node.path)
    } else {
      onSelectFile(node)
    }
  }, [node, onToggleFolder, onSelectFile])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      // Context menu logic would go here
    },
    []
  )

  const isSelected = selected?.path === node.path

  return (
    <div>
      <div
        className={cn(
          `flex items-center py-0.5 px-1 hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary`,
          { 'bg-gray-200/80': isSelected }
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onKeyDown={(e) => onKeyDown?.(e, node)}
        role="treeitem"
        tabIndex={0}
        aria-expanded={node.type === 'folder' ? node.expanded : undefined}
        aria-selected={isSelected}
        aria-label={`${node.type === 'folder' ? 'Folder' : 'File'}: ${node.name}`}
      >
        {node.type === 'folder' ? (
          <>
            {node.expanded ? (
              <ChevronDownIcon className="w-4 mr-1" aria-hidden="true" />
            ) : (
              <ChevronRightIcon className="w-4 mr-1" aria-hidden="true" />
            )}
            <FolderIcon className="w-4 mr-2" aria-hidden="true" />
          </>
        ) : (
          <>
            <div className="w-4 mr-1" />
            <FileIcon className="w-4 mr-2" aria-hidden="true" />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {node.type === 'folder' && node.expanded && node.children && (
        <div role="group">{renderFileTree(node.children, depth + 1)}</div>
      )}
    </div>
  )
})
