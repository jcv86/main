'use client'

import { useState, useEffect } from 'react'
import type { ModuleNumber } from './a3-session-logic'
import { MODULE_MAP } from './a3-session-logic'

export interface A3SessionVerificationState {
  moduleNumber: ModuleNumber
  moduleId: string
  moduleName: string
  sessionType: 'coach_training' | 'interviewer_simulation'
  character: 'coach' | 'sofia' | 'elena' | 'bruno'
  showCameraModal: boolean
  cameraVerified: boolean
  microphoneVerified: boolean
}

/**
 * Hook to manage A3 session verification and permissions
 */
export function useA3SessionVerification(moduleId: string) {
  const [state, setState] = useState<A3SessionVerificationState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Find module by ID
    const moduleEntry = Object.entries(MODULE_MAP).find(
      ([_, module]) => module.id === moduleId
    )

    if (!moduleEntry) {
      console.error(`[v0] Module ${moduleId} not found in MODULE_MAP`)
      setIsLoading(false)
      return
    }

    const [moduleNumber, moduleData] = moduleEntry as unknown as [ModuleNumber, typeof MODULE_MAP[ModuleNumber]]

    setState({
      moduleNumber,
      moduleId: moduleData.id,
      moduleName: moduleData.name,
      sessionType: moduleData.type,
      character: moduleData.type === 'coach_training' ? 'coach' : 'sofia',
      showCameraModal: false,
      cameraVerified: false,
      microphoneVerified: false,
    })

    setIsLoading(false)
  }, [moduleId])

  const requestCameraPermission = () => {
    if (state) {
      setState({ ...state, showCameraModal: true })
    }
  }

  const handleCameraVerified = () => {
    if (state) {
      setState({
        ...state,
        showCameraModal: false,
        cameraVerified: true,
        microphoneVerified: true,
      })
    }
  }

  const handleCameraVerificationClosed = () => {
    if (state) {
      setState({ ...state, showCameraModal: false })
    }
  }

  return {
    state,
    isLoading,
    requestCameraPermission,
    handleCameraVerified,
    handleCameraVerificationClosed,
  }
}
