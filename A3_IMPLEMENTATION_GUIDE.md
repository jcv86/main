"""
A3 STANDARDIZATION IMPLEMENTATION GUIDE

This guide provides the step-by-step process to implement the standardized AnswerInputWithCoach 
component across all A3 modules (P1-P4).

## Quick Implementation Checklist

For each module that needs standardization:

1. **Import the component and hook**
   ```tsx
   import { AnswerInputWithCoach } from '@/components/answer-input-with-coach'
   import { useSpeechRecognition } from '@/hooks/use-speech-recognition'
   ```

2. **Replace textarea sections** with the AnswerInputWithCoach component
   - Pass the question as prop
   - Connect to state for answer storage
   - Enable onCoachTip callback

3. **Remove old STT/microphone implementations**
   - Remove duplicated speech recognition code
   - Remove hardcoded colors (red, purple hover states)
   - Remove custom coach panels

4. **Verify OpenAI integration**
   - Ensure OPENAI_API_KEY is set
   - Test coach suggestions work

## Integration Pattern

```tsx
'use client'

import { AnswerInputWithCoach } from '@/components/answer-input-with-coach'

export default function ModulePage() {
  const [userAnswer, setUserAnswer] = useState('')
  const [reference, setReference] = useState('')

  const handleCoachTip = async (tip: string) => {
    // Handle coaching suggestion
    console.log('Coach tip:', tip)
  }

  return (
    <AnswerInputWithCoach
      question="Your question here"
      referenceLabel="Optional reference label"
      answerPlaceholder="Your answer placeholder"
      reference={reference}
      onReferenceChange={setReference}
      answer={userAnswer}
      onAnswerChange={setUserAnswer}
      onCoachTip={handleCoachTip}
    />
  )
}
```

## Modules by Priority (All 40 modules need this)

### P1 - CORE TRAINING (4 modules)
- [ ] entrenamiento-estructurado
- [ ] entrenamiento-guiado
- [ ] entrenamiento-conversacional
- [ ] value-mining-lab-* (Already done - Module 2)

### P2 - INTERVIEW SIMULATIONS (5 modules)
- [ ] simulaciones-maestria
- [ ] simulaciones-guiado
- [ ] simulaciones-desafiante
- [ ] basic-interview-mission
- [ ] conversational-interview

### P3 - SPECIALIZED TRAININGS (6 modules)
- [ ] risk-difficult-questions-lab
- [ ] answer-architecture
- [ ] metodo-star
- [ ] communication-gym
- [ ] coach-practice-room
- [ ] job-decoder

### P4 - SUPPORT TOOLS (5+ modules)
- [ ] cv-builder-studio
- [ ] ajuste-por-vacante
- [ ] career-mirror
- [ ] first-recruiter-simulation
- [ ] And other specialized modules

## Component Props Reference

```tsx
interface AnswerInputWithCoachProps {
  question: string              // Main question displayed
  referenceLabel?: string       // Label for text input (e.g., "Job Title")
  answerPlaceholder?: string    // Placeholder text
  reference?: string            // Text input value
  onReferenceChange?: (val: string) => void
  answer: string               // Textarea value
  onAnswerChange: (val: string) => void
  onCoachTip?: (tip: string) => void  // Called when user clicks "Obtener Sugerencia"
}
```

## Color Scheme (Consistent across all)
- Pillar 2 (Teal): rgb(80,160,170)
- All buttons and interactive elements use this color
- Transparent backgrounds with 0.2 opacity for hover states
- No red, no hardcoded purple, no strange underlayers

## Testing Checklist After Implementation
- [ ] Text input accepts reference/title
- [ ] Textarea captures full answer
- [ ] Microphone button works (speech-to-text)
- [ ] "Obtener Sugerencia" button calls OpenAI API
- [ ] Coach tip appears correctly
- [ ] Navigation buttons work
- [ ] No console errors
- [ ] Responsive on mobile

## Estimated Timeline
- P1: 2-3 hours
- P2: 3-4 hours
- P3: 4-5 hours
- P4: 3-4 hours
- Testing: 1-2 hours
- **Total: 13-18 hours for full rollout**

## Common Issues & Solutions

**Issue: Speech Recognition not working**
- Solution: Check browser support (Chrome, Edge, Safari OK)
- Ensure microphone permissions are granted

**Issue: Coach suggestions are empty**
- Solution: Verify OPENAI_API_KEY environment variable
- Check API quota and rate limits

**Issue: Component styling looks wrong**
- Solution: Ensure tailwind classes are correctly imported
- Verify pillar 2 color rgb(80,160,170) is applied

**Issue: Old red/purple styles still showing**
- Solution: Remove old Button className with hardcoded colors
- Replace entire button section with component

## Rollout Command
```bash
# After implementing all modules, run:
git add -A
git commit -m "feat: standardize all A3 modules with answer input component

- Implemented AnswerInputWithCoach across all 40 A3 modules (P1-P4)
- Integrated OpenAI API for real-time coaching suggestions
- Standardized STT microphone input with Spanish language support
- Unified color scheme using pillar 2 (rgb(80,160,170)) across all interactive elements
- Removed all hardcoded purple/red hover states
- Consistent transparent background styling

All modules now feature clean, minimal design with OpenAI-powered coaching."
```
"""
