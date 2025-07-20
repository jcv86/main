export type Language = "en" | "es"

export interface Translations {
  // Navigation
  home: string
  dashboard: string
  profile: string
  settings: string
  login: string
  register: string
  logout: string
  personalityTest: string
  skillsAssessment: string
  softSkillsTest: string
  careerCoach: string
  cvBuilder: string
  jobSearch: string
  interviewSimulator: string

  // Common
  save: string
  cancel: string
  delete: string
  edit: string
  add: string
  remove: string
  next: string
  previous: string
  submit: string
  loading: string
  error: string
  success: string
  demoMode: string
  backToDashboard: string

  // Dashboard
  welcome: string
  welcomeBack: string
  welcomeMessage: string
  quickActions: string
  recentActivity: string
  recommendations: string
  yourProgress: string
  profileCompletion: string
  completedAssessments: string
  skillsTracked: string
  interviewsPracticed: string
  jobsMatched: string
  personalityAndSkills: string
  acrossCategories: string
  aiPoweredSessions: string
  basedOnProfile: string
  completeProfileForBetter: string
  personalityAssessment: string
  softSkillsAssessment: string
  recentActions: string
  completedDiscTest: string
  updatedCV: string
  practicedTechnicalInterview: string
  daysAgo: string
  weekAgo: string
  recommendationsForYou: string
  basedOnProfileActivity: string
  completeSoftSkills: string
  improveBySoftSkills: string
  startAssessment: string
  exploreJobOpportunities: string
  jobsMatchProfile: string
  viewJobs: string

  // Home Page
  welcomeTitle: string
  welcomeSubtitle: string
  getStarted: string
  signIn: string
  discoverPersonalityTraits: string
  evaluateTechnical: string
  personalizedAdvice: string
  createProfessionalCV: string
  instantDemoAccess: string

  // Personality Test
  questionOf: string
  complete: string
  rateAgreement: string
  stronglyDisagree: string
  disagree: string
  neutral: string
  agree: string
  stronglyAgree: string
  completeTest: string
  analyzing: string
  answerHonestly: string
  tipText: string
  assessmentComplete: string
  analyzingResponses: string
  progress: string

  // Big Five Traits
  openness: string
  conscientiousness: string
  extraversion: string
  agreeableness: string
  neuroticism: string
  opennessDesc: string
  conscientiousnessDesc: string
  extraversionDesc: string
  agreeablenessDesc: string
  neuroticismDesc: string

  // Question Types
  openEndedQuestion: string
  multipleChoiceQuestion: string
  scaleQuestion: string
  scenarioQuestion: string

  // Open-ended prompts
  describeYourself: string
  idealWorkEnvironment: string
  handleStress: string
  motivatesYou: string
  biggestStrength: string
  biggestWeakness: string
  leadershipStyle: string
  conflictResolution: string
  decisionMaking: string
  futureGoals: string

  // Soft Skills Test
  evaluateInterpersonalSkills: string
  communication: string
  leadership: string
  teamwork: string
  problemSolving: string
  adaptability: string
  emotionalIntelligence: string
  timeManagement: string
  detailedResults: string
  estimatedTime: string
  completeAssessment: string

  // CV Builder
  personalInfo: string
  workExperience: string
  education: string
  skills: string
  languages: string
  references: string
  preview: string
  download: string
  template: string
  modern: string
  classic: string
  creative: string
  minimal: string

  // Personal Info
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  postalCode: string
  dateOfBirth: string
  nationality: string
  maritalStatus: string
  summary: string

  // Work Experience
  jobTitle: string
  company: string
  startDate: string
  endDate: string
  current: string
  description: string
  addExperience: string

  // Education
  degree: string
  institution: string
  graduationDate: string
  gpa: string
  addEducation: string

  // Skills
  skillName: string
  skillLevel: string
  beginner: string
  intermediate: string
  advanced: string
  expert: string
  addSkill: string

