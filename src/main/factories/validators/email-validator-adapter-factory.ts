import { EmailValidator } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeEmailValidatorAdapter = (): EmailValidator => {
  return new EmailValidatorAdapter()
}
