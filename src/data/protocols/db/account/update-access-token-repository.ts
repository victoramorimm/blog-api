import { AccountReturnedByDbModel } from '../../../models/account-returned-by-db-model'

export interface UpdateAccessTokenModel {
  accessToken: string
  id: string
}

export interface UpdateAccessTokenRepository {
  updateAccessToken: (
    updateAccessTokenData: UpdateAccessTokenModel
  ) => Promise<AccountReturnedByDbModel>
}
