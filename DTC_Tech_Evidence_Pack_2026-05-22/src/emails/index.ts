import React from 'react'
import { WelcomeEmail } from './welcome'
import { TestCompleteEmail } from './test-complete'

export { WelcomeEmail, TestCompleteEmail }

export const EmailTemplates = {
  Welcome: WelcomeEmail,
  TestComplete: TestCompleteEmail,
}
