import { AccountReturnedByDbModel } from '../../../../domain/models/account/account-returned-by-db'

export interface UpdateAccessTokenModel {
  accessToken: string
  id: string
}

export interface UpdateAccessTokenRepository {
  updateAccessToken: (
    updateAccessTokenData: UpdateAccessTokenModel
  ) => Promise<AccountReturnedByDbModel>
}
