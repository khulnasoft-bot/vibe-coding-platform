'use client'

import { BarLoader } from 'react-spinners'
import { CompassIcon, RefreshCwIcon, ExternalLinkIcon } from 'lucide-react'
import { Panel, PanelHeader } from '@/components/panels/panels'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  disabled?: boolean
  url?: string
}

export function PreviewComponent({ className, disabled, url }: Props) {
  const [currentUrl, setCurrentUrl] = useState(url)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState(url || '')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const loadStartTime = useRef<number | null>(null)

  useEffect(() => {
    if (url && url !== currentUrl) {
      setCurrentUrl(url)
      setInputValue(url)
      setIsLoading(true)
      setError(null)
    }
  }, [url, currentUrl])

  const refreshIframe = () => {
    if (iframeRef.current && currentUrl) {
      setIsLoading(true)
      setError(null)
      loadStartTime.current = Date.now()
      iframeRef.current.src = ''
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentUrl
        }
      }, 10)
    }
  }

  const loadNewUrl = () => {
    if (iframeRef.current && inputValue) {
      if (inputValue !== currentUrl) {
        setIsLoading(true)
        setError(null)
        loadStartTime.current = Date.now()
        iframeRef.current.src = inputValue
      } else {
        refreshIframe()
      }
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setError('Failed to load the page')
  }

  return (
    <Panel className={className}>
      <PanelHeader>
        <div className="flex items-center flex-1 gap-2">
          <div className="flex items-center space-x-1">
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer px-1 hover:text-primary"
              aria-label="Open in new tab"
            >
              <CompassIcon className="w-4" />
            </a>
            <button
              onClick={refreshIframe}
              type="button"
              className={cn('cursor-pointer px-1 hover:text-primary', {
                'animate-spin': isLoading,
              })}
              aria-label="Refresh preview"
            >
              <RefreshCwIcon className="w-4" />
            </button>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer px-1 hover:text-primary"
              aria-label="Open external"
            >
              <ExternalLinkIcon className="w-3 h-3" />
            </a>
          </div>
          <input
            type="text"
            className="flex-1 font-mono text-xs h-6 border border-gray-200 px-2 bg-white rounded focus:outline-none focus:ring-1 focus:ring-primary min-w-0"
            onChange={(event) => setInputValue(event.target.value)}
            onClick={(event) => (event.target as HTMLInputElement).select()}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.currentTarget.blur()
                loadNewUrl()
              }
            }}
            value={inputValue}
            aria-label="Preview URL"
          />
        </div>
      </PanelHeader>

      <div className="flex h-[calc(100%-2rem-1px)] relative">
        {disabled ? (
          <div className="flex items-center justify-center h-full w-full bg-muted/20">
            <div className="text-center">
              <CompassIcon className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm text-muted-foreground">Sandbox is stopped</p>
              <p className="text-xs text-muted-foreground mt-2">Create a new sandbox to continue</p>
            </div>
          </div>
        ) : currentUrl ? (
          <>
            <iframe
              ref={iframeRef}
              src={currentUrl}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />

            {isLoading && !error && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center flex-col gap-2">
                <BarLoader color="#666" />
                <span className="text-gray-500 text-xs">Loading preview...</span>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 bg-white flex items-center justify-center flex-col gap-2">
                <span className="text-red-500 text-sm">Failed to load page</span>
                <button
                  className="text-blue-500 hover:underline text-sm"
                  type="button"
                  onClick={() => {
                    if (currentUrl) {
                      setIsLoading(true)
                      setError(null)
                      const newUrl = new URL(currentUrl)
                      newUrl.searchParams.set('t', Date.now().toString())
                      setCurrentUrl(newUrl.toString())
                    }
                  }}
                >
                  Try again
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-muted/20">
            <div className="text-center">
              <CompassIcon className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm text-muted-foreground">No preview URL available</p>
              <p className="text-xs text-muted-foreground mt-2">Start a dev server in the sandbox to see the preview</p>
            </div>
          </div>
        )}
      </div>
    </Panel>
  )
}

export function Preview({ className, disabled, url }: Props) {
  const [currentUrl, setCurrentUrl] = useState(url)
  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState(url || '')
  const [isLoading, setIsLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const loadStartTime = useRef<number | null>(null)

  useEffect(() => {
    setCurrentUrl(url)
    setInputValue(url || '')
  }, [url])

  const refreshIframe = () => {
    if (iframeRef.current && currentUrl) {
      setIsLoading(true)
      setError(null)
      loadStartTime.current = Date.now()
      iframeRef.current.src = ''
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentUrl
        }
      }, 10)
    }
  }

  const loadNewUrl = () => {
    if (iframeRef.current && inputValue) {
      if (inputValue !== currentUrl) {
        setIsLoading(true)
        setError(null)
        loadStartTime.current = Date.now()
        iframeRef.current.src = inputValue
      } else {
        refreshIframe()
      }
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setError('Failed to load the page')
  }

  return (
    <Panel className={className}>
      <PanelHeader>
        <div className="absolute flex items-center space-x-1">
          <a href={currentUrl} target="_blank" className="cursor-pointer px-1">
            <CompassIcon className="w-4" />
          </a>
          <button
            onClick={refreshIframe}
            type="button"
            className={cn('cursor-pointer px-1', {
              'animate-spin': isLoading,
            })}
          >
            <RefreshCwIcon className="w-4" />
          </button>
        </div>

        <div className="m-auto h-6">
          {url && (
            <input
              type="text"
              className="font-mono text-xs h-6 border border-gray-200 px-4 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[300px]"
              onChange={(event) => setInputValue(event.target.value)}
              onClick={(event) => event.currentTarget.select()}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.currentTarget.blur()
                  loadNewUrl()
                }
              }}
              value={inputValue}
            />
          )}
        </div>
      </PanelHeader>

      <div className="flex h-[calc(100%-2rem-1px)] relative">
        {currentUrl && !disabled && (
          <>
            <ScrollArea className="w-full">
              <iframe
                ref={iframeRef}
                src={currentUrl}
                className="w-full h-full"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title="Browser content"
              />
            </ScrollArea>

            {isLoading && !error && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center flex-col gap-2">
                <BarLoader color="#666" />
                <span className="text-gray-500 text-xs">Loading...</span>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 bg-white flex items-center justify-center flex-col gap-2">
                <span className="text-red-500">Failed to load page</span>
                <button
                  className="text-blue-500 hover:underline text-sm"
                  type="button"
                  onClick={() => {
                    if (currentUrl) {
                      setIsLoading(true)
                      setError(null)
                      const newUrl = new URL(currentUrl)
                      newUrl.searchParams.set('t', Date.now().toString())
                      setCurrentUrl(newUrl.toString())
                    }
                  }}
                >
                  Try again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Panel>
  )
}
