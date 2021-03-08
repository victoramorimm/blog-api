import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeEmailValidatorAdapter = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}
