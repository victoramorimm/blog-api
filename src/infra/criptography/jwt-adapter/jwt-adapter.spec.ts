import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const secret = 'any_secret'

    const sut = new JwtAdapter(secret)

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt({
      value: 'any_value',
      secret
    })

    expect(signSpy).toHaveBeenCalledWith({ value: 'any_value' }, secret)
  })
})
