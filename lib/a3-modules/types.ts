// Core module types - unified architecture for all 10 modules

export type ModuleType = 'lecture' | 'test' | 'interview' | 'task' | 'simulation';
export type SectionType = 'lecture' | 'test' | 'interview' | 'task' | 'simulation';
export type ScoringMethod = 'auto' | 'llm' | 'manual' | 'mixed';

// Lecture content
export interface LectureContent {
  videoUrl: string;
  duration: number; // seconds
  subtitles?: string;
  transcript?: string;
  slides?: string[];
  learningObjectives: string[];
  keyPoints: string[];
  resources?: Array<{ title: string; url: string }>;
}

// Question types for tests
export interface Question {
  id: string;
  type: 'multiple-choice' | 'free-response' | 'code' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[] | { code: string; tests: string[] };
  explanation: string;
  points: number;
  hints?: string[];
}

// Test content
export interface TestContent {
  questions: Question[];
  timeLimit?: number; // seconds
  randomizeOrder: boolean;
  passingScore: number; // percentage
  showCorrectAnswersImmediately: boolean;
}

// Interview content
export interface InterviewContent {
  scenario: string;
  prompt: string;
  interviewerName?: string;
  videoPrompt?: string;
  recordingTime: number; // seconds max
  evaluationRubric: {
    criteria: Array<{
      name: string;
      weight: number;
      description: string;
    }>;
  };
}

// Task content
export interface TaskContent {
  instructions: string;
  files?: Array<{
    name: string;
    content: string;
  }>;
  submissionType: 'text' | 'file' | 'link' | 'url';
  evaluationCriteria: string[];
  rubric?: RubricScoring;
  resources?: string[];
}

// Simulation stage
export interface Stage {
  id: string;
  type: 'lecture' | 'test' | 'interview' | 'task';
  content:
    | LectureContent
    | TestContent
    | InterviewContent
    | TaskContent;
  passingScore?: number;
  feedback?: string;
}

// Simulation content
export interface SimulationContent {
  title: string;
  scenario: string;
  stages: Stage[];
  totalDuration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Scoring rules
export interface ScoringRule {
  method: ScoringMethod;
  autoScoringLogic?: (userAnswer: string) => number;
  llmRubric?: {
    criteria: Array<{ name: string; weight: number }>;
    instructions: string;
  };
  requiresManualReview: boolean;
  maxPoints: number;
  passingPoints: number;
}

// Section definition
export interface Section {
  id: string;
  type: SectionType;
  title: string;
  description: string;
  content:
    | LectureContent
    | TestContent
    | InterviewContent
    | TaskContent
    | SimulationContent;
  scoring: ScoringRule;
  required: boolean;
}

// Main module definition
export interface Module {
  id: string;
  name: string;
  description: string;
  level: 1 | 2 | 3 | 4;
  xp: number;
  estimatedDuration: number; // minutes
  sections: Section[];
  passingScore: number; // percentage
  allowRetakes: boolean;
  prerequisites: string[]; // module IDs
  nextModule?: string;
}

// User response
export interface UserResponse {
  sectionId: string;
  responseType: 'text' | 'audio' | 'video' | 'file';
  responseData: Record<string, any>;
  submittedAt: string;
}

// Module progress
export interface ModuleProgress {
  moduleId: string;
  userId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  currentSectionId: string;
  sectionScores: Record<string, number>;
  finalScore: number;
  attempts: number;
  startedAt: string;
  completedAt?: string;
}

// LLM evaluation response
export interface EvaluationResponse {
  totalScore: number;
  criteriaScores: Record<string, number>;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

// Rubric scoring
export interface RubricScoring {
  criteria: Array<{
    name: string;
    weight: number;
    description: string;
    maxPoints: number;
  }>;
  totalPoints: number;
  instructions: string;
}
