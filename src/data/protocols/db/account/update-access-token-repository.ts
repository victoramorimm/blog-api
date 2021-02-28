import { AccountReturnedByDbModel } from '../../../models/account-returned-by-db-model'

export interface UpdateTokenModel {
  token: string
  id: string
}

export interface UpdateAccessTokenRepository {
  updateToken: (
    updateTokenData: UpdateTokenModel
  ) => Promise<AccountReturnedByDbModel>
}
