import { AccountReturnedByDbModel } from '../../../../../data/models/account-returned-by-db-model'
import { AddAccountModel } from '../../../../../data/models/add-account-model'
import { LoadAccountByTokenRepository } from '../../../../../data/protocols/db/account/load-account-by-token-repository'
import {
  UpdateAccessTokenRepository,
  UpdateAccessTokenModel
} from '../../../../../data/protocols/db/account/update-access-token-repository'
import {
  AddAccountRepository,
  LoadAccountByEmailRepository
} from '../../../../../data/usecases/add-account/db-add-account-protocols'
import { makeAdaptationOfAccountIdReturnedByDb } from '../../factories/account/adaptation-of-account-id-factory'
import { MongoHelper } from '../../helpers/mongo-helper'

export class AccountMongoRepository
  implements
    LoadAccountByEmailRepository,
    AddAccountRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository {
  async loadByEmail(email: string): Promise<AccountReturnedByDbModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({ email })

    if (account) {
      return MongoHelper.makeAdapterForDefaultIdReturnedByDb(account)
    }

    return null
  }

  async add(accountData: AddAccountModel): Promise<AccountReturnedByDbModel> {
    const publicationCollection = await MongoHelper.getCollection(
      'publications'
    )

    const result = await publicationCollection.insertOne(accountData)

    return await makeAdaptationOfAccountIdReturnedByDb(result)
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

  async loadByToken(token: string): Promise<AccountReturnedByDbModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({
      token
    })

    return MongoHelper.makeAdapterForDefaultIdReturnedByDb(account)
  }
}
