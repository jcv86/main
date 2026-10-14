'use client'

import { OutcomeResponseCaptureForm, type OutcomeCaptureFormProps } from './outcome-response-capture-form'

export function A3InterviewOutcomeForm(props: OutcomeCaptureFormProps) {
  return <OutcomeResponseCaptureForm key={'a3-' + props.role} instrumentKey="a3_structured_interview" {...props} />
}
