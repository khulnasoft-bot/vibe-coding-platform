'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useQueryState } from 'nuqs'
import { parseAsArrayOf, parseAsInteger } from 'nuqs'

export function PortSettings() {
  const [ports, setPorts] = useQueryState(
    'ports',
    parseAsArrayOf(parseAsInteger).withDefault([])
  )

  const handlePortChange = (index: number, value: string) => {
    const newPorts = [...ports]
    const portNum = parseInt(value, 10)
    if (!isNaN(portNum) && portNum >= 1 && portNum <= 65535) {
      newPorts[index] = portNum
      setPorts(newPorts)
    } else if (value === '') {
      newPorts[index] = undefined as any
      setPorts(newPorts.filter((p) => p !== undefined))
    }
  }

  const addPort = () => {
    if (ports.length < 2) {
      setPorts([...ports, 3000])
    }
  }

  const removePort = (index: number) => {
    setPorts(ports.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">Sandbox Ports</Label>
      <p className="text-xs text-muted-foreground">
        Ports to expose for preview (max 2). Set when creating a new sandbox.
      </p>
      {ports.map((port, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            className="w-24"
            type="number"
            min={1}
            max={65535}
            value={port}
            onChange={(e) => handlePortChange(index, e.target.value)}
          />
          <button
            className="text-xs text-red-500 hover:text-red-700"
            onClick={() => removePort(index)}
          >
            Remove
          </button>
        </div>
      ))}
      {ports.length < 2 && (
        <button
          className="text-xs text-blue-500 hover:text-blue-700"
          onClick={addPort}
        >
          + Add port
        </button>
      )}
    </div>
  )
}
