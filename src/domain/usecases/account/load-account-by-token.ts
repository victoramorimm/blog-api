import { AccountReturnedByDbModel } from '../../models/account/account-returned-by-db'

export interface LoadAccountByToken {
  load: (token: string) => Promise<AccountReturnedByDbModel>
}
