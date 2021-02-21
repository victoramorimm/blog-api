import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hashed_value'
  }
}))

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    const salt = 12

    const sut = new BcryptAdapter(salt)

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a valid hash on success', async () => {
    const salt = 12

    const sut = new BcryptAdapter(salt)

    const hash = await sut.hash('any_value')

    expect(hash).toBe('hashed_value')
  })
})
