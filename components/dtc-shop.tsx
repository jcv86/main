'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Clock3, ShieldCheck, Zap } from 'lucide-react'

interface DTCShopProps {
  currentBalance: number
}

export function DTCShop({ currentBalance }: DTCShopProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-8 h-8 text-orange" />
          <h1 className="text-3xl font-bold text-foreground">Puntos DTC</h1>
        </div>
        <p className="text-muted-foreground">
          Saldo actual: <strong>{currentBalance} puntos DTC</strong>
        </p>
      </div>

      <Card className="p-8 space-y-6">
        <div className="flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-training flex-shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Las compras todavía no están habilitadas
            </h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              No se realizará ningún cobro ni se acreditarán puntos mediante una compra
              simulada. La tienda se activará cuando exista un proveedor de pagos real,
              verificación de transacciones y precios definitivos.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-[20px] bg-muted/10 p-5">
          <Clock3 className="w-6 h-6 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Mientras tanto, el saldo solo puede cambiar mediante acciones verificadas por
            el servidor dentro del producto.
          </p>
        </div>

        <Button disabled className="w-full">
          Compra de puntos: próximamente
        </Button>
      </Card>
    </div>
  )
}
