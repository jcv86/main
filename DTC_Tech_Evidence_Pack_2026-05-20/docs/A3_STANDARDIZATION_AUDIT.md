## A3 Modules Standardization Audit

Total A3 Modules: 40

### Modules Using Textarea (Need Assessment):
- simulaciones-maestria
- simulaciones-guiado  
- simulaciones-desafiante
- risk-difficult-questions-lab
- basic-interview-mission
- ajuste-por-vacante
- conversational-interview
- cv-builder-studio
- communication-gym
- entrenamiento-desafiante
- entrenamiento-estructurado
- entrenamiento-conversacional
- answer-architecture
- coach-practice-room
- first-recruiter-simulation
- metodo-star
- value-mining-lab-text
- value-mining-lab-coach (Already updated)
- value-mining-lab-choice

### Key Requirements for Each:
1. **Text Input Field** - For reference/title
2. **Textarea** - For detailed answer
3. **STT Microphone** - Speech-to-text input
4. **Coach Panel** - AI suggestions via OpenAI
5. **Navigation Buttons** - Next/Previous

### Priority Order:
**P1 (Core Training Modules):**
- value-mining-lab (Module 2) - ✅ Already standardized
- entrenamiento-estructurado
- entrenamiento-guiado
- entrenamiento-conversacional

**P2 (Interview Simulations):**
- simulaciones-maestria
- simulaciones-guiado
- simulaciones-desafiante
- basic-interview-mission
- conversational-interview

**P3 (Specialized Trainings):**
- risk-difficult-questions-lab
- answer-architecture
- metodo-star
- communication-gym

**P4 (Support Tools):**
- coach-practice-room
- cv-builder-studio
- ajuste-por-vacante

### Implementation Strategy:
1. Start with P1 modules (core training paths)
2. Roll out to P2 (interview simulations)
3. Extend to P3 (specialized)
4. Apply to P4 (support tools)

Each module will be updated to use the AnswerInputWithCoach component with:
- Pillar 2 colors (rgb(80,160,170)) for all interactive elements
- Transparent backgrounds for clean aesthetic
- OpenAI API integration for coaching tips
- Browser STT support in Spanish (es-ES)
