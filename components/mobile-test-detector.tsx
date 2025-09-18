"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Tablet, Laptop, Wifi, Battery, Signal } from "lucide-react"

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
}

interface MobileTestDetectorProps {
  onDeviceChange?: (device: DeviceInfo) => void
}

export function MobileTestDetector({ onDeviceChange }: MobileTestDetectorProps) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const userAgent = navigator.userAgent
      const touchSupport = "ontouchstart" in window || navigator.maxTouchPoints > 0
      const orientation = width > height ? "landscape" : "portrait"
      const pixelRatio = window.devicePixelRatio || 1

      let type: "mobile" | "tablet" | "desktop"
      if (width < 768) {
        type = "mobile"
      } else if (width < 1024) {
        type = "tablet"
      } else {
        type = "desktop"
      }

      const info: DeviceInfo = {
        type,
        width,
        height,
        userAgent,
        touchSupport,
        orientation,
        pixelRatio,
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

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

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
  }, [onDeviceChange])

  if (!deviceInfo) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-gray-500">Detecting device...</div>
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
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "tablet":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-green-100 text-green-700 border-green-200"
    }
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {getDeviceIcon()}
          Device Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Type */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Device Type</span>
          <Badge className={getDeviceColor()}>
            {deviceInfo.type.charAt(0).toUpperCase() + deviceInfo.type.slice(1)}
          </Badge>
        </div>

        {/* Screen Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Resolution</span>
            <p className="text-gray-600">
              {deviceInfo.width} × {deviceInfo.height}
            </p>
          </div>
          <div>
            <span className="font-medium">Orientation</span>
            <p className="text-gray-600 capitalize">{deviceInfo.orientation}</p>
          </div>
        </div>

        {/* Capabilities */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Touch Support</span>
            <Badge variant={deviceInfo.touchSupport ? "default" : "outline"}>
              {deviceInfo.touchSupport ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Pixel Ratio</span>
            <span className="text-gray-600">{deviceInfo.pixelRatio}x</span>
          </div>
        </div>

        {/* Network Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium flex items-center gap-1">
              <Wifi className="h-4 w-4" />
              Online Status
            </span>
            <Badge variant={isOnline ? "default" : "destructive"}>{isOnline ? "Online" : "Offline"}</Badge>
          </div>
          {deviceInfo.connection && (
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium flex items-center gap-1">
                <Signal className="h-4 w-4" />
                Connection
              </span>
              <span className="text-gray-600 uppercase">{deviceInfo.connection}</span>
            </div>
          )}
          {deviceInfo.battery !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium flex items-center gap-1">
                <Battery className="h-4 w-4" />
                Battery
              </span>
              <span className="text-gray-600">{deviceInfo.battery}%</span>
            </div>
          )}
        </div>

        {/* User Agent (truncated) */}
        <div className="text-xs">
          <span className="font-medium">User Agent:</span>
          <p className="text-gray-600 break-all mt-1">
            {deviceInfo.userAgent.length > 100 ? `${deviceInfo.userAgent.substring(0, 100)}...` : deviceInfo.userAgent}
          </p>
        </div>

        {/* Test Recommendations */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Test Recommendations</h4>
          <div className="space-y-1 text-xs text-gray-600">
            {deviceInfo.type === "mobile" && (
              <>
                <p>• Test touch interactions and gestures</p>
                <p>• Verify responsive layout on small screens</p>
                <p>• Check loading performance on mobile networks</p>
              </>
            )}
            {deviceInfo.type === "tablet" && (
              <>
                <p>• Test both portrait and landscape orientations</p>
                <p>• Verify touch and keyboard input methods</p>
                <p>• Check medium-sized screen layouts</p>
              </>
            )}
            {deviceInfo.type === "desktop" && (
              <>
                <p>• Test keyboard navigation and shortcuts</p>
                <p>• Verify mouse hover interactions</p>
                <p>• Check large screen layouts and spacing</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
