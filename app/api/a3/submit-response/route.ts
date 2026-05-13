// API route to handle response submission and evaluation
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import {
  evaluateResponseWithLLM,
  autoScoreMultipleChoice,
} from '@/lib/a3-modules/llm-evaluation';
import type { EvaluationRequest } from '@/lib/a3-modules/llm-evaluation';
import type { TestContent, Question } from '@/lib/a3-modules/types';

// Initialize Supabase only if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      moduleId,
      sectionId,
      response,
      responseType,
      sectionContent,
    } = body;

    if (!userId || !moduleId || !sectionId || !response) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let score = 0;
    let feedback = '';
    let strengths: string[] = [];
    let improvements: string[] = [];

    // Auto-score multiple choice tests
    if (responseType === 'multiple-choice-test' && sectionContent?.type === 'test') {
      const testContent = sectionContent as TestContent;
      const correctAnswers = testContent.questions.map(
        (q: Question) => q.correctAnswer
      );
      const totalPoints = testContent.questions.reduce(
        (sum: number, q: Question) => sum + q.points,
        0
      );

      const earnedPoints = autoScoreMultipleChoice(
        response.answers,
        correctAnswers as string[],
        testContent.questions[0]?.points || 10
      );

      score = Math.round((earnedPoints / totalPoints) * 100);
      feedback = `Auto-graded test: ${earnedPoints}/${totalPoints} points`;
    }
    // LLM evaluation for interviews, free-response, and tasks
    else if (
      responseType === 'interview' ||
      responseType === 'free-response' ||
      responseType === 'task'
    ) {
      const rubric = sectionContent?.scoring?.llmRubric;
      if (!rubric) {
        return NextResponse.json(
          { error: 'No rubric available for LLM evaluation' },
          { status: 400 }
        );
      }

      const evaluationRequest: EvaluationRequest = {
        rubric: {
          criteria: rubric.criteria,
          totalPoints: rubric.criteria.reduce(
            (sum, c) => sum + (c.weight || 0),
            0
          ),
          instructions: rubric.instructions,
        },
        response: {
          type: responseType === 'interview' ? 'transcription' : 'text',
          content: response.text || response.transcription || '',
        },
        context: {
          moduleId,
          sectionId,
          questionAsked: response.questionAsked,
        },
      };

      const evaluation = await evaluateResponseWithLLM(evaluationRequest);
      score = evaluation.totalScore;
      feedback = evaluation.feedback;
      strengths = evaluation.strengths;
      improvements = evaluation.improvements;
    }

    // Store response and score in database
    const { data, error: storageError } = await supabase
      .from('a3_responses')
      .insert({
        user_id: userId,
        module_id: moduleId,
        section_id: sectionId,
        response_type: responseType,
        response_data: response,
        llm_score: score,
        llm_feedback: feedback,
        requires_review: false,
      })
      .select();

    if (storageError) {
      console.error('Error storing response:', storageError);
      return NextResponse.json(
        { error: 'Failed to store response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      score,
      feedback,
      strengths,
      improvements,
      responseId: data?.[0]?.id,
    });
  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate response' },
      { status: 500 }
    );
  }
}
