import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hashed_value'
  },

  async compare(): Promise<boolean> {
    return true
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut()

      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()

      const hash = await sut.hash('any_value')

      expect(hash).toBe('hashed_value')
    })

    test('Should throw if hash throws', async () => {
      const sut = makeSut()

      jest
        .spyOn(bcrypt, 'hash')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error()))
        )

      const promise = sut.hash('any_value')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()

      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare({
        value: 'any_value',
        valueToCompare: 'compare_value'
      })

      expect(compareSpy).toHaveBeenCalledWith('any_value', 'compare_value')
    })

    test('Should return false if compare returns false ', async () => {
      const sut = makeSut()

      jest
        .spyOn(bcrypt, 'compare')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)))

      const isCompareValid = await sut.compare({
        value: 'any_value',
        valueToCompare: 'compare_value'
      })

      expect(isCompareValid).toBeFalsy()
    })

    test('Should return true on compare success', async () => {
      const sut = makeSut()

      const isCompareValid = await sut.compare({
        value: 'any_value',
        valueToCompare: 'compare_value'
      })

      expect(isCompareValid).toBeTruthy()
    })

    test('Should throw if compare throws', async () => {
      const sut = makeSut()

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
        throw new Error()
      })

      const promise = sut.compare({
        value: 'any_value',
        valueToCompare: 'compare_value'
      })

      await expect(promise).rejects.toThrow()
    })
  })
})
