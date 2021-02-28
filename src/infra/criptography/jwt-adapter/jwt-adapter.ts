import {
  Encrypter,
  EncrypterModel
} from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string) {}

  async encrypt(encryptData: EncrypterModel): Promise<string> {
    const { value, secret } = encryptData

    return jwt.sign({ value }, secret)
  }
}
