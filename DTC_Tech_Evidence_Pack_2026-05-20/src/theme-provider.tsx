"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props} storageKey="theme-preference" disableTransitionOnChange forcedTheme={undefined}>
      {children}
    </NextThemesProvider>
  )
}
