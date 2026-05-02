'use client'

import { useState, useEffect, useCallback } from 'react'

const ONBOARDING_KEY = 'vibe-onboarding-completed'

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY)
    if (completed !== 'true') {
      setShowOnboarding(true)
    }
  }, [])

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setShowOnboarding(false)
  }, [])

  return {
    showOnboarding,
    completeOnboarding,
  }
}
