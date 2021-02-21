import { AccountReturnedByDbModel } from '../../../../domain/models/account-returned-by-db'

export interface LoadAccountByEmailRepository {
  loadByEmail: (value: string) => Promise<AccountReturnedByDbModel>
}
