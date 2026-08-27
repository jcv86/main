"use client";

import { useState } from "react";
import { ArrowLeft, Tags } from "lucide-react";

interface EvidenceFragment {
  id: string;
  text: string;
  category: string;
}
interface A2Day2ClassificationProps {
  fragments: EvidenceFragment[];
  onNext: (classified: EvidenceFragment[]) => void;
  onBack: () => void;
}

const CATEGORIES = [
  { value: "achievement", label: "Logro" },
  { value: "responsibility", label: "Responsabilidad" },
  { value: "recognition", label: "Reconocimiento" },
  { value: "metric", label: "Resultado medible" },
  { value: "learning", label: "Aprendizaje" },
] as const;

export function A2Day2Classification({
  fragments,
  onNext,
  onBack,
}: A2Day2ClassificationProps) {
  const [classifiedFragments, setClassifiedFragments] =
    useState<EvidenceFragment[]>(fragments);
  const classifiedCount = classifiedFragments.filter(
    (fragment) => fragment.category,
  ).length;
  const isComplete = classifiedCount >= 3;

  const setCategory = (fragmentId: string, category: string) => {
    setClassifiedFragments((current) =>
      current.map((fragment) =>
        fragment.id === fragmentId ? { ...fragment, category } : fragment,
      ),
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-6">
      <div
        className="rounded-lg p-4"
        style={{
          backgroundColor: "rgba(90, 90, 150, 0.1)",
          borderColor: "rgba(80, 160, 170, 0.2)",
          border: "1px solid",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Tags className="w-5 h-5" style={{ color: "rgb(80, 160, 170)" }} />
          <h3 className="font-bold text-white">Clasifica tu evidencia</h3>
        </div>
        <p className="text-sm text-white/70">
          Elige la categoría que mejor describe cada fragmento. Clasifica al
          menos 3 para continuar.
        </p>
      </div>

      <div className="space-y-3">
        {classifiedFragments.map((fragment, index) => (
          <fieldset
            key={fragment.id}
            className="p-4 rounded-lg space-y-3"
            style={{
              backgroundColor: "rgba(90, 90, 150, 0.05)",
              borderColor: "rgba(80, 160, 170, 0.2)",
              border: "1px solid",
            }}
          >
            <legend className="text-xs font-semibold text-white/70 px-1">
              Fragmento {index + 1}
            </legend>
            <p className="text-sm text-white/80">{fragment.text}</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const selected = fragment.category === category.value;
                return (
                  <button
                    key={category.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setCategory(fragment.id, category.value)}
                    className="text-xs px-3 py-2 rounded-md border transition-colors"
                    style={{
                      backgroundColor: selected
                        ? "rgba(80, 160, 170, 0.2)"
                        : "rgba(15, 15, 30, 0.35)",
                      borderColor: selected
                        ? "rgb(80, 160, 170)"
                        : "rgba(255,255,255,0.15)",
                      color: selected ? "white" : "rgba(255,255,255,0.7)",
                    }}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <p className="text-sm text-white/70 text-center" aria-live="polite">
        Fragmentos clasificados:{" "}
        <span className="font-semibold text-white">
          {classifiedCount}/{classifiedFragments.length}
        </span>
      </p>
      <div
        className="pt-4 border-t space-y-3"
        style={{ borderColor: "rgba(80, 160, 170, 0.2)" }}
      >
        <button
          type="button"
          onClick={() => onNext(classifiedFragments)}
          disabled={!isComplete}
          className="w-full py-3 rounded-lg text-white font-semibold transition disabled:cursor-not-allowed"
          style={{
            backgroundColor: isComplete
              ? "rgb(90, 90, 150)"
              : "rgba(90, 90, 150, 0.4)",
          }}
        >
          Elegir las 3 piezas de oro →
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white/70 text-sm transition w-full justify-center"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
      </div>
    </div>
  );
}
