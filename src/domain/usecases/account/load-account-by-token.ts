import { AccountReturnedByDbModel } from '../../models/account/account-returned-by-db'

export interface LoadAccountByToken {
  load: (accessToken: string) => Promise<AccountReturnedByDbModel>
}
