import { AccountReturnedByDbModel } from '../../../../domain/models/account/account-returned-by-db'

export interface LoadAccountByEmailRepository {
  loadByEmail: (value: string) => Promise<AccountReturnedByDbModel>
}
