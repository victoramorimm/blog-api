import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  test('Should call isEmail with correct value', () => {
    const sut = new EmailValidatorAdapter()

    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.validate('any_email@mail.com')

    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return false if isEmail returns false', () => {
    const sut = new EmailValidatorAdapter()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isEmailValid = sut.validate('any_email@mail.com')

    expect(isEmailValid).toBeFalsy()
  })

  test('Should return true if isEmail returns true', () => {
    const sut = new EmailValidatorAdapter()

    const isEmailValid = sut.validate('any_email@mail.com')

    expect(isEmailValid).toBeTruthy()
  })
})
