import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  uri: null as string,
  client: null as MongoClient,

  async connect(uri: string): Promise<void> {
    this.uri = uri

    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect(): Promise<void> {
    await this.client.close()
  },

  async getCollection(name: string): Promise<Collection> {
    return this.client.db().collection(name)
  },

  makeAdapterForDefaultIdReturnedByDb: (account: any) => {
    const { _id, ...accountWithoutId } = account

    return Object.assign({}, accountWithoutId, { id: _id })
  }
}
