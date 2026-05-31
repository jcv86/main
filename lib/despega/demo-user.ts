// Issue #8: Secure demo user handling without localStorage PII
// Stores only demo_mode flag (safe boolean), NOT user data

export function setDemoMode(enabled: boolean) {
  if (typeof window === "undefined") return
  if (enabled) {
    localStorage.setItem("demo_mode", "true")
  } else {
    localStorage.removeItem("demo_mode")
  }
}

export function getDemoMode(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("demo_mode") === "true"
}

export function clearDemoMode() {
  if (typeof window === "undefined") return
  localStorage.removeItem("demo_mode")
}
