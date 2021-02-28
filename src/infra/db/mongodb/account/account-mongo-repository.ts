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
    const accountCollection = await MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)

    const accountReturnedByDb = result.ops[0]

    return MongoHelper.makeAdapterForDefaultIdReturnedByDb(accountReturnedByDb)
  }

  async updateAccessToken(
    updateTokenData: UpdateAccessTokenModel
  ): Promise<AccountReturnedByDbModel> {
    const { id, token } = updateTokenData

    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.updateOne(
      {
        _id: id
      },
      {
        $set: {
          token: token
        }
      }
    )

    return MongoHelper.makeAdapterForDefaultIdReturnedByDb(account)
  }
}
