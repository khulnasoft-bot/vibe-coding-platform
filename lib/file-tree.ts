import type { FileNode } from '@/components/file-explorer/build-file-tree'

export function findNodeByPath(
  nodes: FileNode[],
  path: string
): FileNode | null {
  for (const node of nodes) {
    if (node.path === path) return node
    if (node.children) {
      const found = findNodeByPath(node.children, path)
      if (found) return found
    }
  }
  return null
}
