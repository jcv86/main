/**
 * Browser APIs Type Definitions
 * Provides proper types for browser APIs that lack native TypeScript support
 */

/** SpeechRecognition API Types */
export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: SpeechRecognitionErrorCode;
}

export type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'audio-capture'
  | 'not-allowed'
  | 'network'
  | 'aborted'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'service-unavailable'
  | 'timeout'
  | 'no-match';

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionAPI extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  language: string;
  onstart: ((this: SpeechRecognitionAPI, ev: Event) => unknown) | null;
  onresult: ((this: SpeechRecognitionAPI, ev: SpeechRecognitionEvent) => unknown) | null;
  onerror: ((this: SpeechRecognitionAPI, ev: SpeechRecognitionErrorEvent) => unknown) | null;
  onend: ((this: SpeechRecognitionAPI, ev: Event) => unknown) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

/** Navigator Connection API Types */
export interface NetworkInformation extends EventTarget {
  downlink?: number;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g' | '5g';
  rtt?: number;
  saveData?: boolean;
  onchange?: ((this: NetworkInformation, ev: Event) => unknown) | null;
}

/** Window augmentation for Speech Recognition - using optional properties to avoid conflicts */
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionAPI;
    webkitSpeechRecognition?: new () => SpeechRecognitionAPI;
  }

  interface Navigator {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  }
}

export type {}; // Ensure this file is treated as a module
