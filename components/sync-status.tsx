"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { syncService } from "@/lib/sync-service"

interface SyncStatusProps {
  variant?: "full" | "compact"
}

export function SyncStatusComponent({ variant = "full" }: SyncStatusProps) {
  const [status, setStatus] = useState(syncService.getStatus())

  useEffect(() => {
    const unsubscribe = syncService.onStatusChange(setStatus)
    return unsubscribe
  }, [])

  const handleManualSync = () => {
    syncService.syncWhenOnline()
  }

  const getStatusIcon = () => {
    if (!status.isOnline) {
      return <WifiOff className="w-4 h-4 text-red-500" />
    }
    if (status.syncInProgress) {
      return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
    }
    if (status.error) {
      return <AlertCircle className="w-4 h-4 text-red-500" />
    }
    if (status.pendingItems > 0) {
      return <Clock className="w-4 h-4 text-yellow-500" />
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />
  }

  const getStatusText = () => {
    if (!status.isOnline) {
      return "Sin conexión"
    }
    if (status.syncInProgress) {
      return "Sincronizando..."
    }
    if (status.error) {
      return `Error: ${status.error}`
    }
    if (status.pendingItems > 0) {
      return `${status.pendingItems} elementos pendientes`
    }
    return "Sincronizado"
  }

  const getStatusColor = () => {
    if (!status.isOnline || status.error) {
      return "destructive"
    }
    if (status.syncInProgress || status.pendingItems > 0) {
      return "secondary"
    }
    return "default"
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <Badge variant={getStatusColor() as any} className="text-xs">
          {getStatusText()}
        </Badge>
        {status.pendingItems > 0 && status.isOnline && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleManualSync}
            disabled={status.syncInProgress}
            className="h-6 px-2 text-xs bg-transparent"
          >
            Sincronizar
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <p className="text-sm font-medium">{getStatusText()}</p>
              {status.lastSync && (
                <p className="text-xs text-gray-500">Última sincronización: {status.lastSync.toLocaleTimeString()}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {status.pendingItems > 0 && <Badge variant="secondary">{status.pendingItems}</Badge>}
            {status.isOnline && (
              <Button size="sm" variant="outline" onClick={handleManualSync} disabled={status.syncInProgress}>
                {status.syncInProgress ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
                {status.syncInProgress ? "Sincronizando" : "Sincronizar"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
