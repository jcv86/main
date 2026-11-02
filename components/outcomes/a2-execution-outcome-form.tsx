'use client'
import { OutcomeResponseCaptureForm, type OutcomeCaptureFormProps } from './outcome-response-capture-form'
export function A2ExecutionOutcomeForm(props: OutcomeCaptureFormProps) {
  return <OutcomeResponseCaptureForm key={'a2_execution_checkpoint:' + props.role} instrumentKey="a2_execution_checkpoint" {...props} />
}
