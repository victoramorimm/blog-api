export interface AuthenticationModel {
  email: string
  password: string
}

export interface Authentication {
  authenticate: (authenticationData: AuthenticationModel) => Promise<string>
}
