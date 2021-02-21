import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator Adapter', () => {
  test('Should call isEmail with correct value', () => {
    const sut = new EmailValidatorAdapter()

    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.validate('any_email@mail.com')

    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
