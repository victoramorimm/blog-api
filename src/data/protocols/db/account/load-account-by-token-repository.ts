import { AccountReturnedByDbModel } from '../../../../domain/models/account/account-returned-by-db'

export interface LoadAccountByTokenRepository {
  loadByToken: (accessToken: string) => Promise<AccountReturnedByDbModel>
}
