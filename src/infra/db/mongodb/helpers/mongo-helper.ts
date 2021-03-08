import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,

  async connect(uri: string): Promise<void> {
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

  makeAdapterForDefaultIdReturnedByDb: (dataReturnedByDb: any) => {
    const { _id, ...dataWithoutId } = dataReturnedByDb

    return Object.assign({}, dataWithoutId, { id: _id })
  }
}
