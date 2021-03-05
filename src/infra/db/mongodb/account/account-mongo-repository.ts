import { AccountReturnedByDbModel } from '../../../../data/models/account-returned-by-db-model'
import { AddAccountModel } from '../../../../data/models/add-account-model'
import {
  UpdateAccessTokenRepository,
  UpdateAccessTokenModel
} from '../../../../data/protocols/db/account/update-access-token-repository'
import {
  AddAccountRepository,
  LoadAccountByEmailRepository
} from '../../../../data/usecases/add-account/db-add-account-protocols'
import { makeAdditionOfAccountOnDb } from '../factories/account/addition-of-publication-on-db-factory'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository
  implements
    LoadAccountByEmailRepository,
    AddAccountRepository,
    UpdateAccessTokenRepository {
  async loadByEmail(email: string): Promise<AccountReturnedByDbModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({ email })

    if (account) {
      return MongoHelper.makeAdapterForDefaultIdReturnedByDb(account)
    }

    return null
  }

  async add(accountData: AddAccountModel): Promise<AccountReturnedByDbModel> {
    return await makeAdditionOfAccountOnDb(accountData)
  }

  async updateAccessToken(
    updateAccessTokenData: UpdateAccessTokenModel
  ): Promise<AccountReturnedByDbModel> {
    const { id, accessToken } = updateAccessTokenData

    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.updateOne(
      {
        _id: id
      },
      {
        $set: {
          accessToken
        }
      }
    )

    return MongoHelper.makeAdapterForDefaultIdReturnedByDb(account)
  }
}
