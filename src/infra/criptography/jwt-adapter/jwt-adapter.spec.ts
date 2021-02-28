import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

const secret = 'any_secret'

const makeSut = (): JwtAdapter => {
  return new JwtAdapter(secret)
}

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = makeSut()

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_value')

    expect(signSpy).toHaveBeenCalledWith({ value: 'any_value' }, secret)
  })

  test('Should throw if sign throws', async () => {
    const sut = makeSut()

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })

    const accessToken = sut.encrypt('any_value')

    await expect(accessToken).rejects.toThrow()
  })
})
