/**
 * Statistical utility functions for A/B testing analysis
 */

export interface ABTestMetrics {
  sampleSize: number
  mean: number
  stdDev: number
}

export interface StatisticalTestResult {
  pValue: number
  zScore: number
  isSignificant: boolean
  confidenceLevel: number
  effectSize: number
}

export interface ConfidenceInterval {
  lower: number
  upper: number
  mean: number
  confidenceLevel: number
}

/**
 * Calculate standard deviation from array of values
 */
export function calculateStdDev(values: number[], mean: number): number {
  if (values.length === 0) return 0
  const squaredDiffs = values.map((v) => Math.pow(v - mean, 2))
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length
  return Math.sqrt(variance)
}

/**
 * Calculate z-score for two-sample z-test
 */
export function calculateZScore(control: ABTestMetrics, variant: ABTestMetrics): number {
  const meanDiff = variant.mean - control.mean
  const pooledStdError = Math.sqrt(control.stdDev ** 2 / control.sampleSize + variant.stdDev ** 2 / variant.sampleSize)

  if (pooledStdError === 0) return 0
  return meanDiff / pooledStdError
}

/**
 * Calculate p-value from z-score (two-tailed test)
 * Using standard normal distribution approximation
 */
export function calculatePValue(zScore: number): number {
  const absZ = Math.abs(zScore)
  // Approximation of cumulative distribution function for standard normal
  const t = 1 / (1 + 0.2316419 * absZ)
  const d = 0.3989423 * Math.exp((-absZ * absZ) / 2)
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))

  // Two-tailed test
  return 2 * probability
}

/**
 * Calculate confidence interval for a metric
 */
export function calculateConfidenceInterval(
  mean: number,
  stdDev: number,
  sampleSize: number,
  confidenceLevel = 0.95,
): ConfidenceInterval {
  // Z-score for confidence level (1.96 for 95%, 2.576 for 99%)
  const zScore = confidenceLevel === 0.99 ? 2.576 : confidenceLevel === 0.95 ? 1.96 : 1.645
  const standardError = stdDev / Math.sqrt(sampleSize)
  const marginOfError = zScore * standardError

  return {
    lower: Math.max(0, mean - marginOfError),
    upper: mean + marginOfError,
    mean,
    confidenceLevel,
  }
}

/**
 * Calculate Cohen's d effect size
 */
export function calculateEffectSize(control: ABTestMetrics, variant: ABTestMetrics): number {
  const pooledStdDev = Math.sqrt(
    ((control.sampleSize - 1) * control.stdDev ** 2 + (variant.sampleSize - 1) * variant.stdDev ** 2) /
      (control.sampleSize + variant.sampleSize - 2),
  )

  if (pooledStdDev === 0) return 0
  return (variant.mean - control.mean) / pooledStdDev
}

/**
 * Perform complete statistical test for A/B testing
 */
export function performStatisticalTest(
  control: ABTestMetrics,
  variant: ABTestMetrics,
  significanceLevel = 0.05,
): StatisticalTestResult {
  const zScore = calculateZScore(control, variant)
  const pValue = calculatePValue(zScore)
  const effectSize = calculateEffectSize(control, variant)

  return {
    pValue,
    zScore,
    isSignificant: pValue < significanceLevel,
    confidenceLevel: 1 - significanceLevel,
    effectSize,
  }
}

/**
 * Interpret effect size (Cohen's d)
 */
export function interpretEffectSize(effectSize: number): string {
  const absEffect = Math.abs(effectSize)
  if (absEffect < 0.2) return "negligible"
  if (absEffect < 0.5) return "small"
  if (absEffect < 0.8) return "medium"
  return "large"
}

/**
 * Check if sample size is sufficient for reliable results
 */
export function isSampleSizeSufficient(sampleSize: number, minimumRequired = 30): boolean {
  return sampleSize >= minimumRequired
}
