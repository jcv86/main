/**
 * Canonical A3 checkpoint mapping derived from the single module catalog.
 */

import type { A3Checkpoint } from './a2-mission.types'
import {
  A3_MODULES,
  getA3Module as getCatalogModule,
  getA3ModuleByNumber as getCatalogModuleByNumber,
  normalizeA3ModuleId,
} from '@/lib/a3/module-catalog'

export const A3_CHECKPOINT_MAP: Record<number, A3Checkpoint> = Object.fromEntries(
  A3_MODULES.map((module) => [
    module.checkpointDay,
    {
      moduleNumber: module.number,
      moduleId: module.id,
      moduleTitle: module.title,
      route: module.route,
      requiredPreviousModules: [...module.requiredPreviousModules],
    },
  ]),
)

export function getCheckpointDayForModule(moduleId: string): number | undefined {
  const module = getCatalogModule(moduleId)
  return module?.checkpointDay
}

export function getA3CheckpointForDay(day: number): A3Checkpoint | undefined {
  return A3_CHECKPOINT_MAP[day]
}

export function isA3CheckpointDay(day: number): boolean {
  return day in A3_CHECKPOINT_MAP
}

export function getAllCheckpointDays(): number[] {
  return A3_MODULES.map((module) => module.checkpointDay)
}

export function getNextCheckpointDay(currentDay: number): number | null {
  return getAllCheckpointDays().find((day) => day > currentDay) || null
}

export function getPreviousCheckpointDay(currentDay: number): number | null {
  return [...getAllCheckpointDays()].reverse().find((day) => day < currentDay) || null
}

export function getA3ModuleById(moduleId: string): A3Checkpoint | undefined {
  const module = getCatalogModule(moduleId)
  return module ? A3_CHECKPOINT_MAP[module.checkpointDay] : undefined
}

export function getA3ModuleByNumber(moduleNumber: number): A3Checkpoint | undefined {
  const module = getCatalogModuleByNumber(moduleNumber)
  return module ? A3_CHECKPOINT_MAP[module.checkpointDay] : undefined
}

export function arePreviousModulesCompleted(
  checkpoint: A3Checkpoint,
  completedModuleIds: string[],
): boolean {
  const completed = completedModuleIds
    .map(normalizeA3ModuleId)
    .filter((id): id is NonNullable<typeof id> => Boolean(id))

  return checkpoint.requiredPreviousModules.every((moduleId) =>
    completed.includes(normalizeA3ModuleId(moduleId)!),
  )
}
