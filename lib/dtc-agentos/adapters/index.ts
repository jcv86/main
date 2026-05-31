/**
 * DTC AgentOS - Adapters Index
 * 
 * Central export for all flow adapters that connect
 * existing DTC components to the AgentOS memory system.
 */

// C1/A1 - DISC Assessment Flow
export {
  onC1Complete,
  onA1Complete,
} from './c1-a1-adapter'

// C2/A2 - Professional Profile Flow
export {
  onC2ProfileComplete,
  onC2GoalsComplete,
  onA2Complete,
} from './c2-a2-adapter'

// A3 - Training Modules Flow
export {
  onA3SessionStart,
  onA3Interaction,
  onA3ModuleComplete,
  MODULE_AGENT_MAPPING,
} from './a3-adapter'

// A4 - Document Generation Flow
export {
  onA4DocumentGenerated,
  checkA4Readiness,
} from './a4-adapter'


