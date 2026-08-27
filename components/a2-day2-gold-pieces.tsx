"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface A2Day2GoldPiecesProps {
  fragments: any[];
  onNext: (goldPieces: any[]) => void;
  onBack: () => void;
}

export function A2Day2GoldPieces({
  fragments,
  onNext,
  onBack,
}: A2Day2GoldPiecesProps) {
  const [selectedGoldPieces, setSelectedGoldPieces] = useState<string[]>([]);

  const topFragments = fragments.slice(0, Math.min(5, fragments.length));

  const handleSelectPiece = (fragId: string) => {
    if (selectedGoldPieces.includes(fragId)) {
      setSelectedGoldPieces(selectedGoldPieces.filter((id) => id !== fragId));
    } else if (selectedGoldPieces.length < 3) {
      setSelectedGoldPieces([...selectedGoldPieces, fragId]);
    }
  };

  const isComplete = selectedGoldPieces.length === 3;

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div
        className="rounded-lg p-4"
        style={{
          backgroundColor: "rgba(90, 90, 150, 0.1)",
          borderColor: "rgba(80, 160, 170, 0.2)",
          border: "1px solid",
        }}
      >
        <h3 className="font-bold text-white mb-2">Las 3 Piezas de Oro</h3>
        <p className="text-sm text-white/70">
          Selecciona los 3 fragmentos más poderosos. Son tu evidencia más
          fuerte.
        </p>
      </div>

      {/* Gold Pieces Selection */}
      <div className="space-y-4">
        {topFragments.map((frag, idx) => (
          <button
            key={frag.id}
            onClick={() => handleSelectPiece(frag.id)}
            className="p-4 rounded-lg border-2 text-left transition-all"
            style={{
              borderColor: selectedGoldPieces.includes(frag.id)
                ? "rgb(80, 160, 170)"
                : "rgba(90, 90, 150, 0.2)",
              backgroundColor: selectedGoldPieces.includes(frag.id)
                ? "rgba(80, 160, 170, 0.1)"
                : "rgba(90, 90, 150, 0.05)",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-white/70 mb-2">
                  PIEZA DE ORO {idx + 1}
                </p>
                <p className="text-sm text-white/80 line-clamp-3">
                  {frag.text}
                </p>
              </div>
              {selectedGoldPieces.includes(frag.id) && (
                <div
                  className="w-5 h-5 rounded-full ml-3 flex-shrink-0"
                  style={{ backgroundColor: "rgb(80, 160, 170)" }}
                >
                  <span className="text-white text-xs flex items-center justify-center">
                    ✓
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-white/60">Categoría: {frag.category}</p>
          </button>
        ))}
      </div>

      {/* Selection Counter */}
      <div className="text-center">
        <p className="text-sm text-white/70">
          Piezas seleccionadas:{" "}
          <span className="font-semibold text-white">
            {selectedGoldPieces.length}/3
          </span>
        </p>
      </div>

      {/* CTA */}
      <div
        className="pt-4 border-t space-y-3"
        style={{ borderColor: "rgba(80, 160, 170, 0.2)" }}
      >
        <Button
          onClick={() =>
            onNext(
              selectedGoldPieces.map((id) =>
                fragments.find((f) => f.id === id),
              ),
            )
          }
          disabled={!isComplete}
          className="w-full"
          size="lg"
          style={{
            backgroundColor: isComplete
              ? "rgb(90, 90, 150)"
              : "rgba(90, 90, 150, 0.4)",
            color: "white",
          }}
        >
          Ver Resumen del Día 2 →
        </Button>

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white/70 text-sm transition w-full justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
    </div>
  );
}
