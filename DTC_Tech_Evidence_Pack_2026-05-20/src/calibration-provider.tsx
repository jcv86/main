"use client"

import { createContext, useContext, ReactNode } from "react"
import { useA4Calibration, CalibrationParameters } from "@/hooks/use-a4-calibration"

const CalibrationContext = createContext<CalibrationParameters | undefined>(undefined)

interface CalibrationProviderProps {
  children: ReactNode
}

export function CalibrationProvider({ children }: CalibrationProviderProps) {
  const calibration = useA4Calibration()

  return (
    <CalibrationContext.Provider value={calibration}>
      {children}
    </CalibrationContext.Provider>
  )
}

export function useCalibration(): CalibrationParameters {
  const context = useContext(CalibrationContext)
  if (!context) {
    throw new Error("useCalibration must be used within CalibrationProvider")
  }
  return context
}
