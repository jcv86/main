// DTC Referents Framework
// Maps Hidden Brain (Vedantam), Adam Grant, and Behavioral Economics to pillar implementation

export const DTC_REFERENTS = {
  // HIDDEN BRAIN (Vedantam) - Explanation-focused
  HIDDEN_BRAIN: {
    focus: "Invisible patterns that shape behavior",
    pillars: ["A1", "A4"],
    principles: [
      "Context explains more than individual traits",
      "Rules/norms drive behavior invisibly",
      "Culture shapes decision-making",
      "System-level thinking before individual judgment",
      "Stories are how patterns are taught",
    ],
    implementation: {
      A1: "Recognize cognitive patterns, not personality traits",
      A4: "Understand market/labor system rules, not information gaps",
    },
  },

  // ADAM GRANT (Think Again) - Application-focused
  ADAM_GRANT: {
    focus: "Rethinking & intellectual humility in action",
    pillars: ["A2", "A3"],
    principles: [
      "Discomfort drives growth (preacher/prosecutor/politician modes)",
      "Experiment mindset beats prescriptive thinking",
      "Micro-experiments allow safe rethinking",
      "Growth mindset + psychological safety required",
      "Flexibility > rigid frameworks",
    ],
    implementation: {
      A2: "Progressive deepening through alternative perspectives",
      A3: "Simulation allows low-risk rethinking and experimentation",
    },
  },

  // BEHAVIORAL ECONOMICS - Cross-pillar
  BEHAVIORAL_ECONOMICS: {
    focus: "Decision-making under uncertainty",
    concepts: [
      "Status quo bias",
      "Loss aversion",
      "Anchoring effects",
      "Social proof",
      "Choice architecture",
    ],
  },
}

export const PILLAR_REFERENTS_MAP = {
  A1: {
    primary: "Hidden Brain - Vedantam",
    secondary: "Behavioral Economics",
    approach: "Pattern explanation (invisible systems)",
    methodology: "Diagnostic + contextualization",
  },
  A2: {
    primary: "Adam Grant - Think Again",
    secondary: "Behavioral Economics",
    approach: "Progressive deepening (intellectual flexibility)",
    methodology: "Multi-perspective exploration + dialogue",
  },
  A3: {
    primary: "Adam Grant - Think Again",
    secondary: "Behavioral Economics",
    approach: "Applied experimentation (safe rethinking)",
    methodology: "Simulation + micro-experiments + pause-explain",
  },
  A4: {
    primary: "Hidden Brain - Vedantam",
    secondary: "Behavioral Economics",
    approach: "System literacy (market rules + context)",
    methodology: "Translation + contextualization",
  },
}

export const REFERENT_VALIDATION = {
  checkA1Coherence: (text: string): boolean => {
    const hiddenBrainKeywords = ["patrón", "sistema", "contexto", "reglas", "normas", "invisible"]
    return hiddenBrainKeywords.some(kw => text.toLowerCase().includes(kw))
  },
  
  checkA2Coherence: (text: string): boolean => {
    const adamGrantKeywords = ["perspectiva", "alternativa", "flexibilidad", "explorar", "redefinir"]
    return adamGrantKeywords.some(kw => text.toLowerCase().includes(kw))
  },
  
  checkA3Coherence: (text: string): boolean => {
    const experimentKeywords = ["experimento", "probar", "variación", "seguro", "repetir"]
    return experimentKeywords.some(kw => text.toLowerCase().includes(kw))
  },
  
  checkA4Coherence: (text: string): boolean => {
    const systemKeywords = ["sistema", "mercado", "regla", "funciona", "contexto", "laboral"]
    return systemKeywords.some(kw => text.toLowerCase().includes(kw))
  },
}
