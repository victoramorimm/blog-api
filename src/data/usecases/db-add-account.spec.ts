import { DbAddAccount } from './db-add-account'
import {
  Hasher,
  AddAccount,
  AddAccountModel,
  AccountReturnedByDbModel,
  LoadAccountByEmailRepository,
  AddAccountRepository
} from './db-add-account-protocols'

export const makeFakeAddAccountData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return 'hashed_value'
    }
  }

  return new HasherStub()
}

const makeFakeAccountReturnedByLoadAccountByEmailRepositoryStub = (): AccountReturnedByDbModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAccountReturnedByAddAccountRepositoryStub = (): AccountReturnedByDbModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepositoryStub {
    async loadByEmail(value: string): Promise<AccountReturnedByDbModel> {
      return await new Promise((resolve) => resolve(null))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountReturnedByDbModel> {
      const fakeAccount = makeFakeAccountReturnedByAddAccountRepositoryStub()

      return await new Promise((resolve) => resolve(fakeAccount))
    }
  }

  return new AddAccountRepositoryStub()
}

type SutTypes = {
  sut: AddAccount
  hasherStub: Hasher
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub()

  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()

  const addAccountRepositoryStub = makeAddAccountRepositoryStub()

  const sut = new DbAddAccount(
    hasherStub,
    loadAccountByEmailRepositoryStub,
    addAccountRepositoryStub
  )

  return {
    sut,
    hasherStub,
    loadAccountByEmailRepositoryStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()

    const hashSpy = jest.spyOn(hasherStub, 'hash')

    const fakeAccountData = makeFakeAddAccountData()

    await sut.add(fakeAccountData)

    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()

    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })

    const fakeAccountData = makeFakeAddAccountData()

    const promise = sut.add(fakeAccountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadAccountByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )

    const fakeAccountData = makeFakeAddAccountData()

    await sut.add(fakeAccountData)

    expect(loadAccountByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const fakeAccount = makeFakeAccountReturnedByLoadAccountByEmailRepositoryStub()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValue(new Promise((resolve) => resolve(fakeAccount)))

    const fakeAccountData = makeFakeAddAccountData()

    const account = await sut.add(fakeAccountData)

    expect(account).toBeNull()
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    const fakeAccountData = makeFakeAddAccountData()

    const promise = sut.add(fakeAccountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const loadAccountByEmailSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const fakeAccountData = makeFakeAddAccountData()

    await sut.add(fakeAccountData)

    expect(loadAccountByEmailSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return null if AddAccountRepository returns null', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValue(new Promise((resolve) => resolve(null)))

    const fakeAccountData = makeFakeAddAccountData()

    const account = await sut.add(fakeAccountData)

    expect(account).toBeNull()
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const fakeAccountData = makeFakeAddAccountData()

    const promise = sut.add(fakeAccountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const fakeAccountData = makeFakeAddAccountData()

    const account = await sut.add(fakeAccountData)

    expect(account).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })
  })
})
