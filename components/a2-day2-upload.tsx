"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

interface EvidenceFragment {
  id: string;
  text: string;
  category: string;
}

interface A2Day2UploadProps {
  onNext: (fragments: EvidenceFragment[]) => void;
  onBack: () => void;
}

function parseFragments(content: string): EvidenceFragment[] {
  return content
    .split(/\n\s*\n/)
    .map((text) => text.trim())
    .filter(Boolean)
    .slice(0, 20)
    .map((text, index) => ({ id: `frag-${index + 1}`, text, category: "" }));
}

export function A2Day2Upload({ onNext, onBack }: A2Day2UploadProps) {
  const [content, setContent] = useState("");
  const fragments = useMemo(() => parseFragments(content), [content]);
  const isComplete = fragments.length >= 7;

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
        <h3 className="font-bold text-white mb-2">Registrar tus fragmentos</h3>
        <p className="text-sm text-white/70">
          Escribe una evidencia por bloque y sepárala de la siguiente con una
          línea en blanco. Necesitas al menos 7.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="day2-fragments"
          className="text-sm font-semibold text-white"
        >
          Evidencias de tu experiencia
        </label>
        <Textarea
          id="day2-fragments"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={
            "Ejemplo: Reduje el tiempo de respuesta del equipo en 25%.\n\nEjemplo: Coordiné el lanzamiento de una nueva funcionalidad."
          }
          className="min-h-[300px]"
          style={{
            backgroundColor: "rgba(15, 15, 30, 0.5)",
            borderColor: "rgba(80, 160, 170, 0.2)",
            color: "white",
          }}
        />
      </div>

      <div
        className="rounded-lg p-4"
        style={{
          backgroundColor: isComplete
            ? "rgba(80, 160, 170, 0.1)"
            : "rgba(90, 90, 150, 0.1)",
          borderColor: isComplete
            ? "rgba(80, 160, 170, 0.2)"
            : "rgba(90, 90, 150, 0.2)",
          border: "1px solid",
        }}
        aria-live="polite"
      >
        <p className="text-sm font-semibold text-white">
          Fragmentos registrados:{" "}
          <span
            style={{
              color: isComplete ? "rgb(80, 160, 170)" : "rgb(150, 150, 200)",
            }}
          >
            {fragments.length}
          </span>
        </p>
        <p className="text-xs text-white/50 mt-1">
          Necesitas 7 o más fragmentos separados por una línea en blanco.
        </p>
      </div>

      <div
        className="pt-4 border-t space-y-3"
        style={{ borderColor: "rgba(80, 160, 170, 0.2)" }}
      >
        <Button
          onClick={() => onNext(fragments)}
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
          Clasificar evidencia →
        </Button>
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
