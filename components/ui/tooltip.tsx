'use client'

import { cn } from '@/lib/utils'
import { useState, useCallback } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const show = useCallback(() => setIsVisible(true), [])
  const hide = useCallback(() => setIsVisible(false), [])

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-md',
            sideClasses[side]
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}

interface OnboardingTourProps {
  steps: { target: string; content: string }[]
  onComplete: () => void
}

export function OnboardingTour({ steps, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)

  if (currentStep >= steps.length) {
    return null
  }

  const step = steps[currentStep]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-lg bg-white p-6 shadow-xl max-w-md">
        <h3 className="mb-2 text-lg font-semibold">Welcome to Vibe Coding Platform</h3>
        <p className="mb-4 text-sm text-gray-600">{step.content}</p>
        <div className="flex justify-between">
          <span className="text-xs text-gray-400">
            {currentStep + 1} / {steps.length}
          </span>
          <div className="space-x-2">
            {currentStep > 0 && (
              <button
                className="rounded border px-3 py-1 text-sm"
                onClick={() => setCurrentStep((prev) => prev - 1)}
              >
                Back
              </button>
            )}
            <button
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
              onClick={() => {
                if (currentStep === steps.length - 1) {
                  onComplete()
                } else {
                  setCurrentStep((prev) => prev + 1)
                }
              }}
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
