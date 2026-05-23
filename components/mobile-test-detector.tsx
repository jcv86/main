"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Tablet, Laptop, Wifi, Battery, Signal, Zap } from "lucide-react"

interface DeviceInfo {
  type: "mobile" | "tablet" | "desktop"
  width: number
  height: number
  userAgent: string
  touchSupport: boolean
  orientation: "portrait" | "landscape"
  pixelRatio: number
  connection?: string
  battery?: number
  platform: string
  maxTouchPoints: number
  isOnline: boolean
}

interface MobileTestDetectorProps {
  onDeviceChange?: (device: DeviceInfo) => void
}

export function MobileTestDetector({ onDeviceChange }: MobileTestDetectorProps) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const userAgent = navigator.userAgent
      const touchSupport = "ontouchstart" in window || navigator.maxTouchPoints > 0
      const orientation = width > height ? "landscape" : "portrait"
      const pixelRatio = window.devicePixelRatio || 1
      const maxTouchPoints = navigator.maxTouchPoints || 0
      const isOnline = navigator.onLine

      let type: "mobile" | "tablet" | "desktop"
      if (width < 768) {
        type = "mobile"
      } else if (width < 1024) {
        type = "tablet"
      } else {
        type = "desktop"
      }

      let platform = "Unknown"
      if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        platform = "iOS"
      } else if (userAgent.includes("Android")) {
        platform = "Android"
      } else if (userAgent.includes("Windows")) {
        platform = "Windows"
      } else if (userAgent.includes("Mac")) {
        platform = "macOS"
      } else if (userAgent.includes("Linux")) {
        platform = "Linux"
      }

      const info: DeviceInfo = {
        type,
        width,
        height,
        userAgent,
        touchSupport,
        orientation,
        pixelRatio,
        platform,
        maxTouchPoints,
        isOnline,
      }

      // Try to get connection info
      if ("connection" in navigator) {
        const connection = (navigator as any).connection
        info.connection = connection?.effectiveType || "unknown"
      }

      // Try to get battery info
      if ("getBattery" in navigator) {
        ;(navigator as any)
          .getBattery()
          .then((battery: any) => {
            info.battery = Math.round(battery.level * 100)
            setDeviceInfo({ ...info })
            onDeviceChange?.(info)
          })
          .catch(() => {
            setDeviceInfo(info)
            onDeviceChange?.(info)
          })
      } else {
        setDeviceInfo(info)
        onDeviceChange?.(info)
      }
    }

    const handleOnline = () => updateDeviceInfo()
    const handleOffline = () => updateDeviceInfo()

    updateDeviceInfo()
    window.addEventListener("resize", updateDeviceInfo)
    window.addEventListener("orientationchange", updateDeviceInfo)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("resize", updateDeviceInfo)
      window.removeEventListener("orientationchange", updateDeviceInfo)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [onDeviceChange, isClient])

  if (!isClient || !deviceInfo) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">Detecting device...</div>
        </CardContent>
      </Card>
    )
  }

  const getDeviceIcon = () => {
    switch (deviceInfo.type) {
      case "mobile":
        return <Smartphone className="h-5 w-5" />
      case "tablet":
        return <Tablet className="h-5 w-5" />
      default:
        return <Laptop className="h-5 w-5" />
    }
  }

  const getDeviceColor = () => {
    switch (deviceInfo.type) {
      case "mobile":
        return "bg-blue/10 text-blue border-blue/20"
      case "tablet":
        return "bg-purple/10 text-purple border-purple/20"
      default:
        return "bg-green/10 text-green border-green/20"
    }
  }

  const getPlatformIcon = () => {
    switch (deviceInfo.platform) {
      case "iOS":
        return ""
      case "Android":
        return "🤖"
      case "Windows":
        return "🪟"
      case "macOS":
        return "🍎"
      case "Linux":
        return "🐧"
      default:
        return ""
    }
  }

  return (
    <Card className="border-muted/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {getDeviceIcon()}
          Device Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Type & Platform */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Device Type</span>
          <div className="flex items-center gap-2">
            <Badge className={getDeviceColor()}>
              {deviceInfo.type.charAt(0).toUpperCase() + deviceInfo.type.slice(1)}
            </Badge>
            <span className="text-lg">{getPlatformIcon()}</span>
          </div>
        </div>

        {/* Screen Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Resolution</span>
            <p className="text-muted-foreground">
              {deviceInfo.width} × {deviceInfo.height}
            </p>
          </div>
          <div>
            <span className="font-medium">Orientation</span>
            <p className="text-muted-foreground capitalize">{deviceInfo.orientation}</p>
          </div>
        </div>

        {/* Touch Capabilities */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Touch Support</span>
            <Badge variant={deviceInfo.touchSupport ? "default" : "outline"}>
              {deviceInfo.touchSupport ? "✅ Enabled" : "❌ Disabled"}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Max Touch Points</span>
            <span className="text-muted-foreground font-mono">{deviceInfo.maxTouchPoints}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Pixel Ratio</span>
            <span className="text-muted-foreground font-mono">{deviceInfo.pixelRatio}x</span>
          </div>
        </div>

        {/* Network & System Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium flex items-center gap-1">
              <Wifi className="h-4 w-4" />
              Network Status
            </span>
            <Badge variant={deviceInfo.isOnline ? "default" : "destructive"}>
              {deviceInfo.isOnline ? "🟢 Online" : "🔴 Offline"}
            </Badge>
          </div>
          {deviceInfo.connection && (
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium flex items-center gap-1">
                <Signal className="h-4 w-4" />
                Connection Type
              </span>
              <span className="text-muted-foreground uppercase font-mono">{deviceInfo.connection}</span>
            </div>
          )}
          {deviceInfo.battery !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium flex items-center gap-1">
                <Battery className="h-4 w-4" />
                Battery Level
              </span>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground font-mono">{deviceInfo.battery}%</span>
                <div className="w-8 h-2 bg-muted/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${`}
                      deviceInfo.battery > 50
                        ? "bg-green/50"
                        : deviceInfo.battery > 20
                          ? "bg-orange"
                          : "bg-[rgba(80,160,170,0.5)]/50"`}
                    }`}
                    style={{ width: `${deviceInfo.battery}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Platform Details */}
        <div className="text-xs">
          <span className="font-medium">Platform:</span>
          <p className="text-muted-foreground mt-1">{deviceInfo.platform}</p>
        </div>

        {/* Gesture Testing Recommendations */}
        <div className="p-3 bg-muted/5 rounded-lg">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Zap className="h-4 w-4" />
            Gesture Testing Recommendations
          </h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            {deviceInfo.type === "mobile" && deviceInfo.touchSupport && (
              <>
                <p>• ✅ Perfect for comprehensive gesture testing</p>
                <p>• Test all swipe directions and pinch gestures</p>
                <p>• Verify touch accuracy and response times</p>
                <p>• Check multi-finger gesture support</p>
              </>
            )}
            {deviceInfo.type === "tablet" && deviceInfo.touchSupport && (
              <>
                <p>• ✅ Excellent for gesture testing</p>
                <p>• Test both portrait and landscape modes</p>
                <p>• Verify large screen touch interactions</p>
                <p>• Check edge gesture handling</p>
              </>
            )}
            {deviceInfo.type === "desktop" && !deviceInfo.touchSupport && (
              <>
                <p>•  Limited gesture testing capability</p>
                <p>• Mouse events will simulate touch</p>
                <p>• Pinch gestures not available</p>
                <p>• Use developer tools for mobile simulation</p>
              </>
            )}
            {deviceInfo.type === "desktop" && deviceInfo.touchSupport && (
              <>
                <p>• ✅ Touch-enabled desktop detected</p>
                <p>• Test desktop touch interactions</p>
                <p>• Verify hybrid input methods</p>
                <p>• Check touch and mouse compatibility</p>
              </>
            )}
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-blue/5 rounded">
            <div className="font-semibold text-blue">Touch Latency</div>
            <div className="text-blue">
              {deviceInfo.touchSupport ? (deviceInfo.type === "mobile" ? "~10ms" : "~15ms") : "N/A"}
            </div>
          </div>
          <div className="text-center p-2 bg-green/5 rounded">
            <div className="font-semibold text-green">Gesture Accuracy</div>
            <div className="text-green">
              {deviceInfo.touchSupport ? (deviceInfo.maxTouchPoints >= 5 ? "High" : "Medium") : "Low"}
            </div>
          </div>
          <div className="text-center p-2 bg-purple/5 rounded">
            <div className="font-semibold text-purple">Multi-Touch</div>
            <div className="text-purple">
              {deviceInfo.maxTouchPoints >= 2 ? `${deviceInfo.maxTouchPoints} points` : "Single"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
