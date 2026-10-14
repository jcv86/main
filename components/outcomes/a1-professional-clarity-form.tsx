'use client'

import { OutcomeResponseCaptureForm, type OutcomeCaptureFormProps } from './outcome-response-capture-form'

export function A1ProfessionalClarityForm(props: OutcomeCaptureFormProps) {
  return <OutcomeResponseCaptureForm key={'a1-' + props.role} instrumentKey="a1_professional_clarity" {...props} />
}
