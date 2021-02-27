export interface EncrypterModel {
  value: string
  secret: string
}

export interface Encrypter {
  encrypt: (encrypterData: EncrypterModel) => Promise<string>
}
