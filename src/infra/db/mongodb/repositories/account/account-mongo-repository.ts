import {
  AccountReturnedByDbModel,
  AddAccountModel,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
  UpdateAccessTokenModel,
  LoadAccountByEmailRepository,
  AddAccountRepository,
  MongoHelper
} from './account-mongo-repository-protocols'

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

    const account = result.ops[0]

    return MongoHelper.makeAdapterForDefaultIdReturnedByDb(account)
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

    if (account) {
      return MongoHelper.makeAdapterForDefaultIdReturnedByDb(account)
    }

    return null
  }
}
