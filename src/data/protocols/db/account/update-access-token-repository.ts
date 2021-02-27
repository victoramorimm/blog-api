import { AccountReturnedByDbModel } from '../../../models/account-returned-by-db-model'

export interface UpdateAccessTokenRepository {
  updateToken: (token: string) => Promise<AccountReturnedByDbModel>
}
