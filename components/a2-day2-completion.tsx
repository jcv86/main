"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface A2Day2CompletionProps {
  vaultData: any;
  onComplete: () => Promise<void>;
  onRevise: () => void;
}

export function A2Day2Completion({
  vaultData,
  onComplete,
  onRevise,
}: A2Day2CompletionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onComplete();
    } catch (err) {
      console.error("[v0] Error completing Day 2:", err);
      setSubmitError(
        "No pudimos validar el Día 2. Revisa tu conexión e inténtalo nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-6">
      {/* Success State */}
      <div
        className="rounded-lg p-8 text-center space-y-4"
        style={{
          backgroundColor: "rgba(80, 160, 170, 0.1)",
          borderColor: "rgba(80, 160, 170, 0.2)",
          border: "1px solid",
        }}
      >
        <div className="flex items-center justify-center mb-4">
          <CheckCircle
            className="w-12 h-12"
            style={{ color: "rgb(80, 160, 170)" }}
          />
        </div>

        <h2 className="text-2xl font-bold text-white">
          Día 2 listo para validar
        </h2>

        <div className="space-y-1">
          <p className="text-white/80">
            Revisa el resumen y envía tu evidencia para completar el día.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div
        className="rounded-lg p-6 space-y-4"
        style={{
          backgroundColor: "rgba(90, 90, 150, 0.05)",
          borderColor: "rgba(80, 160, 170, 0.2)",
          border: "1px solid",
        }}
      >
        <p className="font-semibold text-white">Resumen del Día 2:</p>

        <div className="space-y-2 text-sm text-white/70">
          <div className="flex items-center justify-between">
            <p>Tipo de Bóveda:</p>
            <span className="text-white capitalize">{vaultData.vaultType}</span>
          </div>
          <div className="flex items-center justify-between">
            <p>Fragmentos Recolectados:</p>
            <span className="text-white">
              {vaultData.fragments?.length || 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p>Piezas de Oro:</p>
            <span className="text-white">
              {vaultData.goldPieces?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Mini Lesson */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{
          backgroundColor: "rgba(80, 160, 170, 0.1)",
          border: "1px solid rgba(80, 160, 170, 0.2)",
        }}
      >
        <p className="text-sm font-semibold text-white/90">Lo que viene:</p>
        <p className="text-sm text-white/70">
          Días 3-4 analizaremos el mercado y cruzaremos tu evidencia con lo que
          pide el mercado. Tu bóveda será la fuente de verdad para todo lo que
          construyamos adelante.
        </p>
      </div>

      {/* CTA */}
      <div
        className="pt-4 border-t space-y-3"
        style={{ borderColor: "rgba(80, 160, 170, 0.2)" }}
      >
        {submitError ? (
          <p role="alert" className="text-sm text-red-300 text-center">
            {submitError}
          </p>
        ) : null}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
          size="lg"
          style={{ backgroundColor: "rgb(90, 90, 150)", color: "white" }}
        >
          {isSubmitting ? "Guardando..." : "Desbloquear Día 3 →"}
        </Button>

        <Button
          onClick={onRevise}
          variant="outline"
          className="w-full"
          style={{
            borderColor: "rgba(80, 160, 170, 0.2)",
            color: "white",
          }}
        >
          Revisar Evidencia
        </Button>
      </div>
    </div>
  );
}
