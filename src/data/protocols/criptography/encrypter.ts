export interface Encrypter {
  encrypt: (value: string, secret: string) => Promise<string>
}
