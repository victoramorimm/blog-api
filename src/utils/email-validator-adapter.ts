import { EmailValidator } from '../presentation/protocols'
import validator from 'validator'

export class EmailValidatorAdapter implements EmailValidator {
  validate(email: string): boolean {
    validator.isEmail(email)

    return null
  }
}
