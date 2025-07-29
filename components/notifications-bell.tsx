"use client"

import type React from "react"

import { useState } from "react"
import { Bell, X, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotifications } from "@/contexts/notifications-context"
import { cn } from "@/lib/utils"

const iconosPorTipo = {
  info: "ℹ️",
  exito: "✅",
  advertencia: "⚠️",
  error: "❌",
}

const coloresPorTipo = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  exito: "bg-green-50 border-green-200 text-green-800",
  advertencia: "bg-yellow-50 border-yellow-200 text-yellow-800",
  error: "bg-red-50 border-red-200 text-red-800",
}

const coloresPorPrioridad = {
  baja: "border-l-gray-400",
  media: "border-l-blue-400",
  alta: "border-l-orange-400",
  urgente: "border-l-red-500",
}

export function NotificationsBell() {
  const {
    notifications,
    notificacionesNoLeidas,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
    obtenerNotificacionesPorCategoria,
  } = useNotifications()

  const [isOpen, setIsOpen] = useState(false)
  const [filtroActivo, setFiltroActivo] = useState<string>("todas")

  const handleNotificationClick = async (id: string) => {
    await marcarComoLeida(id)
  }

  const handleMarkAllAsRead = async () => {
    await marcarTodasComoLeidas()
  }

  const handleDeleteNotification = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    eliminarNotificacion(id)
  }

  const formatearFecha = (fecha: string) => {
    const ahora = new Date()
    const fechaNotif = new Date(fecha)
    const diferencia = ahora.getTime() - fechaNotif.getTime()
    const minutos = Math.floor(diferencia / (1000 * 60))
    const horas = Math.floor(diferencia / (1000 * 60 * 60))
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))

    if (minutos < 1) return "Ahora mismo"
    if (minutos < 60) return `Hace ${minutos} min`
    if (horas < 24) return `Hace ${horas}h`
    if (dias < 7) return `Hace ${dias}d`
    return fechaNotif.toLocaleDateString("es-CL")
  }

  const obtenerNotificacionesFiltradas = () => {
    if (filtroActivo === "todas") return notifications
    if (filtroActivo === "no-leidas") return notifications.filter((n) => !n.leida)
    return obtenerNotificacionesPorCategoria(filtroActivo)
  }

  const notificacionesFiltradas = obtenerNotificacionesFiltradas()

  const contadorPorCategoria = {
    evaluacion: obtenerNotificacionesPorCategoria("evaluacion").filter((n) => !n.leida).length,
    trabajo: obtenerNotificacionesPorCategoria("trabajo").filter((n) => !n.leida).length,
    biblioteca: obtenerNotificacionesPorCategoria("biblioteca").filter((n) => !n.leida).length,
    coach: obtenerNotificacionesPorCategoria("coach").filter((n) => !n.leida).length,
    logro: obtenerNotificacionesPorCategoria("logro").filter((n) => !n.leida).length,
    sistema: obtenerNotificacionesPorCategoria("sistema").filter((n) => !n.leida).length,
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 px-0">
          <Bell className="h-4 w-4" />
          {notificacionesNoLeidas > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {notificacionesNoLeidas > 99 ? "99+" : notificacionesNoLeidas}
            </Badge>
          )}
          <span className="sr-only">Notificaciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="font-semibold">Notificaciones</span>
            {notificacionesNoLeidas > 0 && (
              <Badge variant="secondary" className="text-xs">
                {notificacionesNoLeidas} nuevas
              </Badge>
            )}
          </div>
          {notificacionesNoLeidas > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto p-1 text-xs hover:bg-muted"
              title="Marcar todas como leídas"
            >
              <CheckCheck className="h-3 w-3" />
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-2">
          <Tabs value={filtroActivo} onValueChange={setFiltroActivo} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-8 text-xs">
              <TabsTrigger value="todas" className="text-xs">
                Todas ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="no-leidas" className="text-xs">
                No leídas ({notificacionesNoLeidas})
              </TabsTrigger>
              <TabsTrigger value="trabajo" className="text-xs">
                Trabajos ({contadorPorCategoria.trabajo})
              </TabsTrigger>
            </TabsList>

            <div className="mt-2">
              <ScrollArea className="h-80">
                {notificacionesFiltradas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {filtroActivo === "no-leidas" ? "No tienes notificaciones sin leer" : "No hay notificaciones"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notificacionesFiltradas.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={cn(
                          "relative p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                          !notification.leida ? "bg-muted/30 border-primary/20" : "bg-background",
                          coloresPorTipo[notification.tipo],
                          `border-l-4 ${coloresPorPrioridad[notification.prioridad || "media"]}`,
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <span className="text-lg flex-shrink-0 mt-0.5">
                              {notification.icono || iconosPorTipo[notification.tipo]}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-medium text-sm leading-tight truncate">{notification.titulo}</h4>
                                {!notification.leida && (
                                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.mensaje}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatearFecha(notification.fechaCreacion)}
                                </span>
                                {notification.categoria && (
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    {notification.categoria}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                            title="Eliminar notificación"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </Tabs>
        </div>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs bg-transparent"
                onClick={() => setIsOpen(false)}
              >
                Ver todas las notificaciones
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