  // Languages
  language: string
  proficiency: string
  native: string
  fluent: string
  conversational: string
  basic: string
  addLanguage: string

  // References
  referenceName: string
  referenceTitle: string
  referenceCompany: string
  referenceEmail: string
  referencePhone: string
  addReference: string

  // Career Coach
  askQuestion: string
  sendMessage: string
  marketInsights: string
  recentSessions: string

  // Job Search
  findJobs: string
  matchingJobs: string
  applyNow: string

  // Interview Simulator
  practiceInterview: string
  startSimulation: string

  // Auth
  signUp: string
  emailAddress: string
  password: string
  confirmPassword: string
  forgotPassword: string
  createAccount: string
  alreadyHaveAccount: string
  dontHaveAccount: string

  // Speech recognition
  speakResponse: string
  stopRecording: string
  listening: string
  voiceAvailable: string
  realTimeTranscription: string
  waitingForVoice: string
  clearTranscription: string
  speechNotSupported: string
  microphonePermissionDenied: string
  speechRecognitionError: string
}

export const translations: Record<Language, Translations> = {
  es: {
    // Navigation
    home: "Inicio",
    dashboard: "Panel",
    profile: "Perfil",
    settings: "Configuración",
    login: "Iniciar Sesión",
    register: "Registrarse",
    logout: "Cerrar Sesión",
    personalityTest: "Test de Personalidad",
    skillsAssessment: "Evaluación de Habilidades",
    softSkillsTest: "Habilidades Blandas",
    careerCoach: "Coach Profesional",
    cvBuilder: "Constructor de CV",
    jobSearch: "Búsqueda de Empleo",
    interviewSimulator: "Simulador de Entrevistas",

    // Common
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Agregar",
    remove: "Quitar",
    next: "Siguiente",
    previous: "Anterior",
    submit: "Enviar",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    demoMode: "Modo Demo",
    backToDashboard: "Volver al Dashboard",

    // Dashboard
    welcome: "Bienvenido",
    welcomeBack: "¡Bienvenido de vuelta!",
    welcomeMessage:
      "Continúa tu viaje de desarrollo profesional con insights impulsados por IA y recomendaciones personalizadas.",
    quickActions: "Acciones Rápidas",
    recentActivity: "Actividad Reciente",
    recommendations: "Recomendaciones",
    yourProgress: "Tu Progreso",
    profileCompletion: "Completitud del Perfil",
    completedAssessments: "Evaluaciones Completadas",
    skillsTracked: "Habilidades Seguidas",
    interviewsPracticed: "Entrevistas Practicadas",
    jobsMatched: "Empleos Compatibles",
    personalityAndSkills: "Personalidad y habilidades evaluadas",
    acrossCategories: "En 4 categorías",
    aiPoweredSessions: "Sesiones con IA",
    basedOnProfile: "Basado en tu perfil",
    completeProfileForBetter: "Completa tu perfil para mejores coincidencias de empleo",
    personalityAssessment: "Evaluación de Personalidad",
    softSkillsAssessment: "Evaluación de Habilidades Blandas",
    recentActions: "Tus últimas acciones en la plataforma",
    completedDiscTest: "Completaste el Test de Personalidad DISC",
    updatedCV: "Actualizaste tu CV con nueva experiencia",
    practicedTechnicalInterview: "Practicaste una entrevista técnica",
    daysAgo: "días",
    weekAgo: "semana",
    recommendationsForYou: "Recomendaciones para Ti",
    basedOnProfileActivity: "Basado en tu perfil y actividad",
    completeSoftSkills: "Completa tu Evaluación de Habilidades Blandas",
    improveBySoftSkills:
      "Mejora tu perfil completando la evaluación de habilidades blandas para obtener mejores coincidencias de empleo.",
    startAssessment: "Comenzar evaluación →",
    exploreJobOpportunities: "Explora Oportunidades de Empleo",
    jobsMatchProfile: "empleos que coinciden con tu perfil. Revisa las oportunidades disponibles.",
    viewJobs: "Ver empleos →",

    // Home Page
    welcomeTitle: "Impulsa tu Carrera con IA",
    welcomeSubtitle:
      "Descubre tu personalidad, evalúa tus habilidades y recibe coaching personalizado para acelerar tu desarrollo profesional.",
    getStarted: "Comenzar",
    signIn: "Iniciar Sesión",
    discoverPersonalityTraits: "Descubre tus rasgos únicos de personalidad",
    evaluateTechnical: "Evalúa tus habilidades técnicas y blandas",
    personalizedAdvice: "Recibe consejos personalizados de carrera",
    createProfessionalCV: "Crea tu CV profesional con IA",
    instantDemoAccess: "Acceso Instantáneo al Demo",

    // Personality Test
    questionOf: "Pregunta",
    complete: "Completo",
    rateAgreement: "Califica qué tanto estás de acuerdo con esta afirmación",
    stronglyDisagree: "Totalmente en Desacuerdo",
    disagree: "En Desacuerdo",
    neutral: "Neutral",
    agree: "De Acuerdo",
    stronglyAgree: "Totalmente de Acuerdo",
    completeTest: "Completar Test",
    analyzing: "Analizando...",
    answerHonestly:
      "Responde honestamente basándote en cómo te comportas típicamente, no en cómo crees que deberías comportarte. No hay respuestas correctas o incorrectas.",
    tipText: "Consejo:",
    assessmentComplete: "¡Evaluación Completada!",
    analyzingResponses: "Analizando tus respuestas y generando tu perfil de personalidad...",
    progress: "Progreso",

    // Big Five Traits
    openness: "Apertura",
    conscientiousness: "Responsabilidad",
    extraversion: "Extraversión",
    agreeableness: "Amabilidad",
    neuroticism: "Neuroticismo",

    // Big Five descriptions
    opennessDesc: "Apertura a nuevas experiencias, creatividad e imaginación",
    conscientiousnessDesc: "Organización, disciplina y orientación a objetivos",
    extraversionDesc: "Sociabilidad, asertividad y búsqueda de estimulación",
    agreeablenessDesc: "Cooperación, confianza y consideración hacia otros",
    neuroticismDesc: "Estabilidad emocional y manejo del estrés",

    // Question types
    scaleQuestion: "Pregunta de Escala",
    openEndedQuestion: "Pregunta Abierta",
    multipleChoiceQuestion: "Opción Múltiple",
    scenarioQuestion: "Escenario",

    // Speech recognition
    speakResponse: "Hablar respuesta",
    stopRecording: "Detener grabación",
    listening: "Escuchando...",
    voiceAvailable: "Voz disponible",
    realTimeTranscription: "Transcripción en tiempo real:",
    waitingForVoice: "Esperando tu voz...",
    clearTranscription: "Limpiar",
    speechNotSupported: "Tu navegador no soporta reconocimiento de voz",
    microphonePermissionDenied: "Permiso de micrófono denegado",
    speechRecognitionError: "Error en el reconocimiento de voz",
  },
  en: {
    // Navigation
    home: "Home",
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    login: "Login",
    register: "Register",
    logout: "Logout",
    personalityTest: "Personality Test",
    skillsAssessment: "Skills Assessment",
    softSkillsTest: "Soft Skills Test",
    careerCoach: "Career Coach",
    cvBuilder: "CV Builder",
    jobSearch: "Job Search",
    interviewSimulator: "Interview Simulator",

    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    remove: "Remove",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    demoMode: "Demo Mode",
    backToDashboard: "Back to Dashboard",

    // Dashboard
    welcome: "Welcome",
    welcomeBack: "Welcome back!",
    welcomeMessage:
      "Continue your career development journey with AI-powered insights and personalized recommendations.",
    quickActions: "Quick Actions",
    recentActivity: "Recent Activity",
    recommendations: "Recommendations",
    yourProgress: "Your Progress",
    profileCompletion: "Profile Completion",
    completedAssessments: "Completed Assessments",
    skillsTracked: "Skills Tracked",
    interviewsPracticed: "Interviews Practiced",
    jobsMatched: "Jobs Matched",
    personalityAndSkills: "Personality & skills evaluated",
    acrossCategories: "Across 4 categories",
    aiPoweredSessions: "AI-powered sessions",
    basedOnProfile: "Based on your profile",
    completeProfileForBetter: "Complete your profile for better job matching",
    personalityAssessment: "Personality Assessment",
    softSkillsAssessment: "Soft Skills Assessment",
    recentActions: "Your latest actions on the platform",
    completedDiscTest: "Completed DISC Personality Test",
    updatedCV: "Updated your CV with new experience",
    practicedTechnicalInterview: "Practiced a technical interview",
    daysAgo: "days ago",
    weekAgo: "week ago",
    recommendationsForYou: "Recommendations for You",
    basedOnProfileActivity: "Based on your profile and activity",
    completeSoftSkills: "Complete your Soft Skills Assessment",
    improveBySoftSkills: "Improve your profile by completing the soft skills assessment for better job matches.",
    startAssessment: "Start assessment →",
    exploreJobOpportunities: "Explore Job Opportunities",
    jobsMatchProfile: "jobs match your profile. Check out available opportunities.",
    viewJobs: "View jobs →",

    // Home Page
    welcomeTitle: "Supercharge Your Career with AI",
    welcomeSubtitle:
      "Discover your personality, assess your skills, and get personalized coaching to accelerate your professional development.",
    getStarted: "Get Started",
    signIn: "Sign In",
    discoverPersonalityTraits: "Discover your unique personality traits",
    evaluateTechnical: "Evaluate your technical and soft skills",
    personalizedAdvice: "Get personalized career advice",
    createProfessionalCV: "Create your professional CV with AI",
    instantDemoAccess: "Instant Demo Access",

    // Personality Test
    questionOf: "Question",
    complete: "Complete",
    rateAgreement: "Rate how much you agree with this statement",
    stronglyDisagree: "Strongly Disagree",
    disagree: "Disagree",
    neutral: "Neutral",
    agree: "Agree",
    stronglyAgree: "Strongly Agree",
    completeTest: "Complete Test",
    analyzing: "Analyzing...",
    answerHonestly:
      "Answer honestly based on how you typically behave, not how you think you should behave. There are no right or wrong answers.",
    tipText: "Tip:",
    assessmentComplete: "Assessment Complete!",
    analyzingResponses: "Analyzing your responses and generating your personality profile...",
    progress: "Progress",

    // Big Five Traits
    openness: "Openness",
    conscientiousness: "Conscientiousness",
    extraversion: "Extraversion",
    agreeableness: "Agreeableness",
    neuroticism: "Neuroticism",

    // Big Five descriptions
    opennessDesc: "Openness to new experiences, creativity and imagination",
    conscientiousnessDesc: "Organization, discipline and goal orientation",
    extraversionDesc: "Sociability, assertiveness and stimulation seeking",
    agreeablenessDesc: "Cooperation, trust and consideration for others",
    neuroticismDesc: "Emotional stability and stress management",

    // Question types
    scaleQuestion: "Scale Question",
    openEndedQuestion: "Open-Ended Question",
    multipleChoiceQuestion: "Multiple Choice",
    scenarioQuestion: "Scenario",

    // Speech recognition
    speakResponse: "Speak Response",
    stopRecording: "Stop Recording",
    listening: "Listening...",
    voiceAvailable: "Voice Available",
    realTimeTranscription: "Real-time transcription:",
    waitingForVoice: "Waiting for your voice...",
    clearTranscription: "Clear",
    speechNotSupported: "Your browser doesn't support speech recognition",
    microphonePermissionDenied: "Microphone permission denied",
    speechRecognitionError: "Speech recognition error",
  },
}

export function getTranslation(language: Language, key: keyof Translations): string {
  return translations[language][key] || translations.es[key]
}
