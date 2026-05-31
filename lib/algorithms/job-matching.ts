/**
 * Job Matching Algorithm
 * Compares user skills and profile against job requirements
 * Generates match score (0-100) based on multiple factors
 */

export interface UserProfile {
  id: string;
  email: string;
  skills: string[];
  experience_years: number;
  industry?: string;
  current_title?: string;
  education?: string[];
  languages?: string[];
  competencies?: string[];
  career_goals?: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills_required: string[];
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  location: string;
  employment_type: string;
  industry: string;
  remote_allowed: boolean;
}

export interface MatchResult {
  job_id: string;
  match_score: number; // 0-100
  match_percentage: string;
  skills_match: SkillsMatch;
  experience_match: number;
  fit_category: 'perfect' | 'strong' | 'moderate' | 'potential' | 'low';
  match_reasons: string[];
  missing_skills: string[];
  salary_fit?: string;
}

export interface SkillsMatch {
  matched_skills: string[];
  missing_skills: string[];
  match_percentage: number;
  matched_count: number;
  total_required: number;
}

/**
 * Normalize skill names for comparison
 */
function normalizeSkill(skill: string): string {
  return skill
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s+#]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Create a skill similarity map (handles partial matches)
 */
function findSimilarSkills(
  userSkills: string[],
  requiredSkills: string[],
  maxDistance: number = 2
): Map<string, string> {
  const similarity = new Map<string, string>();
  const normalized_user = userSkills.map(normalizeSkill);

  for (const required of requiredSkills) {
    const normalized_required = normalizeSkill(required);
    
    // Exact match
    if (normalized_user.includes(normalized_required)) {
      similarity.set(normalized_required, normalized_required);
      continue;
    }

    // Find best partial match using Levenshtein distance
    let best_match = '';
    let best_distance = maxDistance + 1;

    for (const user_skill of normalized_user) {
      const distance = levenshteinDistance(user_skill, normalized_required);
      if (distance < best_distance) {
        best_distance = distance;
        best_match = user_skill;
      }
    }

    if (best_distance <= maxDistance) {
      similarity.set(normalized_required, best_match);
    }
  }

  return similarity;
}

/**
 * Levenshtein distance for string similarity
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Calculate experience level match
 * Returns 0-100 score based on user's years vs job requirement
 */
function calculateExperienceMatch(
  userYears: number,
  jobExperienceLevel: string
): { score: number; category: string } {
  const levelMap: Record<string, { min: number; max: number; ideal: number }> =
    {
      'entry-level': { min: 0, max: 2, ideal: 0 },
      junior: { min: 1, max: 3, ideal: 2 },
      'mid-level': { min: 3, max: 6, ideal: 4 },
      senior: { min: 5, max: 10, ideal: 7 },
      'lead': { min: 8, max: 15, ideal: 10 },
      'executive': { min: 10, max: 30, ideal: 15 },
    };

  const req = levelMap[jobExperienceLevel.toLowerCase()] || levelMap['mid-level'];

  // Calculate fit score
  if (userYears < req.min) {
    // User is underqualified
    return { score: (userYears / req.min) * 50, category: 'underqualified' };
  } else if (userYears >= req.min && userYears <= req.max) {
    // User is in range
    return { score: 100, category: 'perfect_fit' };
  } else {
    // User is overqualified (still good, score 90-100)
    return { score: 95, category: 'overqualified' };
  }
}

/**
 * Calculate salary fit
 * Returns string description and whether salary is attractive
 */
function calculateSalaryFit(
  userExpectation: number | undefined,
  jobMin: number | undefined,
  jobMax: number | undefined
): string {
  if (!jobMin || !jobMax) return 'Salary not disclosed';

  if (!userExpectation) return `${jobMin}k - ${jobMax}k`;

  if (userExpectation < jobMin) {
    return `Above your range (${jobMin}k - ${jobMax}k)`;
  } else if (userExpectation > jobMax) {
    return `Below your range (${jobMin}k - ${jobMax}k)`;
  } else {
    return `Within your range (${jobMin}k - ${jobMax}k)`;
  }
}

/**
 * Main matching function
 */
export function matchUserToJob(
  user: UserProfile,
  job: JobListing
): MatchResult {
  // 1. Skills matching
  const userSkills = [
    ...(user.skills || []),
    ...(user.competencies || []),
    ...(user.languages || []),
  ];

  const skillsSimilarity = findSimilarSkills(
    userSkills,
    job.skills_required || []
  );

  const matchedSkills = Array.from(skillsSimilarity.values()).filter(
    (s) => s !== ''
  );
  const missingSkills = (job.skills_required || []).filter(
    (req) => !skillsSimilarity.has(normalizeSkill(req))
  );

  const skillsMatch: SkillsMatch = {
    matched_skills: matchedSkills,
    missing_skills: missingSkills,
    matched_count: matchedSkills.length,
    total_required: job.skills_required?.length || 0,
    match_percentage:
      (job.skills_required?.length || 0) > 0
        ? (matchedSkills.length / (job.skills_required?.length || 1)) * 100
        : 100,
  };

  // 2. Experience matching
  const expMatch = calculateExperienceMatch(
    user.experience_years || 0,
    job.experience_level || 'mid-level'
  );

  // 3. Industry/domain matching (bonus points)
  let industryBonus = 0;
  if (user.industry && job.industry) {
    const userIndustryNorm = user.industry.toLowerCase();
    const jobIndustryNorm = job.industry.toLowerCase();
    if (
      userIndustryNorm.includes(jobIndustryNorm) ||
      jobIndustryNorm.includes(userIndustryNorm)
    ) {
      industryBonus = 10;
    }
  }

  // 4. Calculate overall score
  const weights = {
    skills: 0.5,
    experience: 0.3,
    industry: 0.1,
    languages: 0.1,
  };

  let languageScore = 0;
  if (user.languages?.includes('Spanish') || user.languages?.includes('English')) {
    languageScore = 100;
  }

  const overall_score =
    skillsMatch.match_percentage * weights.skills +
    expMatch.score * weights.experience +
    industryBonus * (weights.industry / 10) +
    languageScore * weights.languages;

  // 5. Determine fit category
  const fitCategories = (score: number): MatchResult['fit_category'] => {
    if (score >= 80) return 'perfect';
    if (score >= 65) return 'strong';
    if (score >= 50) return 'moderate';
    if (score >= 35) return 'potential';
    return 'low';
  };

  // 6. Generate match reasons
  const reasons: string[] = [];

  if (skillsMatch.match_percentage >= 80) {
    reasons.push(`${matchedSkills.length}/${skillsMatch.total_required} required skills matched`);
  } else if (skillsMatch.match_percentage >= 50) {
    reasons.push(
      `${matchedSkills.length} of ${skillsMatch.total_required} key skills present`
    );
  }

  if (expMatch.category === 'perfect_fit') {
    reasons.push('Experience level is a perfect match');
  } else if (expMatch.category === 'overqualified') {
    reasons.push('More experienced than typical for this role');
  }

  if (industryBonus > 0) {
    reasons.push('Industry experience aligns with role');
  }

  if (reasons.length === 0) {
    reasons.push('Potential growth opportunity');
  }

  return {
    job_id: job.id,
    match_score: Math.round(overall_score),
    match_percentage: `${Math.round(overall_score)}%`,
    skills_match: skillsMatch,
    experience_match: expMatch.score,
    fit_category: fitCategories(overall_score),
    match_reasons: reasons,
    missing_skills: missingSkills,
    salary_fit: calculateSalaryFit(undefined, job.salary_min, job.salary_max),
  };
}

/**
 * Batch match user to multiple jobs
 * Returns sorted by match score descending
 */
export function matchUserToJobs(
  user: UserProfile,
  jobs: JobListing[]
): MatchResult[] {
  const matches = jobs.map((job) => matchUserToJob(user, job));

  // Sort by match score descending
  return matches.sort((a, b) => b.match_score - a.match_score);
}

/**
 * Filter matches by score threshold
 */
export function filterByMatchScore(
  matches: MatchResult[],
  minScore: number = 50
): MatchResult[] {
  return matches.filter((m) => m.match_score >= minScore);
}
